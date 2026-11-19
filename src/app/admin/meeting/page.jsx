"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _sidebar from '@/components/admin/_sidebar';

import { isAuthenticated } from '@/services/admin-auth';
import { useRouter } from 'next/navigation';
const Meeting = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // State for the modal and meeting settings
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalInactive, setIsModalInactive] = useState(false);
    const [meetingTime, setMeetingTime] = useState({
        start_time: '',
        end_time: '',
        duration: '',
    });
    const [inactiveDate, setInactiveDate] = useState({
        start_time: '',
        end_time: '',
        date: '',
    });

    // --- Core Functions ---

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getMeetingDetails.json`);
            if (response.data.status === 'success') {
                setInquiries(response.data.data);
            } else {
                setInquiries([]);
            }
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setInquiries([]);
                setError(null);
            } else {
                setError('Failed to load inquiries. Please try again later.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // This will run on every render, but the logic inside isAuthenticated will handle the redirect.
        isAuthenticated('/admin/login', router, false);
    }, [router]); // Dependency should be router, not the function itself unless it's memoized.

    useEffect(() => {
        fetchInquiries();
    }, []);

    // --- Action Handlers ---

    const handleMarkAsDone = async (id) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}markAsDone.json`, { id });
            if (response.data.status === 'success') {
                fetchInquiries();
            }
        } catch (err) {
            alert('Failed to mark as done.');
            console.error(err);
        }
    };

    const handleUnMarkAsDone = async (id) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}unMarkAsDone.json`, { id });
            if (response.data.status === 'success') {
                fetchInquiries();
            }
        } catch (err) {
            alert('Failed to unmark as done.');
            console.error(err);
        }
    };

    // --- Modal and Meeting Time Functions (Corrected) ---

    // This function now ONLY opens the modal.
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleInactiveModal = () => {
        setIsModalInactive(true);
    };

    // This new useEffect hook fetches data when the modal becomes visible.
    useEffect(() => {
        if (isModalOpen) {
            const fetchMeetingTimings = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getMeetingTiming.json`);
                    if (response.data.status === 'success' && response.data.data) {
                        setMeetingTime(response.data.data);
                    } else {
                        alert(`Error: ${response.data.message || 'Could not fetch settings.'}`);
                    }
                } catch (err) {
                    alert('Failed to fetch meeting settings.');
                    console.error(err);
                }
            };
            fetchMeetingTimings();
        }
    }, [isModalOpen]);

    // This new useEffect hook fetches data when the modal becomes visible.
    useEffect(() => {
        if (isModalInactive) {
            const fetchInactiveDate = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getInactiveDate.json`);
                    if (response.data.status === 'success' && response.data.data) {
                        setInactiveDate(response.data.data);
                    } else {
                        // Set to default empty state if no data is returned
                        setInactiveDate({ start_time: '', end_time: '', date: '' });
                    }
                } catch (err) {
                    // Consistent error alert
                    alert(err.response?.data?.message || 'Failed to fetch inactive date settings.');
                    console.error(err);
                }
            };
            fetchInactiveDate();
        }
    }, [isModalInactive]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset state when closing to avoid showing old data briefly on reopen.
        setMeetingTime({ start_time: '', end_time: '', duration: '' });
    };

    const handleActiveModal = () => {
        setIsModalInactive(false);
        // Reset state when closing to avoid showing old data briefly on reopen.
        setInactiveDate({ start_time: '', end_time: '', date: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingTime(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleInactiveInputChange = (e) => {
        const { name, value } = e.target;
        setInactiveDate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}putMeetingTiming.json`, meetingTime);
            if (response.data.status === 'success') {
                alert('Meeting timings updated successfully!');
                handleCloseModal(); // Use the close function to reset state.
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update meeting timings.';
            alert(errorMessage);
            console.error(err);
        }
    };
    const handleInactiveSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}putInactiveDate.json`, inactiveDate);
            if (response.data.status === 'success') {
                alert('Inactive date updated successfully!');
                handleActiveModal(); // Use the close function to reset state.
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update meeting timings.';
            alert(errorMessage);
            console.error(err);
        }
    };

    // --- Render Logic ---

    if (loading) {
        return <div className="text-center p-8">Loading inquiries...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }
    return (
        <>
<div style={{ display: 'flex' }}>
                <_sidebar />
                <div style={{ width: '100vw', height: 'fit-content' }}>
                    <div className="p-4 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={handleInactiveModal}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition duration-300"
                            >
                                Inactive Date
                            </button>
                            <h1 className="text-3xl font-bold">Meetings Details</h1>
                            <button
                                onClick={handleOpenModal}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition duration-300"
                            >
                                Meeting Settings
                            </button>
                        </div>

                        {/* Inquiries Table */}
                        <div className="overflow-x-auto shadow-lg rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Institution</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Designation</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date & Time</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {inquiries.length > 0 ? (
                                        inquiries.map((inquiry) => (
                                            <tr key={inquiry.id} className={inquiry.mark ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}>
                                                <td className="text-left py-3 px-4 font-medium">{inquiry.fullname}</td>
                                                <td className="text-left py-3 px-4">{inquiry.email}</td>
                                                <td className="text-left py-3 px-4">{inquiry.contact_no}</td>
                                                <td className="text-left py-3 px-4">{inquiry.institution_name}</td>
                                                <td className="text-left py-3 px-4">{inquiry.designation}</td>
                                                <td className="text-left py-3 px-4 text-sm">
                                                    {new Date(inquiry.demo_date).toLocaleDateString()} at{" "}
                                                    {new Date(`1970-01-01T${inquiry.start_time}`).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </td>
                                                <td className="text-left py-3 px-4">
                                                    {inquiry.status ? (
                                                        <span className="bg-green-600 text-white py-1 px-3 rounded-full text-xs">Completed</span>
                                                    ) : (
                                                        <span className="bg-red-600 text-white py-1 px-3 rounded-full text-xs">Upcoming</span>
                                                    )}
                                                </td>
                                                <td className="text-left py-3 px-4">
                                                    {!inquiry.mark ? (
                                                        <button onClick={() => handleMarkAsDone(inquiry.id)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700">
                                                            Mark
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleUnMarkAsDone(inquiry.id)} className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-700">
                                                            Unmark
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-6">
                                                No Meeting found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Editing Meeting Timings */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Edit Meeting Timings</h2>
                        <form onSubmit={handleSaveChanges}>
                            <div className="mb-4">
                                <label htmlFor="start_time" className="block text-gray-700 font-semibold mb-2">Start Time {meetingTime.start_time}</label>
                                <input
                                    type="time"
                                    id="start_time"
                                    name="start_time"
                                    value={meetingTime.start_time || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_time" className="block text-gray-700 font-semibold mb-2">End Time</label>
                                <input
                                    type="time"
                                    id="end_time"
                                    name="end_time"
                                    value={meetingTime.end_time || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="duration" className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={meetingTime.duration || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    placeholder="e.g., 30"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isModalInactive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Set Inactive Period</h2>
                        <form onSubmit={handleInactiveSave}>
                            <div className="mb-4">
                                <label htmlFor="start_time_inactive" className="block text-gray-700 font-semibold mb-2">Start Time</label>
                                <input
                                    type="time"
                                    id="start_time_inactive"
                                    name="start_time"
                                    value={inactiveDate.start_time || ''} // CORRECTED
                                    onChange={handleInactiveInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_time_inactive" className="block text-gray-700 font-semibold mb-2">End Time</label>
                                <input
                                    type="time"
                                    id="end_time_inactive"
                                    name="end_time"
                                    value={inactiveDate.end_time || ''} // CORRECTED
                                    onChange={handleInactiveInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="date_inactive" className="block text-gray-700 font-semibold mb-2">Date</label>
                                <input
                                    type="date"
                                    id="date_inactive"
                                    name="date"
                                    value={inactiveDate.date || ''} // CORRECTED
                                    onChange={handleInactiveInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>

                            {/* --- End of new section --- */}

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleActiveModal}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Meeting;
