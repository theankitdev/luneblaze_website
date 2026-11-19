"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '@/hooks/useFetch';
import { isAuthenticated } from '@/services/admin-auth';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function addAuthUser() {
    const router = useRouter();
    const fileInputRef = useRef(null); // Add a ref for the file input
    const imagefileinputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [mzData, setMZData] = useState({
        name: '',
        email: '',
        type: '',
        phoneNumber: '',
    });

    const resetForm = () => {
        setMZData({
            name: '',
            email: '',
            type: '',
            phoneNumber: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { name, email, type, phoneNumber } = mzData;
            if (!name || !email || !type) {
                toast.error('All fields are required', {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }

            let data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('type', type);
            data.append('phoneNumber', phoneNumber);

            setLoading(true);

            const res = await axios({
                url: `${process.env.NEXT_PUBLIC_API_BASE_URL}addAuthUser.json`,
                method: 'POST',
                data: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200 && res.data.status === 'success') {
                setLoading(false);
                toast.success('Authorized User Added', {
                    position: toast.POSITION.TOP_CENTER,
                });
                resetForm();
            } else {
                setLoading(false);
                toast.error(res.data.message || 'Submission failed!', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || err.message || 'Submission failed!';
            toast.error(msg, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [router]);

    return (
        <>
<div style={{ display: 'flex' }}>
                <_sidebar />
                <div style={{ height: '100vh', width: '100vw' }}>
                    <div style={{ height: '100vh' }} className="flex">
                        <div style={{ height: '70vh', width: '70vw' }} className="flex mx-auto my-auto flex-col">
                            <h3>Add Authorized User</h3>
                            <div className="block p-6 rounded-lg shadow-lg h-fit bg-white">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex gap-4 mb-6">
                                        <div className="form-group w-1/2">
                                            <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={mzData.name}
                                                onChange={(e) => setMZData({ ...mzData, name: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="name"
                                                placeholder="User Name *"
                                                required
                                            />
                                        </div>
                                        <div className="form-group w-1/2">
                                            <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={mzData.email}
                                                onChange={(e) => setMZData({ ...mzData, email: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="email"
                                                placeholder="User Email *"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-6">
                                        <div className="form-group w-1/2">
                                            <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={mzData.phoneNumber}
                                                onChange={(e) => setMZData({ ...mzData, phoneNumber: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="phoneNumber"
                                                placeholder="User Phone Number"
                                                required
                                            />
                                        </div>
                                        <div className="form-group w-1/2">
                                            <label htmlFor="type" className="form-label inline-block mb-2 text-gray-700">
                                                Type
                                            </label>
                                            <select
                                                value={mzData.type}
                                                onChange={(e) => setMZData({ ...mzData, type: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="type"
                                                required
                                            >
                                                <option value="">Select User Type *</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Content Moderator">Content Moderator</option>
                                                <option value="Webinar Moderator">Webinar Moderator</option>
                                                <option value="Sales Moderator">Sales Moderator</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex justify-center'>
                                        <button
                                            type="submit"
                                            className="theme-btn btn-style-one bg-theme-color2"
                                        >
                                            SUBMIT
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
