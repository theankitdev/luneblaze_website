"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '@/services/admin-auth';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function UpdateSession() {
    const router = useRouter();
    const params = useParams();
    const id = params?.feedback;

    const [image, setImage] = useState(null);
    const [logo, setLogo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const imageInputRef = useRef(null);
    const logoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        designation: '',
        text_feedback: '', // Updated field
        school_name: ''
    });

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    const getData = async (feed_id) => {
        try {
            const data = new FormData();
            data.append('id', feed_id);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getFeedById.json`, data);
            if (res.data) {
                const { name, role, designation, text_feedback, school_name, image, logo } = res.data.data;
                setFormData({
                    name: name || '',
                    role: role || '',
                    designation: designation || '',
                    text_feedback: text_feedback || '', // Updated field
                    school_name: school_name || '',
                });
                setImagePreview(image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${image}` : '');
                setLogoPreview(logo ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${logo}` : '');
            } else {
                throw new Error('Received unexpected data format from server.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch data!';
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, role, designation, text_feedback, school_name } = formData; // Updated field
        if (!name || !role || !designation || !text_feedback || !school_name || (!image && !imagePreview) || (!logo && !logoPreview)) {
            toast.error('All fields are required', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        const data = new FormData();
        data.append("id", id);
        data.append('name', name);
        data.append('role', role);
        data.append('designation', designation);
        data.append('text_feedback', text_feedback); // Updated field
        data.append('school_name', school_name);
        if (image) {
            data.append('image', image);
        } else if (imagePreview) {
            data.append('imageUrl', imagePreview.replace(process.env.NEXT_PUBLIC_IMAGE_URL, ''));
        }
        if (logo) {
            data.append('school_logo', logo);
        } else if (logoPreview) {
            data.append('logoUrl', logoPreview.replace(process.env.NEXT_PUBLIC_IMAGE_URL, ''));
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateFeed.json`, data);
            if (response.status === 200) {
                toast.success('Feedback Updated Successfully', { position: toast.POSITION.TOP_CENTER });
                router.push('/admin/test-feedback');
            } else {
                toast.error('Failed to update Feedback', { position: toast.POSITION.TOP_CENTER });
            }
        } catch (error) {
            toast.error('Submission failed! ' + error.response.data?.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [router]);

    return (
        <>
            <ToastContainer />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="block p-6 rounded-lg shadow-lg h-fit bg-white" style={{ width: "60%" }}>
                    <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem", padding: "0.5rem", border: "1px solid gray", borderRadius: "10px" }}>
                        Update Feedback
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-6">
                            <label htmlFor="Name" className="form-label inline-block mb-2 text-gray-700">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                name="name"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="name"
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className="form-group mb-6">
                        <label htmlFor="role" className="form-label inline-block mb-2 text-gray-700">Role</label>
                        <select
                            value={formData.role}
                            onChange={handleInputChange}
                            name="role"
                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="role"
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="SQAAF">SQAAF</option>
                            <option value="NAAC">NAAC</option>
                        </select>
                    </div>
                        <div className="form-group mb-6">
                            <label htmlFor="designation" className="form-label inline-block mb-2 text-gray-700">Designation</label>
                            <input
                                type="textarea"
                                value={formData.designation}
                                onChange={handleInputChange}
                                name="designation"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="designation"
                                placeholder="Enter designation"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label htmlFor="text_feedback" className="form-label inline-block mb-2 text-gray-700">Feedback</label> {/* Updated field */}
                            <textarea
                                value={formData.text_feedback} // Updated field
                                onChange={handleInputChange}
                                name="text_feedback" // Updated field
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="text_feedback" // Updated field
                                placeholder="Enter feedback"
                                required
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label htmlFor="school_name" className="form-label inline-block mb-2 text-gray-700">School Name</label>
                            <input
                                type="text"
                                value={formData.school_name}
                                onChange={handleInputChange}
                                name="school_name"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="school_name"
                                placeholder="add school name"
                                required
                            />
                        </div>

                        <div className="form-group mb-6">
                            <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                onChange={handleImageChange}
                                className="form-control"
                                id="image"
                            />
                            {imagePreview && (
                                <div className="image-preview mt-2">
                                    <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="form-group mb-6">
                            <label htmlFor="logo" className="form-label inline-block mb-2 text-gray-700">Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={logoInputRef}
                                onChange={handleLogoChange}
                                className="form-control"
                                id="logo"
                            />
                            {logoPreview && (
                                <div className="image-preview mt-2">
                                    <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 object-cover" />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
