"use client";
import React, { useState, useRef, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';



import axios from 'axios';

import { isAuthenticated } from '@/services/admin-auth';

import { useRouter } from 'next/navigation';

import _sidebar from '@/components/admin/_sidebar';



const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });



// Utility function to convert and compress images to WebP

const convertToWebP = (file, quality = 0.8) => {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event) => {

            const img = new Image();

            img.src = event.target.result;

            img.onload = () => {

                const canvas = document.createElement('canvas');

                canvas.width = img.width;

                canvas.height = img.height;

                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(

                    (blob) => {

                        if (blob) {

                            const webpFile = new File(

                                [blob],

                                file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),

                                { type: 'image/webp' }

                            );

                            resolve(webpFile);

                        } else {

                            reject(new Error('Canvas to Blob conversion failed'));

                        }

                    },

                    'image/webp',

                    quality

                );

            };

            img.onerror = reject;

        };

        reader.onerror = reject;

    });

};



export default function AddBlog() {

    const router = useRouter();

    const [blogImage, setBlogImage] = useState(null);

    const [coverImage, setCoverImage] = useState(null);  // State for cover image

    const [loading, setLoading] = useState(false);

    const imageInputRef = useRef(null);

    const coverImageInputRef = useRef(null);  // Ref for the cover image input

    const editor = useRef(null);
    const contentRef = useRef('');

    // Preserve supported inline formatting when pasting HTML into Jodit.
    const editorConfig = {
        readonly: false,
        height: 500,
        toolbar: true,
        spellcheck: true,
        processPasteHTML: true,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_as_html',
        defaultFont: 'Arial',
        defaultFontSize: '16px',
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', '|',
            'ul', 'ol', '|',
            'paragraph', 'align', '|',
            'link', 'image', 'table', '|',
            'undo', 'redo', '|',
            'eraser', 'copyformat', 'fullsize'
        ],
        style: {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000'
        },
        cleanHTML: {
            removeEmptyElements: false
        }
    };

    const [formData, setFormData] = useState({

        title: '',

        subtitle: '',

        content: '',

        organisation: 'Luneblaze',

        tags: '',

        date: '',

        section: ''

    });



    const resetForm = () => {
        contentRef.current = '';

        setFormData({

            title: '',

            subtitle: '',

            content: '',

            organisation: 'Luneblaze',

            tags: '',

            date: '',

            section: ''

        });

        setBlogImage(null);

        setCoverImage(null);  // Reset cover image

        if (imageInputRef.current) {

            imageInputRef.current.value = '';

        }

        if (coverImageInputRef.current) {

            coverImageInputRef.current.value = '';  // Reset the cover image input

        }

    };



    const handleInputChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });

    };



    const handleEditorChange = (newContent) => {
        contentRef.current = newContent;
        setFormData((prev) => ({ ...prev, content: newContent }));
    };



    const handleImageChange = async (e) => {

        const file = e.target.files[0];

        if (file) {

            try {

                const webpFile = await convertToWebP(file);

                setBlogImage(webpFile);

                toast.success('Image converted to WebP format', {

                    position: toast.POSITION.TOP_CENTER,

                });

            } catch (error) {

                console.error('Error converting image:', error);

                toast.error('Failed to convert image', {

                    position: toast.POSITION.TOP_CENTER,

                });

            }

        }

    };



    const handleCoverImageChange = (e) => {

        setCoverImage(e.target.files[0]);  // Handle cover image change

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        const { title, subtitle, organisation, tags, date, section } = formData;
        const content = contentRef.current || formData.content;

        console.log(date, "date")

        if (!title || !subtitle || !organisation || !content || !blogImage || !coverImage || !tags || !date || !section) {

            toast.error('All fields are required', { position: toast.POSITION.TOP_CENTER });

            return;

        }



        const data = new FormData();

        data.append('title', title);

        data.append('subtitle', subtitle);

        data.append('content', content);

        data.append('organisation', organisation)

        data.append('blogImage', blogImage);

        data.append('coverImage', coverImage);  // Append cover image to FormData

        data.append('tags', tags);

        data.append('date', date);

        data.append('section', section);



        if (blogImage.size > 1000000 || coverImage.size > 1000000) {

            toast.error('Maxed Sized for Image is 1mb');

            return;

        }

        setLoading(true);

        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}addBlog.json`, data);



            if (response.status === 200) {

                toast.success('Blog Added Successfully', { position: toast.POSITION.TOP_CENTER });

                resetForm();

            } else {

                toast.error('Failed to add blog', { position: toast.POSITION.TOP_CENTER });

            }

        } catch (error) {

            toast.error('Submission failed! ' + (error.response?.data?.message || error.message), {

                position: toast.POSITION.TOP_CENTER,

            });

        } finally {

            setLoading(false);

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

                            Add Blogs

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

                                    required

                                />

                            </div>

                            <div className="form-group mb-6">

                                <label htmlFor="blogSubtitle" className="form-label inline-block mb-2 text-gray-700">Title for SEO ( Give '-' Dash  between the content to show similar at website:write like placeholder)</label>

                                <input

                                    type="text"

                                    value={formData.subtitle}

                                    onChange={handleInputChange}

                                    name="subtitle"

                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

                                    id="subtitle"

                                    placeholder="understanding-the-weightage-of-domains-in-sqaa-framework"

                                    required

                                />

                            </div>



                            {/* Tags Field added */}

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

                            {/* Date field */}



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

                                    required

                                />

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

                                    required

                                />

                            </div>

                            <JoditEditor

                                ref={editor}

                                value={formData.content}

                                config={editorConfig}
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

                                {loading ? 'Submitting...' : 'SUBMIT'}

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

}
