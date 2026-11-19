"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, setToken } from '@/services/admin-auth';
export default function TopBlogsPage() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [sqaafBlogs, setSqaafBlogs] = useState([]);
  const [naacBlogs, setNaacBlogs] = useState([]);
  const [selectedBlogs, setSelectedBlogs] = useState({ home: [], sqaaf: [], naac: [] });
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true); // New state for loading
  const router = useRouter();
  const fetchBlogs = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getBlogs.json?limit=500&page=1`);
      const blogs = response.data.data;

      const filteredBlogs = blogs.filter((blog) => blog.organisation === 'Luneblaze');
      setAllBlogs(filteredBlogs);

      const sqaafFiltered = filteredBlogs.filter((blog) => blog.section === 'SQAAF');
      const naacFiltered = filteredBlogs.filter((blog) => blog.section === 'NAAC');
      setSqaafBlogs(sqaafFiltered);
      setNaacBlogs(naacFiltered);

      const initialSelectedBlogs = {
        home: filteredBlogs.filter((blog) => blog.page?.split(',').map((p) => p.trim()).includes('1')).map((blog) => blog.id),
        sqaaf: sqaafFiltered.filter((blog) => blog.page?.split(',').map((p) => p.trim()).includes('2')).map((blog) => blog.id),
        naac: naacFiltered.filter((blog) => blog.page?.split(',').map((p) => p.trim()).includes('3')).map((blog) => blog.id),
      };

      setSelectedBlogs(initialSelectedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const setFeaturedBlogs = async (section) => {

    const selectedBlogCount = selectedBlogs[section].length;

    if (selectedBlogCount !== 3) {
      toast.error(`Please select exactly 3 blogs for ${section.toUpperCase()}.`);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}setFeaturedBlogs`, {
        section,
        blog_ids: selectedBlogs[section],
      });
      if (response.data.status === 'success') {
        toast.success(`${section.toUpperCase()} featured blogs updated!`);
      } else {
        toast.error(`Failed to update featured blogs for ${section}.`);
      }
    } catch (error) {
      console.error("Error setting featured blogs:", error);
      toast.error(`Failed to update featured blogs for ${section}.`);
    }
  };

  const handleBlogSelection = (section, blogId) => {

    setSelectedBlogs((prev) => {
      const sectionBlogs = prev[section] || [];
      let updatedBlogs;

      if (sectionBlogs.includes(blogId)) {
        updatedBlogs = sectionBlogs.filter((id) => id !== blogId);
      } else if (sectionBlogs.length < 3) {
        updatedBlogs = [...sectionBlogs, blogId];
      } else {
        toast.error(`Only 3 blogs can be selected for ${section.toUpperCase()}.`);
        return prev;
      }

      return { ...prev, [section]: updatedBlogs };
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    isAuthenticated('/admin/login', router, false);
  }, [isAuthenticated]);

  return (
    <>
<div style={{ display: 'flex' }}>
        <_sidebar />
        <div style={{ height: '100vh', width: '100vw' }}>
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full border-t-4 border-blue-600 border-solid h-12 w-12 mb-4 mx-auto"
                ></div>
                <p className="text-lg font-semibold text-gray-600">Loading blogs, please wait...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row h-screen sm:px-8 md:px-16 sm:py-8">
              <div className="p-4 bg-gray-50 min-h-screen w-full bg-white shadow-xl rounded-md overflow-auto">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded">
                  Blogs Selection
                </h1>

                <div className="flex space-x-4 mb-6 border-b-2 border-gray-200 justify-center">
                  {['home', 'sqaaf', 'naac'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 font-semibold transition-all duration-200 rounded ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {activeTab === 'home' && (
                  <Section
                    title="Home"
                    blogs={allBlogs}
                    selectedBlogs={selectedBlogs.home}
                    onSelectBlog={(id) => handleBlogSelection('home', id)}
                    onSave={() => setFeaturedBlogs('home')}
                  />
                )}
                {activeTab === 'sqaaf' && (
                  <Section
                    title="SQAAF"
                    blogs={sqaafBlogs}
                    selectedBlogs={selectedBlogs.sqaaf}
                    onSelectBlog={(id) => handleBlogSelection('sqaaf', id)}
                    onSave={() => setFeaturedBlogs('sqaaf')}
                  />
                )}
                {activeTab === 'naac' && (
                  <Section
                    title="NAAC"
                    blogs={naacBlogs}
                    selectedBlogs={selectedBlogs.naac}
                    onSelectBlog={(id) => handleBlogSelection('naac', id)}
                    onSave={() => setFeaturedBlogs('naac')}
                  />
                )}
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

const Section = ({ title, blogs, selectedBlogs, onSelectBlog, onSave }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-4 text-center bg-blue-100 p-2 rounded text-blue-600">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className={`border p-4 rounded-lg shadow transition-all duration-200 ${selectedBlogs.includes(blog.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } hover:shadow-lg`}
        >
          <h3 className="font-bold text-lg text-blue-800">{blog.title}</h3>
          <p className="text-sm text-gray-700">{blog.subtitle}</p>
          <button
            className={`mt-4 w-full px-4 py-2 rounded ${selectedBlogs.includes(blog.id)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            onClick={() => onSelectBlog(blog.id)}
          >
            {selectedBlogs.includes(blog.id) ? 'Remove' : 'Select'}
          </button>
        </div>
      ))}
    </div>
    <button
      className="mt-6 bg-blue-600 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-700"
      onClick={onSave}
    >
      Save {title} Featured Blogs
    </button>
  </div>
);

