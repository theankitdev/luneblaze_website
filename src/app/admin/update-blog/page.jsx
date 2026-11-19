"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { isAuthenticated } from '@/services/admin-auth';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


export default function UpdateBlog() {
    const router = useRouter();
    const id = 2;

    const editor = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: '',
    });

    useEffect(() => {
        getData(id);
    }, [id]);

    const getData = async (id) => {
        try {
            const data = new FormData();
            data.append('id', id);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getBlogById.json`, data);

            if (res.data) {
                setFormData({
                    title: res.data.data.title || '',
                    subtitle: res.data.data.subtitle || '',
                    content: res.data.data.content || ''
                });
            } else {
                throw new Error('Received unexpected data format from server.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch data!';
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, content: newContent });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, subtitle, content } = formData;
        if (!title || !subtitle || !content) {
            toast.error('All fields are required', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        const data = new FormData();
        data.append("id", id);
        data.append('title', title);
        data.append('subtitle', subtitle);
        data.append('content', content);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateBlog.json`, data);
            if (response.status === 200) {
                toast.success('Blog Updated Successfully', { position: toast.POSITION.TOP_CENTER });
                router.push('/admin/blogs');
            } else {
                toast.error('Failed to update blog', { position: toast.POSITION.TOP_CENTER });
            }
        } catch (error) {
            toast.error('Submission failed! ' + error.response.data?.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [isAuthenticated]);

    return (
        <>
            <ToastContainer />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="block p-6 rounded-lg shadow-lg h-fit bg-white" style={{ width: "60%" }}>
                    <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem", padding: "0.5rem", border: "1px solid gray", borderRadius: "10px" }}>
                        Update Blogs
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-6">
                            <label htmlFor="blogTitle" className="form-label inline-block mb-2 text-gray-700">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange}
                                name="title"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="title"
                                placeholder="Enter title"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label htmlFor="blogSubtitle" className="form-label inline-block mb-2 text-gray-700">Subtitle</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                name="subtitle"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="subtitle"
                                placeholder="Enter subtitle"
                            />
                        </div>
                        <JoditEditor
                            ref={editor}
                            value={formData.content}
                            tabIndex={1}
                            onChange={handleEditorChange}
                        />
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
