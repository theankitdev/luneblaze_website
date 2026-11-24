
'use client';

import React, { createElement, useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenuAlt3 } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { SiGooglemeet } from 'react-icons/si';
import {
    MdOutlineReviews,
    MdVideoLibrary,
} from 'react-icons/md';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BsImage } from 'react-icons/bs';
import {
    FaNewspaper,
    FaPaperPlane,
    FaBroadcastTower,
    FaRegFileAlt,
    FaUserShield,
    FaBriefcase,
} from 'react-icons/fa';

const _sidebar = () => {
    const [userType, setUserType] = useState(null);
    const [open, setOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('user');

            if (storedUser) {
                setUserType(JSON.parse(storedUser).type || null);
            }
        } catch (error) {
            console.error('Unable to read user session:', error);
            setUserType(null);
        }
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    let menus = [];

    if (userType === 'Admin') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Advisors', link: '/admin/teachers', icon: LiaChalkboardTeacherSolid },
            { name: 'Jobs', link: '/admin/jobs', icon: FaBriefcase },
            { name: "Job Applications", link: "/admin/job-applications", icon: FaBriefcase },
            { name: 'Logos', link: '/admin/logos', icon: BsImage },
            { name: 'Blogs', link: '/admin/blogs', icon: FaNewspaper },
            { name: 'Blogs selection', link: '/admin/blogselection', icon: FaRegFileAlt },
            { name: 'News', link: '/admin/news', icon: FaBroadcastTower },
            { name: 'Testimonial', link: '/admin/test-feedback', icon: MdVideoLibrary },
            { name: 'Webinars', link: '/admin/webinars', icon: MdOutlineReviews },
            { name: 'Webinar Feedback', link: '/admin/feedback-video', icon: MdVideoLibrary },
            { name: 'Certificates', link: '/admin/certificate-generate', icon: FaPaperPlane },
            { name: 'Authorized-User', link: '/admin/auth-user', icon: FaUserShield },
            { name: 'Enquiries', link: '/admin/inquire', icon: MdOutlineReviews },
            { name: 'Demo Meetings', link: '/admin/meeting', icon: SiGooglemeet },
        ];
    } else if (userType === 'Webinar Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Webinars', link: '/admin/webinars', icon: MdOutlineReviews },
            { name: 'Webinar Feedback', link: '/admin/feedback-video', icon: MdVideoLibrary },
            { name: 'Certificates', link: '/admin/certificate-generate', icon: FaPaperPlane },
            { name: 'Blogs', link: '/admin/blogs', icon: FaNewspaper },
            { name: 'News', link: '/admin/news', icon: FaBroadcastTower },
            { name: 'Advisors', link: '/admin/teachers', icon: LiaChalkboardTeacherSolid },
        ];
    } else if (userType === 'Sales Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Enquiries', link: '/admin/inquire', icon: MdOutlineReviews },
            { name: 'Demo Meetings', link: '/admin/meeting', icon: SiGooglemeet },
        ];
    } else if (userType === 'Content Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Logos', link: '/admin/logos', icon: BsImage },
            { name: 'Blogs', link: '/admin/blogs', icon: FaNewspaper },
            { name: 'Blogs selection', link: '/admin/blogselection', icon: FaRegFileAlt },
            { name: 'News', link: '/admin/news', icon: FaBroadcastTower },
            { name: 'Testimonial', link: '/admin/test-feedback', icon: MdVideoLibrary },
        ];
    } else {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
        ];
    }

    return (
        <div
            className={`bg-gray-900 h-auto overflow-hidden flex-shrink-0 transition-all duration-300 ${
                open ? 'w-56' : 'w-16'
            }`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className="flex flex-col h-full min-w-0">
                <div className="flex items-center justify-between p-4">
                    <span
                        className={`text-white font-bold transition-all duration-300 ${
                            open ? 'block' : 'hidden'
                        }`}
                    >
                        Luneblaze
                    </span>

                    <HiMenuAlt3
                        className="text-white cursor-pointer flex-shrink-0"
                        onClick={() => setOpen(!open)}
                    />
                </div>

                <ul className="mt-6 space-y-2 w-full min-w-0">
                    {menus.map((menu) => {
                        const isActive = pathname === menu.link;

                        return (
                            <li
                                className="w-full min-w-0 transition-transform duration-300"
                                key={menu.link}
                            >
                                <Link
                                    href={menu.link}
                                    className={`flex items-center space-x-4 w-full min-w-0 overflow-hidden rounded-full px-4 py-3 transition duration-200
                                        ${open ? '' : 'justify-center'}
                                        ${
                                            isActive
                                                ? 'bg-[#17aeb6] text-white'
                                                : 'text-gray-300 hover:bg-[#17aeb6] hover:text-white'
                                        }`}
                                    onClick={() => setOpen(false)}
                                >
                                    {createElement(menu.icon, {
                                        className: 'h-6 w-6 flex-shrink-0',
                                    })}

                                    <span
                                        className={`transition-opacity duration-300 whitespace-nowrap ${
                                            open
                                                ? 'opacity-100'
                                                : 'hidden'
                                        }`}
                                    >
                                        {menu.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default _sidebar;
