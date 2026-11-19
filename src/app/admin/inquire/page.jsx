"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _sidebar from '@/components/admin/_sidebar';
import { isAuthenticated } from '@/services/admin-auth';
import { useRouter } from 'next/navigation';
const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  // Function to fetch data from the backend
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getContactForm.json`);
      if (response.data.status === 'success') {
        setInquiries(response.data.data);
      } else {
        setInquiries([]);
      }
      setError(null);
    } catch (err) {
      // MODIFIED: Handle 404 "Not Found" case specifically
      if (err.response && err.response.status === 404) {
        // This is expected when no data exists. Treat it as an empty list.
        setInquiries([]);
        setError(null);
      } else {
        // For all other errors (500, network issues), show the error message.
        setError('Failed to load inquiries. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated('/admin/login', router, false);
  }, [isAuthenticated]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Function to handle marking an item as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}markAsRead.json`, { id });
      if (response.data.status === 'success') {
        fetchInquiries();
      }
    } catch (err) {
      alert('Failed to mark as read.');
    }
  };
  const handleUnMarkAsRead = async (id) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}unMarkAsRead.json`, { id });
      if (response.data.status === 'success') {
        fetchInquiries();
      }
    } catch (err) {
      alert('Failed to unmark as read.');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading inquiries...</div>;
  }

  // This error message will now only show for critical server/network errors
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <>
<div style={{ display: 'flex' }}>
        <_sidebar />
        <div
          style={{
            height: 'fit-content',
            width: '100vw',
          }}
        >
          <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Contact Form Inquiries</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Institution</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Designation</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className={inquiry.mark ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}>
                        <td className="text-left py-3 px-4 font-medium">{inquiry.fullname}</td>
                        <td className="text-left py-3 px-4">{inquiry.email}</td>
                        <td className="text-left py-3 px-4">{inquiry.contact_no}</td>
                        <td className="text-left py-3 px-4">{inquiry.institution_name}</td>
                        <td className="text-left py-3 px-4">{inquiry.designation}</td>
                        <td className="text-left py-3 px-4 text-sm">{new Date(inquiry.created_at).toLocaleString()}</td>
                        <td className="text-left py-3 px-4">
                          {inquiry.mark ? (
                            <span className="bg-green-600 text-white py-1 px-3 rounded-full text-xs">Read</span>
                          ) : (
                            <span className="bg-red-600 text-white py-1 px-3 rounded-full text-xs">Unread</span>
                          )}
                        </td>
                        <td className="text-left py-3 px-4">
                          {!inquiry.mark ? (
                            <button
                              onClick={() => handleMarkAsRead(inquiry.id)}
                              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition duration-300"
                            >
                              Mark
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnMarkAsRead(inquiry.id)}
                              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition duration-300"
                            >
                              Unmark
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        No inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InquiriesPage;
