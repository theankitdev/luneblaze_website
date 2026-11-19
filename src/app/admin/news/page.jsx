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

export default function _News() {
  const [data, setData] = useState([]);
  const router = useRouter();

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getNews.json`);
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

  const deleteNews = async (id) => {
    try {
      const formData = new FormData();
      formData.append('news_id', id); // Use 'news_id' instead of 'id'

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}deleteNews.json`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      console.error(err);
      toast.error('Delete failed!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const handleDelete = async (info) => {
    setData(data.filter((entry) => entry !== info));
    deleteNews(info.news_id);
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
                    <h5>News</h5>
                  </div>
                  <div>
                    <Link href="/admin/add-news">
                      <button className="bg-green-500 text-white py-2 px-1 rounded">Add News</button>
                    </Link>
                  </div>
                </div>
              </div>
              <table style={{ width: "100%" }}>
                <tbody>
                  {data?.map((item, index) => (
                    <tr className="hover:bg-grey-lighter w-full" key={index}>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div className="w-[10rem] m-auto h-[10rem]">
                          <img className="w-[100%] h-[100%]" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.source_img}`} alt="frontpage" />
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div className="w-96 font-normal text-justify break-words w-max text-sm">
                          <b>Title:</b> {item?.title}
                          <hr />
                          <b>Source:</b> {item?.source}
                          <hr />
                          <b>Date:</b> {item?.date}
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
                            <Link href={`/admin/update-news/${item.news_id}`} className={"text-white"}>Update</Link>
                          </div>
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
      <ToastContainer />
    </>
  );
}

