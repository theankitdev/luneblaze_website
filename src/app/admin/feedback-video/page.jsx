"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/services/admin-auth';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';


export default function ProjectVideos() {
    const router = useRouter();
    const [allMagazines, setAllMagazines] = useState([]);
    const [magzineLoading, setMagzineLoading] = useState(true);
    const [host, setHost] = useState('');

    const handleDelete = async (id) => {
        const formData = new FormData();
        formData.append('id', id);
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteVideoFeed.json`, {
                method: "POST",
                body: formData
            });
            const res = await resp.json();
            toast.success(res.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        } catch (err) {
            toast.error(err.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }

        setAllMagazines(allMagazines.filter(entry => entry.id !== id));
    };

    useEffect(() => {
        if (magzineLoading) {
            const getAllMagzinePage = async () => {
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getVideoFeed.json`);
                    setAllMagazines(res.data.data);
                    setHost(res.data.host);
                    setMagzineLoading(false);
                } catch (err) {
                    console.log(err);
                }
            };
            getAllMagzinePage();
        }
    }, [magzineLoading]);

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, []);

    return (
        <>
<div style={{ display: 'flex' }}>
                <_sidebar />
                <div style={{ height: 'fit-content', width: '100vw' }}>
                    <div className="mx-auto">
                        <Link href="/admin/add-video-feedback">
                            <button className='px-1 py-2 ml-2 mt-2 rounded bg-green-500 text-white hover:bg-green-600'>Add Feedback</button>
                        </Link>
                        <div className="bg-white shadow-md rounded p-2 my-6">
                            <table className="text-left w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Name
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Designation
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Image
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Logo
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            School Name
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Feedback
                                        </th>
                                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-gray-900 border-b border-grey-light">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                {allMagazines?.map((_, index) => (
                                    <tbody key={index}>
                                        <tr className="hover:bg-grey-lighter" key={_.id}>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                {_.name}
                                            </td>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                {_.designation}
                                            </td>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                <div className="w-[10rem] m-auto h-[10rem]">
                                                    <img
                                                        className="w-[100%] h-[100%]"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${_.image}`}
                                                        alt="Principal picture"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                <div className="w-[10rem] m-auto h-[10rem]">
                                                    <img
                                                        className="w-[100%] h-[100%]"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${_.logo}`}
                                                        alt="School logo"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                {_.school_name}
                                            </td>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                <div className="line-clamp-3">{_.text_feedback}</div>
                                            </td>
                                            <td className="py-4 px-20 border-b border-grey-light">
                                                <Link href={`/admin/update-videoFeed/${_.id}`}>
                                                    <button className='text-grey-lighter font-bold py-1 px-3 mr-[0.5rem] rounded text-xs bg-green hover:bg-green-dark border border-indigo-900'>
                                                        Update
                                                    </button>
                                                </Link>
                                                <button
                                                    className="text-grey-lighter font-bold py-1 px-3 bg-red-500 rounded text-white text-xs hover:bg-blue-dark border border-indigo-900"
                                                    onClick={() => handleDelete(_.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    );
}
