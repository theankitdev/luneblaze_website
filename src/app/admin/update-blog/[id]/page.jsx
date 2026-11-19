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

export default function UpdateBlog() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [blogImage, setBlogImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [blogImagePreview, setBlogImagePreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const imageInputRef = useRef(null);
    const coverImageInputRef = useRef(null);

    const editor = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: '',
        organisation: 'Luneblaze',
        tags: '',
        date: '',
        section: ''
    });

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    const getData = async (blogId) => {
        try {
            const data = new FormData();
            data.append('id', blogId);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getBlogById.json`, data);
            if (res.data) {
                const { title, subtitle, content, organisation, section, tags, image, cover_image, created_at } = res.data.data;
                setFormData({
                    title: title || '',
                    subtitle: subtitle || '',
                    content: content || '',
                    organisation: organisation || '',
                    tags: tags || '',
                    date: created_at || '',
                    section: section || ''
                });
                setBlogImage(image || '');
                setCoverImage(cover_image || '');
                setBlogImagePreview(image);
                setCoverImagePreview(cover_image);
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

    const handleImageReplica = (file) => {
        setBlogImage(file);
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            toast.info('Converting image to WebP...', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });

            const webpFile = await convertToWebP(file);
            setBlogImage(webpFile);
            setBlogImagePreview(URL.createObjectURL(webpFile));

            toast.success('Image converted to WebP successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error converting image:', error);
            toast.error('Failed to convert image. Using original format.', {
                position: toast.POSITION.TOP_CENTER,
            });
            setBlogImage(file);
            setBlogImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            toast.info('Converting cover image to WebP...', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });

            const webpFile = await convertToWebP(file);
            setCoverImage(webpFile);
            setCoverImagePreview(URL.createObjectURL(webpFile));

            toast.success('Cover image converted to WebP successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error converting cover image:', error);
            toast.error('Failed to convert cover image. Using original format.', {
                position: toast.POSITION.TOP_CENTER,
            });
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, content: newContent });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, subtitle, content, organisation, tags, date, section } = formData;
        if (!title || !subtitle || !section || !content || !organisation || !tags || !date || (!blogImage && !blogImagePreview) || (!coverImage && !coverImagePreview)) {
            toast.error('All fields are required', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        const data = new FormData();
        data.append("id", id);
        data.append('title', title);
        data.append('subtitle', subtitle);
        data.append('content', content);
        data.append('organisation', organisation);
        data.append('tags', tags);
        data.append('date', date);
        data.append('section', section);
        if (blogImage) {
            data.append('blogImage', blogImage);
        } else {
            data.append('blogImageUrl', blogImagePreview.replace(process.env.NEXT_PUBLIC_IMAGE_URL, ''));
        }
        if (coverImage) {
            data.append('coverImage', coverImage);
        } else {
            data.append('coverImageUrl', coverImagePreview.replace(process.env.NEXT_PUBLIC_IMAGE_URL, ''));
        }

        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateBlog.json`, data);

            if (response.status === 200) {
                toast.success('Blog Updated Successfully', { position: toast.POSITION.TOP_CENTER });
                router.push('/admin/blogs');
            } else {
                toast.error('Failed to update blog', { position: toast.POSITION.TOP_CENTER });
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
                            Update Blogs
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-6">
                                <label htmlFor="blogTitle" className="form-label inline-block mb-2 text-gray-700">Title</label>
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
                                <label htmlFor="blogSubtitle" className="form-label inline-block mb-2 text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    name="subtitle"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="subtitle"
                                    placeholder="Enter subtitle"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="blogTags" className="form-label inline-block mb-2 text-gray-700">Blog Tags</label>
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
                                <label htmlFor="blogdate" className="form-label inline-block mb-2 text-gray-700">Date</label>
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
                                <label htmlFor="organisation" className="form-label inline-block mb-2 text-gray-700">
                                    Organisation
                                </label>
                                <select
                                    value={formData.organisation}
                                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="organisation"
                                    name="organisation"
                                    required
                                >
                                    <option value="">Select Organisation</option>
                                    <option value="Luneblaze">Luneblaze</option>
                                </select>
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="section" className="form-label inline-block mb-2 text-gray-700">
                                    Section
                                </label>
                                <select
                                    value={formData.section}
                                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="secion"
                                    name="section"
                                    required
                                >
                                    <option value="">Select Section</option>
                                    <option value="NAAC">NAAC</option>
                                    <option value="SQAAF">SQAAF</option>
                                </select>
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="blogImage" className="form-label inline-block mb-2 text-gray-700">Inner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    className="form-control"
                                    id="blogImage"
                                />
                                {blogImagePreview && (
                                    <div className="image-preview mt-2">
                                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${blogImagePreview}`} alt="Blog Preview" className="w-32 h-32 object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="coverImage" className="form-label inline-block mb-2 text-gray-700">Outer Image ( Thumbnail )</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={coverImageInputRef}
                                    onChange={handleCoverImageChange}
                                    className="form-control"
                                    id="coverImage"
                                />
                                {coverImagePreview
                                    && (

                                        <div className="image-preview mt-2">
                                            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${coverImagePreview}`} alt="Cover Preview" className="w-32 h-32 object-cover" />
                                        </div>
                                    )}
                            </div>
                            <JoditEditor
                                ref={editor}
                                value={formData.content}
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
