"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { isAuthenticated } from '@/services/admin-auth';
import { useRouter } from 'next/navigation';
import _sidebar from '@/components/admin/_sidebar';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
});

// Convert and compress uploaded images to WebP
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
                        if (!blob) {
                            reject(
                                new Error('Canvas to Blob conversion failed')
                            );
                            return;
                        }

                        const webpFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, '.webp'),
                            { type: 'image/webp' }
                        );

                        resolve(webpFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Unable to load image'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Unable to read image'));
        };
    });
};

export default function AddNews() {
    const router = useRouter();

    const [sourceImage, setSourceImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const imageInputRef = useRef(null);
    const editor = useRef(null);
    const contentRef = useRef('');

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        source: '',
        section: '',
        details: '',
        date: '',
        tags: '',
    });

    // Jodit editor configuration
    const editorConfig = useMemo(
        () => ({
            readonly: false,
            height: 500,
            width: '100%',

            toolbar: true,
            toolbarSticky: true,
            spellcheck: true,

            // Preserve pasted HTML formatting
            processPasteHTML: true,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: 'insert_as_html',
            pastePlainText: false,

            // Avoid removing formatting unnecessarily
            cleanHTML: {
                removeEmptyElements: false,
                fillEmptyParagraph: false,
            },

            // Editor font defaults
            style: {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#000000',
            },

            // Formatting toolbar
            buttons: [
                'source',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'font',
                'fontsize',
                'brush',
                '|',
                'ul',
                'ol',
                '|',
                'paragraph',
                'align',
                '|',
                'link',
                'image',
                'table',
                '|',
                'undo',
                'redo',
                '|',
                'eraser',
                'copyformat',
                'fullsize',
            ],

            controls: {
                font: {
                    list: {
                        Arial: 'Arial',
                        'Times New Roman': 'Times New Roman',
                        Georgia: 'Georgia',
                        Verdana: 'Verdana',
                        Tahoma: 'Tahoma',
                        Calibri: 'Calibri',
                    },
                },
                fontsize: {
                    list: [
                        '8',
                        '10',
                        '12',
                        '14',
                        '16',
                        '18',
                        '20',
                        '24',
                        '28',
                        '32',
                        '36',
                        '48',
                    ],
                },
            },
        }),
        []
    );

    // Reset form
    const resetForm = () => {
        const emptyForm = {
            title: '',
            subtitle: '',
            source: '',
            section: '',
            details: '',
            date: '',
            tags: '',
        };

        setFormData(emptyForm);
        setSourceImage(null);
        contentRef.current = '';

        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }

        // Clear editor content
        if (editor.current) {
            editor.current.value = '';
        }
    };

    // Handle normal input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Keep editor HTML unchanged
    const handleEditorChange = (newDetails) => {
        contentRef.current = newDetails;

        setFormData((prev) => ({
            ...prev,
            details: newDetails,
        }));
    };

    // Check whether editor contains actual text
    const hasEditorContent = (html) => {
        if (!html) return false;

        const doc = new DOMParser().parseFromString(
            html,
            'text/html'
        );

        return Boolean(
            doc.body.textContent.trim() ||
            doc.body.querySelector('img, table')
        );
    };

    // Handle image upload
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setSourceImage(null);
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file', {
                position: toast.POSITION.TOP_CENTER,
            });

            e.target.value = '';
            return;
        }

        try {
            const webpFile = await convertToWebP(file);

            setSourceImage(webpFile);

            toast.success('Image converted to WebP format', {
                position: toast.POSITION.TOP_CENTER,
            });

            console.log('Converted image:', webpFile);
        } catch (error) {
            console.error('Image conversion error:', error);

            toast.error('Failed to convert image', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get the latest editor HTML
        const details = contentRef.current || formData.details;

        const {
            title,
            subtitle,
            source,
            date,
            section,
            tags,
        } = formData;

        // Validate fields
        if (
            !title.trim() ||
            !subtitle.trim() ||
            !source.trim() ||
            !hasEditorContent(details) ||
            !date ||
            !section ||
            !sourceImage ||
            !tags.trim()
        ) {
            toast.error('All fields are required', {
                position: toast.POSITION.TOP_CENTER,
            });

            return;
        }

        const data = new FormData();

        data.append('title', title);
        data.append('subtitle', subtitle);
        data.append('tags', tags);
        data.append('source', source);

        // Send complete HTML including inline styles
        data.append('details', details);

        data.append('date', date);
        data.append('section', section);
        data.append('sourceImage', sourceImage);

        console.log('Submitting form data:', formData);

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}addNews.json`,
                data
            );

            console.log('API Response:', response.data);

            if (
                response.status === 200 &&
                response.data?.status !== 'error'
            ) {
                toast.success('News Added Successfully', {
                    position: toast.POSITION.TOP_CENTER,
                });

                resetForm();
            } else {
                toast.error(
                    response.data?.message || 'Failed to add news',
                    {
                        position: toast.POSITION.TOP_CENTER,
                    }
                );
            }
        } catch (error) {
            console.error('Submission error:', error);

            toast.error(
                'Submission failed! ' +
                    (error.response?.data?.message ||
                        'An unexpected error occurred.'),
                {
                    position: toast.POSITION.TOP_CENTER,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    // Authentication
    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [router]);

    return (
        <>
            <ToastContainer />

            <div style={{ display: 'flex' }}>
                <_sidebar />

                <div
                    className="flex justify-center overflow-y-auto"
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        padding: '20px',
                    }}
                >
                    <div
                        className="block p-6 rounded-lg shadow-lg h-fit bg-white"
                        style={{
                            width: '100%',
                            maxWidth: '1100px',
                        }}
                    >
                        <div
                            className="text-xl font-semibold"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '0.5rem',
                                padding: '0.8rem',
                                border: '1px solid gray',
                                borderRadius: '10px',
                            }}
                        >
                            Add News
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="title"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    name="title"
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="title"
                                    placeholder="Enter news title"
                                    required
                                />
                            </div>

                            {/* SEO Subtitle */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="subtitle"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Title for SEO (Give '-' dash between
                                    the content to create the URL)
                                </label>

                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    name="subtitle"
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="subtitle"
                                    placeholder="Url-link-will-have-content-like-this"
                                    required
                                />
                            </div>

                            {/* Tags */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="tags"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    News Tags
                                </label>

                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    name="tags"
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="tags"
                                    placeholder="Add tags in (tag1name/tag2name/) manner"
                                    required
                                />
                            </div>

                            {/* Source */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="source"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Source
                                </label>

                                <input
                                    type="text"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    name="source"
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="source"
                                    placeholder="Enter source"
                                    required
                                />
                            </div>

                            {/* Date */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="date"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Date
                                </label>

                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    name="date"
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="date"
                                    required
                                />
                            </div>

                            {/* Section */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="section"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Section
                                </label>

                                <select
                                    value={formData.section}
                                    onChange={handleInputChange}
                                    className="form-control block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                                    id="section"
                                    name="section"
                                    required
                                >
                                    <option value="">
                                        Select Section
                                    </option>

                                    <option value="NAAC">NAAC</option>
                                    <option value="SQAAF">SQAAF</option>
                                </select>
                            </div>

                            {/* Source Image */}
                            <div className="form-group mb-6">
                                <label
                                    htmlFor="sourceImage"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Source Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    className="form-control block w-full"
                                    id="sourceImage"
                                    required
                                />

                                {sourceImage && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {sourceImage.name}
                                    </p>
                                )}
                            </div>

                            {/* Jodit Editor */}
                            <div className="form-group mb-6">
                                <label className="form-label inline-block mb-2 text-gray-700 font-semibold">
                                    News Details
                                </label>

                                <JoditEditor
                                    ref={editor}
                                    value={formData.details}
                                    config={editorConfig}
                                    tabIndex={1}
                                    onChange={handleEditorChange}
                                />

                                <p
                                    style={{
                                        fontFamily: 'Arial',
                                        fontSize: '16px',
                                        color: 'green',
                                        marginTop: '10px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    NOTE: Use Arial font, 16px font size,
                                    and black text color as the default.
                                    Pasted formatting will be retained where
                                    supported by the editor.
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
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
