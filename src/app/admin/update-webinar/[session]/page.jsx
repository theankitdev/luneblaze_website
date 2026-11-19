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

export default function UpdateSession() {
    const router = useRouter();
    const params = useParams();
    const id = params?.session;

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);

    const editor = useRef(null);

    const [speakers, setSpeakers] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_link: '',
        webinar_link: '',
        start_time: '',
        end_time: '',
        subtitle: '',
        session_date: '',
        content: '',
        speaker: '',
        fees: '',
        attendees: '',
        status: '', // ADDED: Status field in state
        type: '',
    });

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAllTeachers.json`);
                if (res.data && res.data.status === 'success') {
                    setSpeakers(res.data.data);
                } else {
                    toast.error('Could not fetch the list of speakers.');
                }
            } catch (error) {
                console.error("Error fetching speakers:", error);
                toast.error('An error occurred while fetching speakers.');
            }
        };

        fetchSpeakers();
    }, []);

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    const getData = async (sessionId) => {
        try {
            const data = new FormData();
            data.append('id', sessionId);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getSessionById.json`, data);
            if (res.data && res.data.data) {
                const {
                    title, description, youtube_link, webinar_link, start_time, end_time,
                    image, subtitle, session_date, content, speaker,
                    fees, attendees, status, type // MODIFIED: Destructure status and type
                } = res.data.data;

                setFormData({
                    title: title || '',
                    description: description || '',
                    youtube_link: youtube_link || '',
                    webinar_link: webinar_link || '',
                    start_time: start_time || '',
                    end_time: end_time || '',
                    subtitle: subtitle || '',
                    session_date: session_date || '',
                    content: content || '',
                    speaker: speaker || '',
                    fees: fees || '',
                    attendees: attendees || '',
                    status: status || 'upcoming', // MODIFIED: Set status from response, default to upcoming
                    type: type || '',
                });

                setImagePreview(image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${image}` : null);

            } else {
                throw new Error('Received unexpected data format from server.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch data!';
            toast.error(errorMessage, { position: toast.POSITION.TOP_CENTER });
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
            setImage(webpFile);
            setImagePreview(URL.createObjectURL(webpFile));

            toast.success('Image converted to WebP successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error converting image:', error);
            toast.error('Failed to convert image. Using original format.', {
                position: toast.POSITION.TOP_CENTER,
            });
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // MODIFIED: Destructure status and type
        const { title, description, youtube_link, webinar_link, start_time, end_time, subtitle, session_date, content, speaker, fees, attendees, status, type } = formData;

        // MODIFIED: Add status and type to validation
        if (!title || !description || !subtitle || !session_date || !content || !start_time || !end_time || !webinar_link || !fees || !attendees || !speaker || !status || !type) {
            toast.error('All fields except webinar image are required.', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        const data = new FormData();
        data.append("id", id);
        data.append('title', title);
        data.append('description', description);
        data.append('youtube_link', youtube_link);
        data.append('webinar_link', webinar_link);
        data.append('start_time', start_time);
        data.append('end_time', end_time);
        data.append('subtitle', subtitle);
        data.append('session_date', session_date);
        data.append('content', content);
        data.append('speaker', speaker);
        data.append('fees', fees);
        data.append('attendees', attendees);
        data.append('status', status); // ADDED: Append status to form data
        data.append('type', type);

        if (image) { data.append('image', image); }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}updateSession.json`, data);
            if (response.status === 200) {
                toast.success('Session Updated Successfully', { position: toast.POSITION.TOP_CENTER });
                router.push('/admin/webinars');
            } else {
                toast.error('Failed to update session', { position: toast.POSITION.TOP_CENTER });
            }
        } catch (error) {
            toast.error('Submission failed! ' + (error.response?.data?.message || error.message), { position: toast.POSITION.TOP_CENTER });
        }
    };

    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, content: newContent });
    };

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [router]);

    return (
        <>
            <ToastContainer />
            <div style={{ display: "flex" }}>
                <_sidebar />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '100vw' }}>
                    <div className="block p-6 rounded-lg shadow-lg h-fit bg-white" style={{ width: "60%" }}>
                        <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem", padding: "0.5rem", border: "1px solid gray", borderRadius: "10px" }}>
                            Update Webinar
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                            <div className="form-group mb-6">
                                <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">Title</label>
                                <input type="text" value={formData.title} onChange={handleInputChange} name="title" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="title" placeholder="Enter Title" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="subtitle" className="form-label inline-block mb-2 text-gray-700">Subtitle (Write like placeholder for SEO Friendly)</label>
                                <input type="text" value={formData.subtitle} onChange={handleInputChange} name="subtitle" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="subtitle" placeholder="assessment-framework-of-sqaa" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="description" className="form-label inline-block mb-2 text-gray-700">Brief about Topic (Overview)</label>
                                <textarea value={formData.description} onChange={handleInputChange} name="description" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="description" rows="3" placeholder="Webinar Brief" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="youtube_link" className="form-label inline-block mb-2 text-gray-700">Youtube Link</label>
                                <input type="text" value={formData.youtube_link} onChange={handleInputChange} name="youtube_link" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="youtube_link" placeholder="add youtube link" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="webinar_link" className="form-label inline-block mb-2 text-gray-700">Google Meet Link</label>
                                <input type="text" value={formData.webinar_link} onChange={handleInputChange} name="webinar_link" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="webinar_link" placeholder="Google Meet Link" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="fees" className="form-label inline-block mb-2 text-gray-700">Registration Fees</label>
                                <input type="text" value={formData.fees} onChange={handleInputChange} name="fees" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="fees" placeholder="Registration Fees" />
                            </div>

                            {/* ADDED: Status Dropdown */}
                            <div className="form-group mb-6">
                                <label htmlFor="status" className="form-label inline-block mb-2 text-gray-700">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    name="status"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="status"
                                    required
                                >
                                    <option value="">Select Status *</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="form-group mb-6">
                                <label htmlFor="type" className="form-label inline-block mb-2 text-gray-700">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    name="type"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="type"
                                    required
                                >
                                    <option value="">Select Type *</option>
                                    <option value="NAAC">NAAC</option>
                                    <option value="SQAAF">SQAAF</option>
                                </select>
                            </div>

                            <div className="form-group mb-6">
                                <label htmlFor="speaker" className="form-label inline-block mb-2 text-gray-700">Speaker</label>
                                <select
                                    value={formData.speaker}
                                    onChange={handleInputChange}
                                    name="speaker"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="speaker"
                                    required
                                >
                                    <option value="">Select Speaker *</option>
                                    {speakers.map((s) => (
                                        <option key={s.teacher_id} value={s.teacher_name}>
                                            {s.teacher_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-6">
                                <label htmlFor="attendees" className="form-label inline-block mb-2 text-gray-700">Attendees</label>
                                <input type="text" value={formData.attendees} onChange={handleInputChange} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="attendees" name="attendees" placeholder="Attendees" />
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="session_date" className="form-label inline-block mb-2 text-gray-700">Webinar Date</label>
                                <input type="date" value={formData.session_date} onChange={handleInputChange} name="session_date" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="session_date" placeholder="Choose Date" />
                            </div>
                            <div className="flex gap-4 mb-6">
                                <div className="form-group w-1/2">
                                    <label htmlFor="start_time" className="form-label inline-block mb-2 text-gray-700">Webinar start time</label>
                                    <input type='time' value={formData.start_time} onChange={handleInputChange} name="start_time" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="start_time" />
                                </div>
                                <div className="form-group w-1/2">
                                    <label htmlFor="end_time" className="form-label inline-block mb-2 text-gray-700">Webinar End time</label>
                                    <input type='time' value={formData.end_time} onChange={handleInputChange} name="end_time" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="end_time" />
                                </div>
                            </div>
                            <div className="form-group mb-6">
                                <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Webinar Related Image</label>
                                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="form-control" id="image" />
                                {imagePreview && (<div className="image-preview mt-2"><img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover" /></div>)}
                            </div>
                            <JoditEditor ref={editor} value={formData.content} tabIndex={1} onChange={handleEditorChange} />
                            <button type="submit" className="px-6 py-2.5 mt-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                UPDATE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
