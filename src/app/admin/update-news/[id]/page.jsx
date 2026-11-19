"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '@/services/admin-auth';
import _sidebar from '@/components/admin/_sidebar';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function UpdateNews() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [source_img, setSourceImg] = useState(null);
    const [sourceImgPreview, setSourceImgPreview] = useState(null);
    const imageInputRef = useRef(null);

    const editor = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        source: '',
        details: '',
        date: '',
        section: ''
    });

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    const stripHtmlTags = (html) => {
        // Remove HTML tags and return plain text
        return html.replace(/<[^>]*>/g, '');
    };

    const getData = async (newsId) => {
        try {
            const data = new FormData();
            data.append('id', newsId);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getNewsById.json`, data);
            if (res.data) {
                const { title, subtitle, source, details, section, source_img, date, tags } = res.data.data;
                const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';

                // Keep HTML content in details
                setFormData({
                    title: title || '',
                    subtitle: subtitle || '',
                    source: source || '',
                    details: details || '', // Keep HTML content
                    date: formattedDate,
                    section: section || '',
                    tags: tags || ''
                });
                setSourceImg(source_img || '');
                setSourceImgPreview(source_img ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${source_img}` : null);
            } else {
                throw new Error('Received unexpected data format from server.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch data!';
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const convertToWebP = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                                type: 'image/webp',
                                lastModified: Date.now()
                            });
                            resolve(webpFile);
                        } else {
                            reject(new Error('Conversion to WebP failed'));
                        }
                    }, 'image/webp', 0.9);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            toast.info('Converting image to WebP...', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });

            const webpFile = await convertToWebP(file);
            setSourceImg(webpFile);
            setSourceImgPreview(URL.createObjectURL(webpFile));

            toast.success('Image converted to WebP successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error converting image:', error);
            toast.error('Failed to convert image. Using original format.', {
                position: toast.POSITION.TOP_CENTER,
            });
            setSourceImg(file);
            setSourceImgPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, details: newContent }); // Keep HTML content as-is
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, subtitle, source, details, date, section, tags } = formData;

        if (!title || !subtitle || !source || !section || !details || !date || (!source_img && !sourceImgPreview) || !tags) {
            toast.error('All fields are required', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        const data = new FormData();
        data.append("news_id", id);
        data.append('title', title);
        data.append('subtitle', subtitle);
        data.append('source', source);
        data.append('details', details); // Keep HTML content
        data.append('date', date);
        data.append('section', section);
        data.append('tags', tags); // Add tags to FormData
        if (source_img) {
            data.append('source_img', source_img);
        } else {
            data.append('sourceImageUrl', sourceImgPreview.replace(process.env.NEXT_PUBLIC_IMAGE_URL, ''));
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateNews.json`, data);
            if (response.status === 200) {
                toast.success('News Updated Successfully', { position: toast.POSITION.TOP_CENTER });
                router.push('/admin/news');
            } else {
                toast.error('Failed to update news', { position: toast.POSITION.TOP_CENTER });
            }
        } catch (error) {
            toast.error('Submission failed! ' + error.response.data?.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [isAuthenticated]);

    return (
        <>
            <ToastContainer />
            <div style={{ display: "flex" }}>
                <_sidebar />
                <div className='flex justify-center' style={{ height: '100vh', width: '100vw' }}>
                    <div className="block p-6 rounded-lg shadow-lg h-fit bg-white" style={{ width: "60%" }}>
                        <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem", padding: "0.5rem", border: "1px solid gray", borderRadius: "10px" }}>
                            Update News
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-6">
                                <label htmlFor="newsTitle" className="form-label inline-block mb-2 text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    name="title"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="title"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="NewsSubtitle" className="form-label inline-block mb-2 text-gray-700">Title for SEO ( Give '-' Dash  between the content to show similar at website:write like placeholder)</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    name="subtitle"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="subtitle"
                                    placeholder="Url-link-will-have-content-like-this"
                                    required
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="NewsTags" className="form-label inline-block mb-2 text-gray-700">News Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    name="tags"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="tags"
                                    placeholder="add tags in (tag1name/tag2name/) manner"
                                    required
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="newsSource" className="form-label inline-block mb-2 text-gray-700">Source</label>
                                <input
                                    type="text"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    name="source"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="source"
                                    placeholder="Enter source"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="newsDate" className="form-label inline-block mb-2 text-gray-700">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    name="date"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="date"
                                    placeholder="Enter Date"
                                    required
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="section" className="form-label inline-block mb-2 text-gray-700">
                                    Section
                                </label>
                                <select
                                    value={formData.section}
                                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="section"
                                    name="section"
                                    required
                                >
                                    <option value="">Select Section</option>
                                    <option value="NAAC">NAAC</option>
                                    <option value="SQAAF">SQAAF</option>
                                </select>
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="sourceImage" className="form-label inline-block mb-2 text-gray-700">Source Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    className="form-control"
                                    id="sourceImage"
                                />
                                {sourceImgPreview && (
                                    <div className="image-preview mt-2">
                                        <img src={sourceImgPreview} alt="Source Image Preview" className="w-32 h-32 object-cover" />
                                    </div>
                                )}
                            </div>
                            <JoditEditor
                                ref={editor}
                                value={formData.details}
                                tabIndex={1}
                                onChange={handleEditorChange}
                            />
                            <p style={{ fontFamily: 'Arial', fontSize: '18px', color: 'green', marginTop: '8px', fontWeight: 'bold' }}>
                                N O T E -: Use font-style as Arial, keep the font-size as 16px, and the color of the text as: Black
                            </p>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

