"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { isAuthenticated } from '@/services/admin-auth';
import { useRouter } from 'next/navigation';

import { toast } from "react-toastify";

export default function Subscription() {
    const [status, setStatus] = useState('Ongoing');
    const router = useRouter();
    const [search, setSearch] = useState('')

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const getData = async () => {
        try {

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAllApplications.json`);
            // console.log(res.data.data);
            setData(res.data.data);
        } catch (err) {
            console.log(err);
            // errors
            toast.error('Network failed!', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    }
    useEffect(() => {
        getData();
    }, [])


    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [isAuthenticated]);

    // const handleStatus = (e) => {
    //     e.preventDefault();
    //     setStatus('Delivered');
    // };

    useEffect(() => {
        const filtered = data.filter(item => item.name.includes(search))
        setFilteredData(filtered);

    }, [data, search])



    return (
        <>
<div className={"flex"}>
                <_sidebar />
                <div
                    style={{
                        height: 'fit-content'
                    }}
                >
                    <div className="py-3 pl-2">
                        <div className="relative max-w-xs">
                            <div>
                                <label htmlFor="hs-table-search" className="sr-only">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    name="hs-table-search"
                                    id="hs-table-search"
                                    className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value) }}

                                />
                            </div>
                        </div>
                    </div>


                    <div className="m-2 overflow-x-auto w-[calc(100vw-4.5rem)] border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="flex items-center px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        ID
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                            />
                                        </svg>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        <span className="inline-flex items-center">
                                            Name
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                                                />
                                            </svg>
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        <span className="inline-flex items-center">
                                            Email
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                                />
                                            </svg>
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Domain
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        order id
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        contact
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        experience
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        enstitution name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        class/year
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        course/section
                                    </th>


                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData?.map((subs, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                            {subs.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {subs.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {subs.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right ">
                                            {subs.desired_domain}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right ">
                                            {subs.order_id ? subs.order_id : "NA"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right ">
                                            {subs.amount ? subs.amount : "NA"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            {subs.ph_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            {subs.experience_in_chosen_domain}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            {subs.school_name ? subs.school_name : subs.college_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            {subs.class ? subs.class : subs.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            {subs.section ? subs.section : subs.course}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}
