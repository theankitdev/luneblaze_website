"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/services/admin-auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
// Icons
import { FaEdit, FaTrash, FaUsers, FaEnvelope } from 'react-icons/fa';

import _sidebar from '@/components/admin/_sidebar';

export default function ProjectVideos() {
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [allMagazines, setAllMagazines] = useState([]);
  const [magzineLoading, setMagzineLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);

  // -- AUTH CHECK --
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      setUserType(storedUser ? JSON.parse(storedUser).type : null);
    }
  }, []);

  // -- HANDLERS --
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;

    const formData = new FormData();
    formData.append('id', id);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteSession.json`, {
        method: "POST",
        body: formData
      });
      const res = await resp.json();
      toast.success(res.message, { position: toast.POSITION.TOP_CENTER });

      // Update UI state locally
      setAllMagazines(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      toast.error(err.message || "Error deleting", { position: toast.POSITION.TOP_CENTER });
    }
  };

  const handleInvite = async (id) => {
    const formData = new FormData();
    formData.append('id', id);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}sentInviteToAll.json`, {
        method: "POST",
        body: formData
      });
      const res = await resp.json();
      toast.success(res.message, { position: toast.POSITION.TOP_CENTER });
    } catch (err) {
      toast.error(err.message || "Error sending invite", { position: toast.POSITION.TOP_CENTER });
    }
  };

  // Show two confirmation popups, then call handleInvite if confirmed twice
  const confirmAndInvite = (id) => {
    if (typeof window !== 'undefined') {
      const first = window.confirm('it will send invite to all user regarding this webinar');
      if (!first) return;
      const second = window.confirm('Please confirm again to send invites to all users regarding this webinar.');
      if (!second) return;
      handleInvite(id);
    }
  };

  // -- FETCH DATA --
  useEffect(() => {
    if (magzineLoading) {
      const getAllMagzinePage = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getSession.json`);
          setAllMagazines(res.data.data);
          setMagzineLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      getAllMagzinePage();
    }
  }, [magzineLoading]);

const handleDownloadExcel = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}returnAllWebinarRegistrations.json`);
    const registrations = res.data.data;   // use local variable
    setUserRegistrations(registrations);

    if (!registrations || registrations.length === 0) {
      toast.info('No data available to download.');
      return;
    }

    if (!window.confirm(`Are you sure you want to download Excel for ${registrations.length} users?`)) {
      return;
    }

    const excelData = registrations.map((user, index) => ({
      'S.No': index + 1,
      'Name': user.name || 'N/A',
      'Email': user.user_email || 'N/A',
      'Phone': user.contact || 'N/A',
      'School/College': user.school || 'N/A',
      'Designation': user.designation || 'N/A',
      'Type': user.type || 'N/A',
      'Certificate No.': user.certificate_number || 'N/A',
      'Payment ID': user.payment_id || 'N/A',
      'Amount': user.amount ? `₹${user.amount}` : 'N/A',
      'Referral Source': user.reference_source || 'N/A',
      'Registration Date': user.created_at
        ? new Date(new Date(user.created_at).getTime() + 5.5 * 60 * 60 * 1000).toLocaleString('en-IN')
        : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 25 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    XLSX.writeFile(workbook, `webinars_Registrations.xlsx`);

    toast.success('Excel file downloaded successfully!');
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    isAuthenticated('/admin/login', router, false);
  }, []);

  return (
    <>
<div style={{ display: 'flex' }}>
        <_sidebar />
        <div className="w-full bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">         
            <div className="flex justify-between items-center mb-6 ">
              <h1 className="text-2xl font-bold text-gray-700">Webinar Management</h1>
                <div className="flex gap-4">
                  <Link href="/admin/add-webinar">
                    <button className='px-4 py-2 rounded shadow bg-green-600 text-white font-semibold hover:bg-green-700 transition'>
                      + Add Webinar
                    </button>
                  </Link>
                  { userType==="Admin" &&                     
                    <button className='px-4 py-2 rounded shadow bg-green-600 text-white font-semibold hover:bg-green-700 transition'
                        onClick={handleDownloadExcel}
                    >
                        Download Excel
                    </button>
                  }
                </div>                    
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">Title</th>
                      <th className="py-3 px-6 text-left">Description</th>
                      <th className="py-3 px-6 text-center">Image</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {allMagazines?.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">

                        {/* Title */}
                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                          {item.title}
                        </td>

                        {/* Description */}
                        <td className="py-3 px-6 text-left max-w-xs truncate">
                          <span title={item.description}>{item.description}</span>
                        </td>

                        {/* Image */}
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center">
                            <img
                              className="w-16 h-16 object-cover rounded border border-gray-200 shadow-sm"
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                              alt={item.title}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center gap-3">
                            {(userType === "Admin" || userType === "Webinar Moderator" ) && 
                              <Link href={`/admin/webinar-users/${item.id}`}>
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-200 hover:scale-110 transition transform" title="View Users">
                                  <FaUsers size={16} />
                                </div>
                              </Link>
                            }
                            {/* Logic Check: Admin OR (Webinar Moderator UserType & No Youtube Link) */}
                            {(userType === "Admin" || (userType === "Webinar Moderator" && !item.youtube_link)) && (
                              <>
                        
                                {item.status === 'upcoming' && (
                                  <button
                                    onClick={() => confirmAndInvite(item.id)}
                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center cursor-pointer hover:bg-green-200 hover:scale-110 transition transform"
                                    title="Send Invite"
                                  >
                                    <FaEnvelope size={14} />
                                  </button>
                                )}

                                {/* Update Button */}
                                <Link href={`/admin/update-webinar/${item.id}`}>
                                  <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center cursor-pointer hover:bg-yellow-200 hover:scale-110 transition transform" title="Edit Webinar">
                                    <FaEdit size={16} />
                                  </div>
                                </Link>

                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center cursor-pointer hover:bg-red-200 hover:scale-110 transition transform"
                                  title="Delete Webinar"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State Handle */}
              {allMagazines?.length === 0 && !magzineLoading && (
                <div className="text-center py-10 text-gray-400">No webinars found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
