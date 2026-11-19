
"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import _sidebar from "@/components/admin/_sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/services/admin-auth";

export default function Logo() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [data, setData] = useState([]);
  const [host, setHost] = useState("");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [logoData, setLogoData] = useState({
    name: "",
    logoFor: "1",
  });

  const offset = 0;
  const limit = 200;

  // Reset form
  const resetForm = () => {
    setLogoData({
      name: "",
      logoFor: "1",
    });

    setLogo(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch all logos
  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}getAllLogos.json?offset=${offset}&limit=${limit}`
      );

      setData(res.data?.data || []);
      setHost(res.data?.host || "");
    } catch (err) {
      console.error("Get logos error:", err);

      toast.error("Failed to fetch logos!", {
        position: "top-center",
      });
    }
  };

  // Initial API call
  useEffect(() => {
    getData();
  }, []);

  // Authentication check
  useEffect(() => {
    isAuthenticated("/admin/login", router, false);
  }, [router]);

  // Handle image selection
  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!", {
        position: "top-center",
      });

      e.target.value = "";
      return;
    }

    setLogo(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setPreview(event.target.result);
    };

    reader.onerror = () => {
      toast.error("Unable to preview image!", {
        position: "top-center",
      });
    };

    reader.readAsDataURL(file);
  };

  // Delete logo API
  const deleteLogo = async (id) => {
    try {
      const formData = new FormData();
      formData.append("logo_id", id);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}deleteLogo.json`,
        formData
      );

      toast.success(res.data?.message || "Logo deleted successfully!", {
        position: "top-center",
      });

      await getData();

      return true;
    } catch (err) {
      console.error("Delete logo error:", err);

      toast.error(
        err.response?.data?.message || "Delete failed!",
        {
          position: "top-center",
        }
      );

      return false;
    }
  };

  // Handle delete confirmation
  const handleDelete = async (info) => {
    const confirmed = window.confirm(
      `Do you want to delete ${info.logo_name}'s organization?`
    );

    if (!confirmed) return;

    setDeletingId(info.logo_id);

    await deleteLogo(info.logo_id);

    setDeletingId(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, logoFor } = logoData;

    if (!name.trim() || !logoFor || !logo) {
      toast.error("Please fill in all fields and select a logo!", {
        position: "top-center",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("logo_name", name.trim());
      formData.append("logo_type", logoFor);
      formData.append("logo", logo);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}addLogo.json`,
        formData
      );

      toast.success(res.data?.message || "Logo added successfully!", {
        position: "top-center",
      });

      resetForm();

      await getData();
    } catch (err) {
      console.error("Add logo error:", err);

      toast.error(
        err.response?.data?.message || "Submission failed!",
        {
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <_sidebar />

        <div style={{ height: "100vh", width: "100vw" }}>
          <div className="flex flex-row h-screen sm:px-8 md:px-16 sm:py-8">

            {/* Logo List */}
            <div className="border-2 mx-2 w-2/3 h-full bg-white shadow-xl rounded-md overflow-auto">

              <div className="border-2 flex flex-row justify-between font-bold font-cardo text-white p-2 rounded-md bg-blue-800">
                <div className="text-xl px-4">
                  Logos
                </div>
              </div>

              <table style={{ width: "100%" }}>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((item) => (
                      <tr
                        className="hover:bg-gray-100 w-full"
                        key={item.logo_id}
                      >
                        {/* Logo Image */}
                        <td className="py-4 px-6 border-b border-gray-200">
                          <div className="w-[10rem] m-auto h-[10rem]">
                            <img
                              className="w-full h-full object-contain"
                              src={`${host}/${item?.logo_uri}`}
                              alt={item?.logo_name || "Organization logo"}
                            />
                          </div>
                        </td>

                        {/* Logo Details */}
                        <td className="py-4 px-6 border-b border-gray-200">
                          <div className="w-96 font-normal text-justify break-words text-sm">
                            <b>Name:</b> {item?.logo_name}
                            <hr className="my-2" />

                            <b>Logo Type:</b> {item?.logo_type}
                          </div>
                        </td>

                        {/* Delete Button */}
                        <td className="py-4 px-6 border-b border-gray-200">
                          <div className="h-[10rem] flex items-end">
                            <button
                              type="button"
                              disabled={deletingId === item.logo_id}
                              onClick={() => handleDelete(item)}
                              className="text-white hover:bg-red-800 shadow-md hover:scale-105 duration-200 bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold py-1 px-3 rounded text-base"
                            >
                              {deletingId === item.logo_id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-10 text-gray-500"
                      >
                        No logos found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Upload Logo Section */}
            <div
              aria-label="File Upload Modal"
              className="mx-2 w-1/3 border-2 h-full flex flex-col justify-between bg-white shadow-xl rounded-md"
            >
              <form
                onSubmit={handleSubmit}
                className="h-full flex flex-col justify-between"
              >
                <section className="overflow-auto p-6 w-full flex flex-col">

                  {/* Image Preview */}
                  {logo ? (
                    <div className="flex flex-col items-center justify-center">

                      <button
                        type="button"
                        className="ml-auto bg-red-600 px-3 py-1 rounded-lg text-white font-bold"
                        onClick={resetForm}
                      >
                        X
                      </button>

                      <Image
                        src={preview}
                        width={200}
                        height={200}
                        alt="Logo preview"
                        className="object-contain mt-3"
                        unoptimized
                      />

                      <p className="text-sm text-gray-500 mt-2">
                        {logo.name}
                      </p>
                    </div>
                  ) : (
                    /* File Upload */
                    <header className="border-dashed w-[300px] mx-auto border-2 border-gray-400 py-12 flex flex-col justify-center items-center">

                      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-50">

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
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </label>
                    </header>
                  )}

                  {/* Logo Name */}
                  <div className="p-2 mx-auto w-full mt-4">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Logo Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={logoData.name}
                      onChange={(e) =>
                        setLogoData({
                          ...logoData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter logo name"
                      className="bg-gray-50 border text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>

                  {/* Logo Type */}
                  <div className="p-2 mx-auto w-full">
                    <label
                      htmlFor="logoType"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Logo Type
                    </label>

                    <select
                      value={logoData.logoFor}
                      onChange={(e) =>
                        setLogoData({
                          ...logoData,
                          logoFor: e.target.value,
                        })
                      }
                      className="block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                      id="logoType"
                    >
                      <option value="1">School</option>
                      <option value="2">College</option>
                      <option value="3">Organization</option>
                    </select>
                  </div>
                </section>

                {/* Submit Button */}
                <footer className="flex justify-end px-8 pb-8 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-sm px-5 py-2 bg-blue-700 hover:bg-blue-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed focus:shadow-outline focus:outline-none"
                  >
                    {loading ? "Uploading..." : "Add"}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
}
