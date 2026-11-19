"use client";
import axios from 'axios';
import { get } from 'jquery';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '@/hooks/useFetch';
import { isAuthenticated } from '@/services/admin-auth';
// Utility function to convert and compress images to WebP
const convertToWebP = (file, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const webpFile = new File(
                                [blob],
                                file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
                                { type: 'image/webp' }
                            );
                            resolve(webpFile);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};
export default function addOrganization() {

    const [orgLogo, setOrgLogo] = useState(null);
    const [preview, setPreview] = useState('');
    const [data, setData] = useState([]);
    const [host, setHost] = useState('')


    const [orgData, setOrgData] = useState({
        name: '',
        legalName: ''
    })

    const resetForm = () => {
        setOrgData({
            name: '',
            legalName: ''
        });
    };

    const getData = async () => {
        try {

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAllOrganisations.json`);
            setData(res.data.data);
            setHost(res.data.host);
        } catch (err) {
            console.log(err);
            toast.error('Network failed!', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    }


    useEffect(() => {
        getData()
    }, [])


    const handleChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            try {
                const webpFile = await convertToWebP(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target.result);
                    setOrgLogo(webpFile);
                };
                reader.readAsDataURL(webpFile);

                toast.success('Logo converted to WebP format', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } catch (error) {
                console.error('Error converting logo:', error);
                toast.error('Failed to convert logo', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
    };
    const deleteLogo = async (id) => {
        try {
            // form Data
            const formData = new FormData();
            formData.append('organisation_id', id);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteOrganisation.json`, formData, {
                headers: {
                    'Content-Type': 'multipart/form',
                },
            });
            // success submission
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        } catch (err) {
            console.log(err);
            // errors
            toast.error('Delete failed!', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    }

    const handleDelete = async (info) => {
        if (confirm("Do you want to delete " + info.organisation_name + "'s organization?")) {
            setData(data.filter(function (entry) {
                if (entry !== info) {
                    return entry;
                }
            }));
            deleteLogo(info.organisation_id);

        }


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, legalName } = orgData

        // validation  checking
        if (!name || !legalName || !orgLogo) {
            toast.error('Please fill in all fields', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }
        try {
            // form Data
            const formData = new FormData();
            formData.append('organisation_name', name);
            formData.append('organisation_legal_name', legalName);
            formData.append('organisation_logo', orgLogo);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}addOrganisation.json`, formData, {
                headers: {
                    'Content-Type': 'multipart/form',
                },
            })

            resetForm()
            setOrgLogo(null)
            // success submission
            getData()
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
            });

        } catch (err) {
            console.log(err);
            // errors
            toast.error('Submission failed!', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const router = useRouter();

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [isAuthenticated]);

    return (
        <>
<div style={{ display: 'flex' }}>
                <_sidebar />
                <div style={{ height: '100vh', width: '100vw' }}>
                    <div className="flex flex-row h-screen sm:px-8 md:px-16 sm:py-8">
                        <div
                            className={"border-2 mx-2 w-2/3 h-full  bg-white shadow-xl rounded-md overflow-auto"}
                        >
                            <div className="border-2 flex flex-row justify-between font-bold font-cardo text-white p-2 rounded-md bg-blue-800">
                                <div className={"text-xl px-4"}>
                                    Organizations
                                </div>
                            </div>
                            <table style={{ width: "100%" }}>
                                <tbody  >
                                    {data?.map((_, index) => (

                                        <tr className="hover:bg-grey-lighter w-full" key={index}>
                                            <td className="py-4 px-6 border-b border-grey-light">
                                                <div className="w-[10rem] m-auto h-[10rem]">
                                                    <img
                                                        className="w-[100%] h-[100%]"
                                                        src={`${host}/${_.organisation_logo}`}
                                                        alt="organization logo"
                                                    />
                                                </div>


                                            </td>
                                            <td className="py-4  px-6 border-b border-grey-light">
                                                <div className=" w-96 font-normal text-justify break-words  w-max text-sm">
                                                    <b>Name:</b> {_?.organisation_name}
                                                    <hr />
                                                    <b>Legal Name:</b> {_?.organisation_legal_name}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 border-b border-grey-light">
                                                <div className={"h-[10rem] flex"}>
                                                    <button
                                                        className="text-white hover:bg-red-800 shadow-md hover:scale-105 duration-200  bg-red-600 h-min mt-auto font-bold py-1 px-3 rounded text-base "
                                                        onClick={() => handleDelete(_, index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            aria-label="File Upload Modal"
                            className=" mx-2 w-1/3 border-2 h-full flex flex-col justify-between bg-white shadow-xl rounded-md"
                        >

                            <section className=" overflow-auto p-6 w-full flex  flex-col">
                                {orgLogo ?
                                    <ul id="gallery" className="flex flex-1 flex-wrap -m-1">


                                        <li
                                            id="empty"
                                            className=" mx-auto text-center flex flex-col items-center justify-center items-center"
                                        >
                                            <button
                                                className={"ml-auto  bg-red-600 px-2 rounded-lg  text-white font-bold "}
                                                onClick={() => { setOrgLogo(null) }}
                                            >
                                                X
                                            </button>
                                            <Image src={preview} width={200} height={200} alt="img" />
                                        </li>
                                    </ul>
                                    :
                                    <header className="border-dashed w-[300px] mx-auto  border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue ">
                                            <svg
                                                className="w-8 h-8"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg>
                                            <span className="mt-2 text-base leading-normal">
                                                Select a Logo
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleChange}
                                                multiple="multiple"
                                            />
                                        </label>
                                    </header>
                                }
                                <div className={"p-2 mx-auto w-max"}>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Organization Name
                                    </label>
                                    <input
                                        id="name"
                                        type={"text"}
                                        value={orgData.name}
                                        onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                                        className="bg-gray-50  border text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                    </input>
                                </div>
                                <div className={"p-2 mx-auto w-max"}>
                                    <label
                                        htmlFor="legalName"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Organization Legal Name
                                    </label>
                                    <input
                                        id="legalName"
                                        type={"text"}
                                        value={orgData.legalName}
                                        onChange={(e) => setOrgData({ ...orgData, legalName: e.target.value })}
                                        className="bg-gray-50  border text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                    </input>
                                </div>
                            </section>

                            <footer className="flex justify-end px-8 pb-8 pt-2">
                                <button
                                    id="submit"
                                    onClick={handleSubmit}
                                    className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                                >
                                    Add
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
