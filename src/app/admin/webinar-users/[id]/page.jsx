"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
// Import Modal components from react-bootstrap (Added Row, Col, and Spinner)
import { ProgressBar, Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { isAuthenticated } from '@/services/admin-auth';
import { FaPaperPlane, FaEdit } from "react-icons/fa";
export default function SessionUsers() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionTitle, setSessionTitle] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [sessionStatus, setSessionStatus] = useState('');
    const [youtubeLink, setYoutubeLink] = useState(false);

    // --- Certificate sending state & progress state ---
    const [sendingStatus, setSendingStatus] = useState('idle');
    const [sendingResult, setSendingResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef(null);

    // --- Simplified loading state for sending mail ---
    const [isSendingMail, setIsSendingMail] = useState(false);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- Search State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState('all'); // 'all', 'name', 'email'

    // --- Consolidated submitting state for both modals ---
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Add User Modal State ---
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        user_email: '',
        school: '',
        designation: '',
        contact: ''
    });

    // --- Edit User Modal State ---
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Will hold the user object to edit

    // --- Import Excel Modal State ---
    const [showImportModal, setShowImportModal] = useState(false);
    const [excelFile, setExcelFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importResults, setImportResults] = useState(null);
    const handleSendMail = async () => {
        if (userRegistrations.length === 0) {
            toast.info('No registrations available to send invites to.');
            return;
        }

        if (!window.confirm(`Are you sure you want to send a "Join Now" email invite to ${userRegistrations.length} users?`)) {
            return;
        }

        setIsSendingMail(true);
        const toastId = toast.loading("Sending invites...");

        try {
            const formData = new FormData();
            formData.append('webinarId', id);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}sendWebinarInvites.json`, {
                method: "POST",
                body: formData
            });
            const res = await response.json();

            if (res.status === 'success') {
                toast.update(toastId, { render: res.message || "Invites sent successfully!", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: res.message || "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (err) {
            console.error(err);
            toast.update(toastId, { render: "A critical error occurred while sending invites.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSendingMail(false);
        }
    };
    const getDesignationOptions = (type) => {
        if (type === "NAAC") {
            return [
                { value: "", label: "Select Designation" },
                { value: "Principal", label: "Principal" },
                { value: "Vice Principal", label: "Vice Principal" },
                { value: "Director", label: "Director" },
                { value: "Chairman", label: "Chairman" },
                { value: "HOD", label: "HOD" },
                { value: "Teacher", label: "Teacher" },
                { value: "IQAC HEAD", label: "IQAC HEAD" },
                { value: "IQAC Team Member", label: "IQAC Team Member" },
                { value: "Other", label: "Other" },
            ];
        }
        // SQAAF or others
        return [
            { value: "", label: "Select Designation" },
            { value: "Principal", label: "Principal" },
            { value: "Vice Principal", label: "Vice Principal" },
            { value: "Director", label: "Director" },
            { value: "Chairman", label: "Chairman" },
            { value: "HOD", label: "HOD" },
            { value: "CBSE Coordinator", label: "CBSE Coordinator" },
            { value: "Teacher", label: "Teacher" },
            {value: "Counsellor", label: "Counsellor"},
            {value: "Special Educator", label: "Special Educator"},
            { value: "Other", label: "Other" },
        ];
    };
    // --- Refactored data fetching into a useCallback ---
    const getUserRegistrations = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', id);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}getwebinarRegistrationByWebinarId.json`, {
                method: "POST",
                body: formData
            });
            const res = await response.json();

            if (res.status === 'success') {
                setUserRegistrations(res.data || []);
                if (res.data && res.data.length === 0) {
                    toast.info('No registrations found for this session.');
                }
            } else {
                toast.error(res.message || 'Failed to fetch registrations');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred while fetching registrations.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getUserRegistrations();
    }, [getUserRegistrations]);


    useEffect(() => {
        if (id) {
            const getSessionDetails = async () => {
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getSession.json`);
                    const session = res.data.data.find(s => s.id == id);
                    if (session) {
                        setSessionTitle(session.title);
                        setSessionType(session.type);
                        setSessionStatus(session.status);
                        setYoutubeLink(session.youtube_link ? true : false);
                    }
                } catch (err) {
                    console.error("Failed to fetch session details:", err);
                }
            };
            getSessionDetails();
        }
    }, [id]);
    useEffect(() => {
        // This will run on every render, but the logic inside isAuthenticated will handle the redirect.
        isAuthenticated('/admin/login', router, false);
    }, [router]); // Dependency should be router, not the function itself unless it's memoized.

    // --- Filter users based on search ---
    const filteredRegistrations = userRegistrations.filter(user => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const name = (user.name || '').toLowerCase();
        const email = (user.user_email || '').toLowerCase();

        if (searchBy === 'name') {
            return name.includes(query);
        } else if (searchBy === 'email') {
            return email.includes(query);
        } else {
            // search in both name and email
            return name.includes(query) || email.includes(query);
        }
    });

    // --- Reset to first page when search changes ---
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, searchBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);


    // --- Pagination Logic (use filtered data) ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRegistrations = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const sendCertificateTo = async (userId) => {
        if (!window.confirm(`Are you sure you want to send a certificate to this user?`)) {
            return;
        }

        const toastId = toast.loading("Sending certificate...");

        try {
            const formData = new FormData();
            formData.append('userId', userId);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}sendCertificate.json`, {
                method: "POST",
                body: formData
            });

            // Check if response is ok before parsing
            if (!response.ok) {
                // Try to parse error response
                let errorMessage = `Server returned status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // If JSON parsing fails, try to get text
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const res = await response.json();

            if (res.status === 'success') {
                toast.update(toastId, {
                    render: res.message || "Certificate sent successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            } else {
                toast.update(toastId, {
                    render: res.message || "An error occurred.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        } catch (err) {
            console.error("Certificate sending error:", err);
            toast.update(toastId, {
                render: err.message || "A critical error occurred while sending the certificate.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    // --- Render component for certificate sending ---
    const renderSendingView = () => {
        if (sendingStatus === 'sending') {
            const sentCount = Math.floor((progress / 100) * userRegistrations.length);
            return (
                <div className="text-center p-5 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Sending Certificates...</h2>
                    <p className="text-lg mt-4 mb-3">
                        Processing: <strong>{sentCount} of {userRegistrations.length}</strong>
                    </p>
                    <ProgressBar
                        now={progress}
                        label={`${Math.round(progress)}%`}
                        animated
                        style={{ height: '25px', fontSize: '14px' }}
                    />
                    <p className="text-muted mt-3">This may take several minutes. Please do not close or refresh this page.</p>
                </div>
            );
        }

        if (sendingStatus === 'complete' && sendingResult) {
            return (
                <div className="p-5 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">Certificate Process Complete</h2>
                    <p className="text-lg mb-4 text-center">{sendingResult.message}</p>
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-4 mb-3 mb-md-0"><div className="card text-white bg-success"><div className="card-body text-center"><h5 className="card-title">Successfully Sent</h5><p className="card-text fs-4 fw-bold">{sendingResult.details?.success_count || 0}</p></div></div></div>
                        <div className="col-md-4"><div className="card text-white bg-danger"><div className="card-body text-center"><h5 className="card-title">Failed to Send</h5><p className="card-text fs-4 fw-bold">{sendingResult.details?.failure_count || 0}</p></div></div></div>
                    </div>
                    {sendingResult.details?.failure_count > 0 && sendingResult.details.failed_emails && (
                        <div className="mt-4 text-start">
                            <h4 className="font-semibold">Failed Emails:</h4>
                            <ul className="list-group">
                                {sendingResult.details.failed_emails.map((email, index) => (
                                    <li key={index} className="list-group-item">{email}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="text-center"><button onClick={() => { setSendingStatus('idle'); setProgress(0); }} className="theme-btn btn-style-one bg-theme-color2 mt-4">Go Back</button></div>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="text-lg font-semibold">Loading...</div></div>;
    }

    const handleDownloadExcel = () => {
        if (userRegistrations.length === 0) {
            toast.info('No data available to download.');
            return;
        }
        if (!window.confirm(`Are you sure you want to download Excel for ${userRegistrations.length} users?`)) {
            return;
        }

        // Prepare data for Excel
        const excelData = userRegistrations.map((user, index) => ({
            'S.No': index + 1,
            'Name': user.name || 'N/A',
            'Email': user.user_email || 'N/A',
            'Phone': user.contact || 'N/A',
            'School/College': user.school || 'N/A',
            'Designation': user.designation || 'N/A',
            'Certificate No.': user.certificate_number || 'N/A',
            'Payment ID': user.payment_id || 'N/A',
            'Registration Date': user.created_at
                ? new Date(new Date(user.created_at).getTime() + 5.5 * 60 * 60 * 1000).toLocaleString('en-IN')
                : 'N/A'
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const columnWidths = [
            { wch: 6 },  // S.No
            { wch: 25 }, // Name
            { wch: 30 }, // Email
            { wch: 15 }, // Phone
            { wch: 30 }, // School/College
            { wch: 20 }, // Designation
            { wch: 18 }, // Certificate No.
            { wch: 20 }, // Payment ID
            { wch: 25 }  // Registration Date
        ];
        worksheet['!cols'] = columnWidths;

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

        // Generate filename with session title and date
        const fileName = `${sessionTitle.replace(/[^a-z0-9]/gi, '_')}_Registrations.xlsx`;

        // Download file
        XLSX.writeFile(workbook, fileName);
        toast.success('Excel file downloaded successfully!');
    };

    // --- Handlers for Add User Modal ---
    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        // Reset form fields on close
        setNewUser({ name: '', user_email: '', school: '', designation: '', contact: '' });
    };

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!id) {
            toast.error("Invalid Webinar ID.");
            setIsSubmitting(false);
            return;
        }
        // Basic validation
        if (!newUser.name || !newUser.user_email) {
            toast.error("Name and Email are required.");
            setIsSubmitting(false);
            return;
        }
        if (!newUser.designation) {
            toast.error("Please select a designation.");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('webinar_id', id);
        formData.append('name', newUser.name);
        formData.append('user_email', newUser.user_email);
        formData.append('school', newUser.school);
        formData.append('designation', newUser.designation);
        formData.append('contact', newUser.contact);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}putWebinarRegistration.json`, {
                method: "POST",
                body: formData
            });
            const res = await response.json();

            if (res.status === 'success') {
                toast.success(res.message || "User added successfully!");
                handleCloseAddUserModal(); // Close and reset modal
                await getUserRegistrations(); // Refresh the user list
            } else {
                toast.error(res.message || "Failed to add user.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while adding the user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handlers for Edit User Modal ---
    const handleOpenEditModal = (user) => {
        setEditingUser(user); // Set the user to be edited
        setShowEditUserModal(true); // Open the modal
    };

    const handleCloseEditModal = () => {
        setShowEditUserModal(false);
        setEditingUser(null); // Clear the editing user
    };

    const handleEditUserChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => ({ ...prev, [name]: value }));
    };

    const handleEditUserSubmit = async (e) => {
        e.preventDefault();
        if (!editingUser) {
            toast.error("No user selected for editing.");
            return;
        }

        setIsSubmitting(true);

        // Basic validation
        if (!editingUser.name || !editingUser.user_email) {
            toast.error("Name and Email are required.");
            setIsSubmitting(false);
            return;
        }
        if (!editingUser.designation) {
            toast.error("Please select a designation.");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        // --- This is the critical part ---
        // We send the user's ID to tell the backend *which* user to update
        formData.append('user_id', editingUser.id);

        // Send the rest of the data
        formData.append('name', editingUser.name);
        formData.append('user_email', editingUser.user_email);
        formData.append('school', editingUser.school);
        formData.append('designation', editingUser.designation);
        formData.append('contact', editingUser.contact);

        try {
            // --- ASSUMPTION: New endpoint for updating ---
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateWebinarRegistration.json`, {
                method: "POST",
                body: formData
            });
            const res = await response.json();

            if (res.status === 'success') {
                toast.success(res.message || "User updated successfully!");
                handleCloseEditModal(); // Close and reset modal
                await getUserRegistrations(); // Refresh the user list
            } else {
                toast.error(res.message || "Failed to update user.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating the user.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleSendCertificates = async () => {
        if (userRegistrations.length === 0) {
            toast.info('No registrations available to send certificates.');
            return;
        }

        if (!window.confirm(`Are you sure you want to send certificates to ${userRegistrations.length} users?`)) {
            return;
        }

        const toastId = toast.loading("Sending certificates... This may take several minutes.");

        try {
            const formData = new FormData();
            formData.append('webinarId', id);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}sendCertificates.json`, {
                method: "POST",
                body: formData
            });

            const res = await response.json();

            if (res.status === 'success') {
                const message = `Successfully sent ${res.details.success_count} certificates.${res.details.failure_count > 0
                    ? ` Failed: ${res.details.failure_count}`
                    : ''
                    }`;
                toast.update(toastId, {
                    render: message,
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                });

                // Show detailed results if there were failures
                if (res.details.failure_count > 0) {
                    console.log("Failed emails:", res.details.failed_emails);
                }
            } else {
                toast.update(toastId, {
                    render: res.message || "Failed to send certificates",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000
                });
            }
        } catch (err) {
            console.error(err);
            toast.update(toastId, {
                render: "An error occurred while sending certificates",
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        }
    };

    // --- Handlers for Import Excel ---
    const handleImportExcel = async (e) => {
        e.preventDefault();

        if (!excelFile) {
            toast.error("Please select an Excel file to import.");
            return;
        }

        // Validate file type
        const fileName = excelFile.name.toLowerCase();
        if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        // Validate file size (max 5MB)
        if (excelFile.size > 5 * 1024 * 1024) {
            toast.error("File size too large. Please upload a file smaller than 5MB.");
            return;
        }

        if (!id) {
            toast.error("Invalid Webinar ID.");
            return;
        }

        setIsImporting(true);
        const toastId = toast.loading("Processing Excel file...");

        try {
            // Refresh user registrations to get latest data
            toast.update(toastId, {
                render: "Refreshing user data...",
                isLoading: true
            });

            await getUserRegistrations();

            toast.update(toastId, {
                render: "Processing Excel file...",
                isLoading: true
            });

            const reader = new FileReader();

            reader.onload = async (evt) => {
                try {
                    const data = evt.target.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                    if (jsonData.length === 0) {
                        toast.update(toastId, {
                            render: "Excel file is empty.",
                            type: "error",
                            isLoading: false,
                            autoClose: 3000
                        });
                        setIsImporting(false);
                        return;
                    }

                    // Get existing emails for this webinar
                    const existingEmails = new Set(
                        userRegistrations.map(user => user.user_email?.toLowerCase().trim())
                    );

                    const usersToAdd = [];
                    const duplicates = [];
                    const errors = [];

                    jsonData.forEach((row, index) => {
                        const rowNumber = index + 2; // Excel row number (accounting for header)

                        // Get email and normalize it
                        const email = row.Email || row.email || row.user_email || row['E-mail'];
                        const normalizedEmail = email ? String(email).toLowerCase().trim() : '';

                        // Validate required field (email)
                        if (!normalizedEmail) {
                            errors.push(`Row ${rowNumber}: Email is required`);
                            return;
                        }

                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(normalizedEmail)) {
                            errors.push(`Row ${rowNumber}: Invalid email format - ${normalizedEmail}`);
                            return;
                        }

                        // Check for duplicates in current registrations
                        if (existingEmails.has(normalizedEmail)) {
                            duplicates.push(normalizedEmail);
                            return;
                        }

                        // Prepare user data with "Add Manually" for missing fields
                        const userData = {
                            name: row.Name || row.name || "Add Manually",
                            user_email: normalizedEmail,
                            school: row.School || row.school || row['School/College'] || row.College || "Add Manually",
                            designation: row.Designation || row.designation || "Add Manually",
                            contact: row.Phone || row.phone || row.Contact || row.contact || row.Mobile || "Add Manually",
                            webinar_title: row['Webinar Title'] || row['webinar_title'] || row.Title || sessionTitle || "Add Manually",
                            certificate_number: row['Certificate Number'] || row['certificate_number'] || row['Certificate No.'] || row['Cert No'] || "",
                            payment_id: row['Payment ID'] || row['payment_id'] || row['Transaction ID'] || "",
                            order_id: row['Order ID'] || row['order_id'] || "",
                            payment_status: row['Payment Status'] || row['payment_status'] || row['Status'] || "",
                            amount: row.Amount || row.amount || row.Fee || "",
                            referral_source: row['Referral Source'] || row['referral_source'] || row.Source || row.Reference || "Add Manually",
                            certificate_sent: row['Certificate Sent'] || row['certificate_sent'] || "0"
                        };

                        usersToAdd.push(userData);
                        existingEmails.add(normalizedEmail); // Prevent duplicates within the same import
                    });

                    // Show summary before importing
                    const summaryMessage = `
                        Found ${jsonData.length} rows in Excel.
                        - ${usersToAdd.length} will be added
                        - ${duplicates.length} duplicates skipped
                        - ${errors.length} errors
                    `;

                    if (usersToAdd.length === 0) {
                        toast.update(toastId, {
                            render: "No new users to add. All emails already exist or have errors.",
                            type: "warning",
                            isLoading: false,
                            autoClose: 5000
                        });
                        setIsImporting(false);
                        return;
                    }

                    // Send to backend - using batch approach
                    toast.update(toastId, {
                        render: `Adding ${usersToAdd.length} users...`,
                        type: "info",
                        isLoading: true
                    });

                    let addedCount = 0;
                    let failedCount = 0;
                    const failedUsers = [];
                    const backendDuplicates = [];

                    // Add users one by one (or in batches if backend supports)
                    for (let i = 0; i < usersToAdd.length; i++) {
                        const user = usersToAdd[i];

                        try {
                            const formData = new FormData();
                            formData.append('webinar_id', id);
                            formData.append('name', user.name);
                            formData.append('user_email', user.user_email);
                            formData.append('school', user.school);
                            formData.append('designation', user.designation);
                            formData.append('contact', user.contact);

                            // Log what we're sending
                            console.log(`Sending data for ${user.user_email}:`, {
                                webinar_id: id,
                                name: user.name,
                                user_email: user.user_email,
                                school: user.school,
                                designation: user.designation,
                                contact: user.contact
                            });

                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}putWebinarRegistration.json`, {
                                method: "POST",
                                body: formData
                            });

                            // Get response text first
                            const responseText = await response.text();

                            // Try to parse as JSON
                            let res;
                            try {
                                // Try to extract JSON from response even if there's extra content
                                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                                if (jsonMatch) {
                                    res = JSON.parse(jsonMatch[0]);
                                } else {
                                    res = JSON.parse(responseText);
                                }
                            } catch (parseErr) {
                                console.error(`JSON parse failed for ${user.user_email}.`);
                                console.error(`Response status: ${response.status}`);
                                console.error(`Response text (first 500 chars):`, responseText.substring(0, 500));

                                // If status is 200, assume it worked despite parse error
                                if (response.status === 200) {
                                    console.warn(`Assuming success for ${user.user_email} due to 200 status`);
                                    res = { status: 'success', message: 'User added (200 OK)' };
                                } else {
                                    throw new Error(`Backend error. Status: ${response.status}`);
                                }
                            }

                            if (res.status === 'success') {
                                addedCount++;
                            } else {
                                // Check if it's a duplicate error from backend
                                const errorMessage = res.message || 'Unknown error';
                                const isDuplicate = errorMessage.toLowerCase().includes('already') ||
                                    errorMessage.toLowerCase().includes('exist') ||
                                    errorMessage.toLowerCase().includes('duplicate');

                                if (isDuplicate) {
                                    backendDuplicates.push(user.user_email);
                                } else {
                                    failedCount++;
                                    failedUsers.push({ email: user.user_email, reason: errorMessage });
                                }
                                console.error(`Failed to add ${user.user_email}:`, res);
                            }
                        } catch (err) {
                            failedCount++;
                            let errorMsg = err.message || "Network error";

                            // Provide more helpful error messages
                            if (errorMsg.includes("JSON")) {
                                errorMsg = "Backend error - endpoint may not exist or server error occurred";
                            } else if (errorMsg.includes("Failed to fetch")) {
                                errorMsg = "Cannot connect to server";
                            }

                            failedUsers.push({ email: user.user_email, reason: errorMsg });
                            console.error(`Error adding ${user.user_email}:`, err);
                        }

                        // Update progress
                        if ((i + 1) % 5 === 0 || i === usersToAdd.length - 1) {
                            toast.update(toastId, {
                                render: `Processing: ${i + 1}/${usersToAdd.length} (Added: ${addedCount})`,
                                isLoading: true
                            });
                        }
                    }

                    // Combine all duplicates
                    const allDuplicates = [...duplicates, ...backendDuplicates];

                    const resultMessage = `
                        Successfully imported ${addedCount} users!
                        ${allDuplicates.length > 0 ? `\nSkipped ${allDuplicates.length} duplicates.` : ''}
                        ${failedCount > 0 ? `\nFailed to add ${failedCount} users.` : ''}
                        ${errors.length > 0 ? `\n${errors.length} rows had errors.` : ''}
                    `;

                    toast.update(toastId, {
                        render: resultMessage,
                        type: addedCount > 0 ? "success" : "error",
                        isLoading: false,
                        autoClose: 5000
                    });

                    // Store results for display
                    setImportResults({
                        added: addedCount,
                        duplicates: allDuplicates.length,
                        errors: errors.length + failedCount,
                        duplicateEmails: allDuplicates,
                        errorMessages: [...errors, ...failedUsers.map(f => `${f.email}: ${f.reason}`)]
                    });

                    // Refresh the list
                    await getUserRegistrations();

                    // Reset file input
                    setExcelFile(null);
                } catch (parseError) {
                    console.error("Parse error:", parseError);
                    toast.update(toastId, {
                        render: "Error parsing Excel file. Please check the format.",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                }
                setIsImporting(false);
            };

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                toast.update(toastId, {
                    render: "Error reading file. Please ensure it's a valid Excel file (.xlsx or .xls)",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
                setIsImporting(false);
            };

            reader.readAsArrayBuffer(excelFile);
        } catch (err) {
            console.error(err);
            toast.update(toastId, {
                render: "An error occurred while processing the file.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            setIsImporting(false);
        }
    };

    const handleCloseImportModal = () => {
        setShowImportModal(false);
        setExcelFile(null);
        setImportResults(null);
    };

    const handleDownloadTemplate = () => {
        // Create a template Excel file
        const templateData = [
            {
                Name: "John Doe",
                Email: "john.doe@example.com",
                Phone: "9876543210",
                "School/College": "ABC School",
                Designation: "Teacher",
                "Webinar Title": sessionTitle || "Webinar Title",
                "Certificate Number": "",
                "Payment ID": "",
                "Order ID": "",
                "Payment Status": "",
                Amount: "",
                "Referral Source": "Website",
                "Certificate Sent": "0"
            },
            {
                Name: "Jane Smith",
                Email: "jane.smith@example.com",
                Phone: "9876543211",
                "School/College": "XYZ College",
                Designation: "Principal",
                "Webinar Title": sessionTitle || "Webinar Title",
                "Certificate Number": "",
                "Payment ID": "",
                "Order ID": "",
                "Payment Status": "",
                Amount: "",
                "Referral Source": "Facebook",
                "Certificate Sent": "0"
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 }, // Name
            { wch: 30 }, // Email
            { wch: 15 }, // Phone
            { wch: 30 }, // School/College
            { wch: 20 }, // Designation
            { wch: 30 }, // Webinar Title
            { wch: 20 }, // Certificate Number
            { wch: 20 }, // Payment ID
            { wch: 20 }, // Order ID
            { wch: 15 }, // Payment Status
            { wch: 12 }, // Amount
            { wch: 20 }, // Referral Source
            { wch: 15 }  // Certificate Sent
        ];

        XLSX.writeFile(workbook, 'User_Import_Template.xlsx');
        toast.success('Template downloaded successfully!');
    };

    return (
        <>
<div className="flex">
                <_sidebar />
                <div className="flex min-h-screen w-full flex-col p-6 bg-gray-100">
                    <div className="p-4 md:p-8" style={{ backgroundColor: '#f8f9fa' }}>
                        {sendingStatus !== 'idle' ? renderSendingView() : (
                            <>
                                <div className="flex items-center justify-between mb-6 gap-3">
                                    <div className="flex gap-3">
                                        <Link href="/admin/webinars"
                                            className='theme-btn btn-style-one bg-theme-color'
                                            style={{ maxWidth: '8px', fontSize: '10px' }}
                                        >← Back</Link>
                                    { (sessionStatus === 'upcoming' || sessionStatus === 'live' ) &&
                                        <div className="flex gap-2">
                                            <button onClick={() => setShowAddUserModal(true)}
                                                className='theme-btn btn-style-one bg-theme-color2'
                                                style={{ maxWidth: '8px', fontSize: '10px' }}
                                            >Add User</button>

                                            <button onClick={() => setShowImportModal(true)}
                                                className='theme-btn btn-style-one bg-theme-color'
                                                style={{ maxWidth: '8px', fontSize: '10px' }}
                                            >Import Excel</button>
                                        </div>
                                    }
                                    </div>
                                    <div className="text-center flex-grow">
                                        <h1 className="text-xl md:text-xl font-bold text-gray-800">Registrations for: {sessionTitle}</h1>
                                    </div>
                                    <div>
                                        <div className="flex gap-3">
                                            {(sessionStatus === 'upcoming' || sessionStatus === 'live') && (
                                            <button
                                                className='theme-btn btn-style-one bg-theme-color2'
                                                onClick={handleSendMail}
                                                disabled={isSendingMail}
                                                style={{ maxWidth: '12px', fontSize: '10px' }}
                                            >
                                                {isSendingMail ? 'Sending...' : 'Send Invite'}
                                            </button>
                                            )}
                                            { !youtubeLink && (
                                            <button
                                                className='theme-btn btn-style-one bg-theme-color'
                                                onClick={handleSendCertificates}
                                                style={{ maxWidth: '16px', fontSize: '10px' }}
                                            >
                                                Send Certificate
                                            </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                                    <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-4'>
                                        {/* Search Bar */}
                                        <div className="w-60">
                                            <input
                                                type="text"
                                                placeholder="Search registrations..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="form-control rounded-full"
                                            />
                                        </div>

                                        {/* Total Count */}
                                        <div className="flex items-center justify-center">
                                            <p className="font-semibold text-gray-700 text-center">
                                                Total Registrations: {userRegistrations.length}
                                                {searchQuery && ` (Filtered: ${filteredRegistrations.length})`}
                                            </p>
                                        </div>

                                        {/* Download Button */}
                                        <div className="flex justify-end w-60">
                                            <button
                                                className='theme-btn btn-style-one bg-theme-color2'
                                                style={{ maxWidth: '16px', fontSize: '10px' }}
                                                onClick={handleDownloadExcel}
                                            >
                                                Download Excel
                                            </button>
                                        </div>
                                    </div>
                                    <table className="table table-striped table-hover" style={{ minWidth: '1200px' }}>
                                        <thead className="table-dark text-[16px]">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>School/College</th>
                                                <th>Designation</th>
                                                <th>Payment ID</th>
                                                <th>Registration Date</th>
                                                <th>Certificate</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-sm'>
                                            {currentRegistrations.length > 0 ? (
                                                currentRegistrations.map((user, index) => (
                                                    <tr key={user.id || index}>
                                                        <th>{indexOfFirstItem + index + 1}</th>
                                                        <td>{user.name || 'N/A'}</td>
                                                        <td>{user.user_email || 'N/A'}</td>
                                                        <td>{user.contact || 'N/A'}</td>
                                                        <td>{user.school || 'N/A'}</td>
                                                        <td>{user.designation || 'N/A'}</td>
                                                        <td>{user.payment_id || 'N/A'}</td>
                                                        <td>
                                                            {user.created_at
                                                                ? new Date(new Date(user.created_at).getTime() + 5.5 * 60 * 60 * 1000)
                                                                    .toLocaleDateString('en-IN')
                                                                : 'N/A'}
                                                        </td>
                                                        <td>{user.certificate_sent == 1 ? 'Yes' : 'No'}</td>
                                                        <td>
                                                            <div className="flex gap-2">
                                                                {/* --- Send Certificate Button --- */}
                                                                <button
                                                                    title={`Send Certificate to ${user.name}`}
                                                                    onClick={() => sendCertificateTo(user.id)}
                                                                    className="btn btn-sm text-white bg-[#17aeb9] d-flex align-items-center justify-content-center"
                                                                    style={{ width: "32px", height: "32px", borderRadius: "6px" }}
                                                                >
                                                                    <FaPaperPlane size={16} strokeWidth={2} />
                                                                </button>

                                                                {/* --- Edit User Button --- */}
                                                                { !youtubeLink && (
                                                                <button
                                                                    title="Edit User"
                                                                    onClick={() => handleOpenEditModal(user)}
                                                                    className="btn  btn-sm text-white bg-[#17aeb9] d-flex align-items-center justify-content-center"
                                                                    style={{ width: "32px", height: "32px", borderRadius: "6px" }}
                                                                >
                                                                    <FaEdit size={16} strokeWidth={2} />
                                                                </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center py-4 font-medium text-gray-500">
                                                        {searchQuery ? 'No registrations found matching your search.' : 'No registrations found.'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredRegistrations.length > 0 && (
                                    <div className="flex flex-wrap justify-between items-center mt-4 p-4 bg-white shadow-lg rounded-lg">
                                        <div className="mb-3 md:mb-0">
                                            <label htmlFor="itemsPerPage" className="form-label me-2">Rows per page:</label>
                                            <select id="itemsPerPage" className="form-select d-inline-block" style={{ width: 'auto' }} value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                                <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
                                            </select>
                                        </div>
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination justify-content-center mb-0">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}>Previous</a></li>
                                                {[...Array(totalPages).keys()].map(number => (<li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); paginate(number + 1); }}>{number + 1}</a></li>))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}>Next</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} hideProgressBar />

            {/* --- Add User Modal --- */}
            <Modal
                show={showAddUserModal}
                onHide={handleCloseAddUserModal}
                centered
                size="md"
                backdrop="static"
                className="rounded-3 shadow-lg"
            >
                <Modal.Header
                    closeButton
                    style={{
                        backgroundColor: "#17aeb9",
                        color: "#fff",
                        borderBottom: "none",
                    }}
                >
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleAddUserSubmit}>
                    <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
                        <div className="p-3 bg-white rounded-3 shadow-sm">
                            <Row>
                                <Col md={6}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formNewUserName"
                                    >
                                        <Form.Label className="fw-semibold text-dark">
                                            Name <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleNewUserChange}
                                            required
                                            className="rounded-2 shadow-sm border-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formNewUserEmail"
                                    >
                                        <Form.Label className="fw-semibold text-dark">
                                            Email <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="user_email"
                                            value={newUser.user_email}
                                            onChange={handleNewUserChange}
                                            required
                                            className="rounded-2 shadow-sm border-light"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formNewUserContact"
                                    >
                                        <Form.Label className="fw-semibold text-dark">
                                            Phone
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter phone number"
                                            name="contact"
                                            value={newUser.contact}
                                            onChange={handleNewUserChange}
                                            className="rounded-2 shadow-sm border-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formNewUserSchool"
                                    >
                                        <Form.Label className="fw-semibold text-dark">
                                            School/College
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter school or college"
                                            name="school"
                                            value={newUser.school}
                                            onChange={handleNewUserChange}
                                            className="rounded-2 shadow-sm border-light"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group
                                className="mb-2"
                                controlId="formNewUserDesignation"
                            >
                                <Form.Label className="fw-semibold text-dark">
                                    Designation <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    id="designation"
                                    name="designation"
                                    required
                                    onChange={handleNewUserChange}
                                    value={newUser.designation}
                                    className="rounded-2 shadow-sm border-light"
                                >
                                    {getDesignationOptions(sessionType).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Modal.Body>

                    <Modal.Footer
                        className="d-flex justify-content-between"
                        style={{ backgroundColor: "#f8f9fa", borderTop: "none" }}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={handleCloseAddUserModal}
                            disabled={isSubmitting}
                            className="rounded-2 px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2 px-4"
                            style={{ backgroundColor: "#17aeb9", borderColor: "#17aeb9" }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-2">Adding...</span>
                                </>
                            ) : (
                                "Add User"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- Edit User Modal (Enhanced) --- */}
            <Modal
                show={showEditUserModal}
                onHide={handleCloseEditModal}
                centered
                size="md"
                backdrop="static"
                className="rounded-3 shadow-lg"
            >
                <Modal.Header
                    closeButton
                    style={{
                        backgroundColor: "#17aeb9",
                        color: "#fff",
                        borderBottom: "none",
                    }}
                >
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>

                {editingUser && (
                    <Form onSubmit={handleEditUserSubmit}>
                        <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
                            <div className="p-3 bg-white rounded-3 shadow-sm">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formEditUserName"
                                        >
                                            <Form.Label className="fw-semibold text-dark">
                                                Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                name="name"
                                                value={editingUser.name || ""}
                                                onChange={handleEditUserChange}
                                                required
                                                className="rounded-2 shadow-sm border-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formEditUserEmail"
                                        >
                                            <Form.Label className="fw-semibold text-dark">
                                                Email <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="user_email"
                                                value={editingUser.user_email || ""}
                                                onChange={handleEditUserChange}
                                                required
                                                className="rounded-2 shadow-sm border-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formEditUserContact"
                                        >
                                            <Form.Label className="fw-semibold text-dark">
                                                Phone
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter phone number"
                                                name="contact"
                                                value={editingUser.contact || ""}
                                                onChange={handleEditUserChange}
                                                className="rounded-2 shadow-sm border-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formEditUserSchool"
                                        >
                                            <Form.Label className="fw-semibold text-dark">
                                                School/College
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter school or college"
                                                name="school"
                                                value={editingUser.school || ""}
                                                onChange={handleEditUserChange}
                                                className="rounded-2 shadow-sm border-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group
                                    className="mb-2"
                                    controlId="formEditUserDesignation"
                                >
                                    <Form.Label className="fw-semibold text-dark">
                                        Designation <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        id="designation"
                                        name="designation"
                                        required
                                        onChange={handleEditUserChange}
                                        value={editingUser.designation || ""}
                                        className="rounded-2 shadow-sm border-light"
                                    >
                                        {getDesignationOptions(sessionType).map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </Modal.Body>

                        <Modal.Footer
                            className="d-flex justify-content-between"
                            style={{ backgroundColor: "#f8f9fa", borderTop: "none" }}
                        >
                            <Button
                                variant="outline-secondary"
                                onClick={handleCloseEditModal}
                                disabled={isSubmitting}
                                className="rounded-2 px-4"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-2 px-4"
                                style={{ backgroundColor: "#17aeb9", borderColor: "#17aeb9" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Saving...</span>
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            {/* --- Import Excel Modal --- */}
            <Modal
                show={showImportModal}
                onHide={handleCloseImportModal}
                centered
                size="lg"
                backdrop="static"
                className="rounded-3 shadow-lg"
            >
                <Modal.Header
                    closeButton
                    style={{
                        backgroundColor: "#17aeb9",
                        color: "#fff",
                        borderBottom: "none",
                    }}
                >
                    <Modal.Title>Import Users from Excel</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleImportExcel}>
                    <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
                        <div className="p-3 bg-white rounded-3 shadow-sm">
                            <div className="mb-4">
                                <h6 className="fw-semibold mb-3">Instructions:</h6>
                                <ul className="text-sm text-muted">
                                    <li>Excel file can have these columns: <strong>Name, Email, Phone, School/College, Designation, Webinar Title, Certificate Number, Payment ID, Order ID, Payment Status, Amount, Referral Source, Certificate Sent</strong></li>
                                    <li><strong>Email</strong> is the only required field</li>
                                    <li>If a user with the same email already exists for this webinar, they will be skipped</li>
                                    <li>Missing <strong>required text columns</strong> (Name, School, Designation, Webinar Title, Referral Source) will be filled with "Add Manually"</li>
                                    <li>Missing <strong>optional columns</strong> (Certificate Number, Payment ID, etc.) will be left empty</li>
                                    <li>Download the template below for reference with all available columns</li>
                                </ul>
                            </div>

                            <div className="mb-4 text-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={handleDownloadTemplate}
                                >
                                    📥 Download Excel Template
                                </button>
                            </div>

                            <Form.Group className="mb-3" controlId="formExcelFile">
                                <Form.Label className="fw-semibold text-dark">
                                    Select Excel File <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={(e) => {
                                        setExcelFile(e.target.files[0]);
                                        setImportResults(null);
                                    }}
                                    required
                                    className="rounded-2 shadow-sm border-light"
                                />
                            </Form.Group>

                            {importResults && (
                                <div className="mt-4 p-3 bg-light rounded-3">
                                    <h6 className="fw-semibold mb-3">Import Results:</h6>
                                    <div className="row">
                                        <div className="col-md-4 mb-2">
                                            <div className="card text-white bg-success">
                                                <div className="card-body text-center p-2">
                                                    <small className="card-title">Added</small>
                                                    <p className="card-text fs-5 fw-bold mb-0">{importResults.added}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <div className="card text-white bg-warning">
                                                <div className="card-body text-center p-2">
                                                    <small className="card-title">Duplicates</small>
                                                    <p className="card-text fs-5 fw-bold mb-0">{importResults.duplicates}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <div className="card text-white bg-danger">
                                                <div className="card-body text-center p-2">
                                                    <small className="card-title">Errors</small>
                                                    <p className="card-text fs-5 fw-bold mb-0">{importResults.errors}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {importResults.duplicates > 0 && importResults.duplicateEmails && importResults.duplicateEmails.length > 0 && (
                                        <div className="mt-3">
                                            <small className="fw-semibold">Duplicate Emails (first 10):</small>
                                            <div className="text-xs text-muted mt-1" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                {importResults.duplicateEmails.slice(0, 10).map((email, idx) => (
                                                    <div key={idx}>• {email}</div>
                                                ))}
                                                {importResults.duplicateEmails.length > 10 && (
                                                    <div>... and {importResults.duplicateEmails.length - 10} more</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {importResults.errors > 0 && importResults.errorMessages && importResults.errorMessages.length > 0 && (
                                        <div className="mt-3">
                                            <small className="fw-semibold">Errors (first 10):</small>
                                            <div className="text-xs text-danger mt-1" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                {importResults.errorMessages.slice(0, 10).map((error, idx) => (
                                                    <div key={idx}>• {error}</div>
                                                ))}
                                                {importResults.errorMessages.length > 10 && (
                                                    <div>... and {importResults.errorMessages.length - 10} more</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>

                    <Modal.Footer
                        className="d-flex justify-content-between"
                        style={{ backgroundColor: "#f8f9fa", borderTop: "none" }}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={handleCloseImportModal}
                            disabled={isImporting}
                            className="rounded-2 px-4"
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isImporting || !excelFile}
                            className="rounded-2 px-4"
                            style={{ backgroundColor: "#17aeb9", borderColor: "#17aeb9" }}
                        >
                            {isImporting ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-2">Importing...</span>
                                </>
                            ) : (
                                "Import Users"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </>
    );
}
