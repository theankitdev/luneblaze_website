"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/services/admin-auth';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FaHome, FaCheckCircle, FaCertificate, FaBookOpen } from 'react-icons/fa';

export default function Dashboard() {
    const router = useRouter();
    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, []);

    return (
        <>
<div style={{ display: 'flex', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
                <_sidebar />
                <div style={{ width: '100%', padding: '2rem', overflowY: 'auto' }}>
                    <div className="container mx-auto">
                        <div className='flex justify-between items-center p-4'>
                            <h1 className="text-5xl font-extrabold text-center text-blue-900 my-6">
                                Welcome to Luneblaze Admin Dashboard
                            </h1>
                            <button
                                className='px-2 py-2 ml-8 mt-2 rounded bg-red-500 text-white hover:bg-red-600'
                                onClick={async () => {
                                    try {
                                        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}logout.json`, { method: 'POST', credentials: 'include' });
                                    } catch (e) { }
                                    sessionStorage.removeItem('user');
                                    router.push('/');
                                }}
                            >
                                Logout
                            </button>
                        </div>

                        <p className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            Luneblaze is a forward-thinking educational technology company that
                            empowers institutions, educators, and learners. Our suite of services
                            includes customizable platforms, solutions to meet SQAAF and NAAC
                            accreditation standards, and tools to align with India's NEP 2020.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            <Link href="https://www.luneblaze.com">
                                <div className="block h-48 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl flex flex-col justify-center">
                                    <FaHome className="text-4xl mb-2" />
                                    <h2 className="text-2xl font-bold mb-2">LUNEBLAZE HOME</h2>
                                    <p className="text-sm text-white">Explore our main platform and learn more about our vision.</p>
                                </div>
                            </Link>

                            <Link href="https://www.luneblaze.com/sqaaf">
                                <div className="block h-48 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl flex flex-col justify-center">
                                    <FaCheckCircle className="text-4xl mb-2" />
                                    <h2 className="text-2xl font-bold mb-2">SQAAF</h2>
                                    <p className="text-sm text-white">Learn about the School Quality Assessment and Assurance Framework (SQAAF).</p>
                                </div>
                            </Link>

                            <Link href="https://www.luneblaze.com/naac">
                                <div className="block h-48 p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl flex flex-col justify-center">
                                    <FaCertificate className="text-4xl mb-2" />
                                    <h2 className="text-2xl font-bold mb-2">NAAC</h2>
                                    <p className="text-sm text-white">Get resources and solutions to assist with NAAC accreditation.</p>
                                </div>
                            </Link>

                            <Link href="https://www.luneblaze.com/nep">
                                <div className="block h-48 p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl flex flex-col justify-center">
                                    <FaBookOpen className="text-4xl mb-2" />
                                    <h2 className="text-2xl font-bold mb-2">NEP 2020</h2>
                                    <p className="text-sm text-white">Access tools to align with India’s National Education Policy (NEP) 2020.</p>
                                </div>
                            </Link>
                        </div>

                        <section className="my-12 text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Key Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <h3 className="text-xl font-semibold mb-4">Institutional Platforms</h3>
                                    <p className="text-gray-600">
                                        We provide custom-built digital platforms for institutions to manage academic
                                        operations, student engagement, and more.
                                    </p>
                                </div>

                                <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <h3 className="text-xl font-semibold mb-4">Accreditation Support</h3>
                                    <p className="text-gray-600">
                                        Our solutions help institutions align with national accreditation standards such as
                                        NAAC and SQAAF, offering guidance, tools, and resources.
                                    </p>
                                </div>

                                <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <h3 className="text-xl font-semibold mb-4">NEP 2020 Tools</h3>
                                    <p className="text-gray-600">
                                        We offer a suite of tools designed to assist institutions in aligning their curriculum
                                        and processes with the NEP 2020 vision.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    );
}
