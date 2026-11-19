"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from '@/services/admin-auth';
import _sidebar from '@/components/admin/_sidebar';

import { useRouter } from 'next/navigation';
export default function AuthUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  // Function to fetch all authorized users
  const fetchUsers = async () => {
    try {
      setLoading(true);
const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAuthUser.json`);
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setUsers([]);
        setError(null);
      } else {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle deleting a user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const formData = new FormData();
    formData.append('id', id);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteAuthUser.json`, formData);
      if (response.data.status === 'success') {
        toast.success(response.data.message);
        // Optimistically update UI by filtering out the deleted user
        setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('An error occurred while deleting the user.');
      console.error(err);
    }
  };

  useEffect(() => {
    isAuthenticated('/admin/login', router, false);
  }, [isAuthenticated]);
  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8">Loading users...</div>;
    }

    if (error) {
      return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Authorized Users</h1>
          <Link
            href="/admin/add-auth-user"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            Add User
          </Link>
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">OTP</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Type</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Last Login</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100 border-b border-gray-200">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.otp}</td>
                    <td className="py-3 px-4">{user.type}</td>
                    <td className="py-3 px-4 text-sm">{new Date(user.updated_at).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No authorized users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
<ToastContainer position="top-center" autoClose={3000} />
      <div className="flex">
        <_sidebar />
        <main className="w-full bg-gray-50 min-h-screen">
          {renderContent()}
        </main>
      </div>
    </>
  );
}
