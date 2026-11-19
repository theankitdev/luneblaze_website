"use client";
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { isAuthenticated } from '@/services/admin-auth';

// Modal Component
const EmailModal = ({ isOpen, onClose, onSend }) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    onSend(content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Newsletter Content</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleSend}
          >
            Send Email
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function _Banner() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const router = useRouter();

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getBlogs.json?limit=500&page=1`);
      setData(res.data.data);
    } catch (err) {
      console.log(err, "error");
      toast.error('Network failed!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteBlog = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteBlog.json`, formData, {
        headers: {
          'Content-Type': 'multipart/form',
        },
      });

      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.log(err);
      toast.error('Delete failed!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleDelete = async (info) => {
    setData(data.filter((entry) => entry !== info));
    deleteBlog(info.id);
  };

  const openModal = (id) => {
    setCurrentBlogId(id);
    setIsModalOpen(true);
  };

  const sendEmails = async (content) => {
    try {
      const formData = new FormData();
      formData.append("blog_id", currentBlogId);
      formData.append("newslatter_content", content);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}sendNewsletter`, formData);
      if (response.data.status === 'success') {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error('Emails could not be sent', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error('Something went wrong while sending emails', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    isAuthenticated('/admin/login', router, false);
  }, [isAuthenticated]);

  return (
    <>
<div style={{ display: 'flex' }}>
        <_sidebar />
        <div style={{ height: '100vh', width: '100vw' }}>
          <div className="flex flex-row h-screen sm:px-8 md:px-16 sm:py-8">
            <div className={"border-2 mx-2 w-full h-full bg-white shadow-xl rounded-md overflow-auto"}>
              <div className="border-2 flex flex-row justify-between font-bold font-cardo text-white p-2 rounded-md bg-blue-800">
                <div className="text-xl px-4 flex gap-x-2 items-center justify-center">
                  <div className="mr-2">
                    <h5>Blogs</h5>
                  </div>
                  <div>
                    <Link href="/admin/add-blogs">
                      <button className="bg-green-500 text-white py-2 px-1 rounded">Add Blogs</button>
                    </Link>
                  </div>
                </div>
              </div>
              <table style={{ width: "100%" }}>
                <tbody>
                  {data?.filter((post) => post.organisation === "Luneblaze").map((item, index) => (
                    <tr className="hover:bg-grey-lighter w-full" key={index}>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div className="w-[10rem] m-auto h-[10rem]">
                          <img className="w-[100%] h-[100%]" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} alt="frontpage" />
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div className="w-96 font-normal text-justify break-words w-max text-sm">
                          <b>Title:</b> {item?.title}
                          <hr />
                          <b>Subtitle:</b> {item?.subtitle}
                          <hr />
                          <b>Organisation :</b>{item?.organisation}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div className={"h-[10rem] flex"}>
                          <button
                            className="text-white hover:bg-red-800 shadow-md hover:scale-105 duration-200 bg-red-600 h-min mt-auto font-bold py-1 px-3 rounded text-base"
                            onClick={() => handleDelete(item, index)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className={"my-2"} style={{ width: "80px" }}>
                          <div className="text-white hover:bg-green-800 shadow-md hover:scale-105 duration-200 bg-green-600 h-min mt-auto font-bold px-2 py-1 rounded text-base">
                            <Link href={`/admin/update-blog/${item.id}`} className={"text-white"}>Update</Link>
                          </div>
                        </div>
                        <div className={"my-2 w-auto"}>
                          <button
                            className="text-white hover:bg-blue-800 shadow-md hover:scale-105 duration-200 bg-blue-600 h-min mt-auto font-bold px-2 py-1 rounded text-base"
                            onClick={() => openModal(item.id)}
                          >
                            Send Mails
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={sendEmails}
      />
      <ToastContainer />
    </>
  );
}
