import React, { createElement, useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenuAlt3 } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { SiGooglemeet } from 'react-icons/si';
import {
    MdOutlineReviews,
    MdVideoLibrary,
} from 'react-icons/md';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BsHouse, BsImage } from 'react-icons/bs';
import { FaNewspaper, FaPaperPlane, FaUser } from 'react-icons/fa';
import { FaBroadcastTower } from 'react-icons/fa';
import { FaRegFileAlt } from 'react-icons/fa'; // Import the new icon
import { FaUserShield } from 'react-icons/fa';
const _sidebar = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            setUserType(storedUser ? JSON.parse(storedUser).type : null);
        }
    }, []);
    let menus = [];
    if (userType === 'Admin') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Advisors', link: '/admin/teachers', icon: LiaChalkboardTeacherSolid },
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
    }
    else if (userType === 'Webinar Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Webinars', link: '/admin/webinars', icon: MdOutlineReviews },
            { name: 'Webinar Feedback', link: '/admin/feedback-video', icon: MdVideoLibrary },
            { name: 'Certificates', link: '/admin/certificate-generate', icon: FaPaperPlane },
            { name: 'Blogs', link: '/admin/blogs', icon: FaNewspaper },
            { name: 'News', link: '/admin/news', icon: FaBroadcastTower },            
            { name: 'Advisors', link: '/admin/teachers', icon: LiaChalkboardTeacherSolid },
        ];
    }
    else if (userType === 'Sales Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Enquiries', link: '/admin/inquire', icon: MdOutlineReviews },
            { name: 'Demo Meetings', link: '/admin/meeting', icon: SiGooglemeet },
        ];
    }
    else if(userType === 'Content Moderator') {
        menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
            { name: 'Logos', link: '/admin/logos', icon: BsImage },
            { name: 'Blogs', link: '/admin/blogs', icon: FaNewspaper },
            { name: 'Blogs selection', link: '/admin/blogselection', icon: FaRegFileAlt },
            { name: 'News', link: '/admin/news', icon: FaBroadcastTower },
            { name: 'Testimonial', link: '/admin/test-feedback', icon: MdVideoLibrary },
        ];
    }
    else{
            menus = [
            { name: 'Admin Dashboard', link: '/admin', icon: AiOutlineDashboard },
        ];
    }


    const [open, setOpen] = useState(false); // Start closed
    const router = useRouter();

    useEffect(() => {
        // Collapse the sidebar when the route changes
        setOpen(false);
    }, [router.pathname]);

    return (
        <div
            className={`bg-gray-900 h-auto transition-all duration-300 ${open ? 'w-56' : 'w-16'}`}
            onMouseEnter={() => setOpen(true)} // Open on hover
            onMouseLeave={() => setOpen(false)} // Close on mouse leave
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4">
                    <span className={`text-white font-bold transition-all duration-300 ${open ? 'block' : 'hidden'}`}>Luneblaze</span>
                    <HiMenuAlt3
                        className="text-white cursor-pointer"
                        onClick={() => setOpen(!open)} // Toggle on click
                    />
                </div>
                <ul className="mt-6 space-y-2">
                    {menus.map((menu, index) => (
                        <li className="min-w-max transition-transform duration-300" key={index}>
                            <Link
                                href={menu.link}
                                className={`flex items-center space-x-4 rounded-full px-4 py-3 text-gray-300 transition duration-200 
                                    ${open ? '' : 'justify-center'}
                                    hover:bg-[#17aeb6] hover:text-white`} // Adjusted hover styles
                                onClick={() => setOpen(false)} // Collapse on click
                            >
                                {createElement(menu.icon, { className: 'h-6 w-6' })}
                                <span className={`transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
                                    {menu.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default _sidebar;
