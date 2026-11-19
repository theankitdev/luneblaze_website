"use client";
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from '@/services/admin-auth';

import useSWR from 'swr';
// import { BASE_URL } from '../api/constants';
import Image from "next/image";
// import SimpleProgressBar from "@/Components/Loading/SimpleProgressBar";

const fetcher = (...args) => fetch(...args).then((res) => res.json());


export default function addTeacher() {
    const router = useRouter();
    const params = useParams();
    const id = params?.teacher;
    console.log(id);
    const [swrData, setSWRData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [front_page, setFrontPage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [remaining, setRemaining] = useState(0);

    const [teacherProfile, setTeacherProfile] = useState(null);
    const [teacherProfilePreview, setTeacherProfilePreviw] = useState(null);

    const [mzData, setMZData] = useState({
        teacherName: '',
        teacherDesignation: '',
        role: '',
        // instagram: '',
        // facebook: '',
        // twitter: '',
        // linkedin: '',
        bio: '',
        about: '',
        experience: '',
        technology: 50,
        marketing: 50,
        business: 50
    });


    useEffect(() => {
        if (id) {
            getTeacherDetails(id);
        }
    }, [id]);


    const getTeacherDetails = async (teacher_id) => {
        try {
            const data = new FormData();
            data.append('id', teacher_id);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}getTeacherById.json`, data);
            if (response.data) {

                const teacherData = response.data.data;

                // Parse teacher_personal_introduction
                let teacherIntroduction = {};
                try {
                    teacherIntroduction = JSON.parse(teacherData.teacher_personal_introduction);
                } catch (error) {
                    console.error('Failed to parse teacher_personal_introduction:', error);
                }

                setMZData({
                    teacherName: teacherData.teacher_name || '',
                    teacherDesignation: teacherData.teacher_designation || '',
                    role: teacherData.role || '',
                    bio: teacherIntroduction?.bio || '',
                    about: teacherIntroduction?.about || '',
                    experience: teacherData.teacher_personal_experience || '',
                    technology: 50,
                    marketing: 50,
                    business: 50
                })
                setTeacherProfile(teacherData.teacher_profile_picture || '');
                setTeacherProfilePreviw(`${process.env.NEXT_PUBLIC_IMAGE_URL}${teacherData.teacher_profile_picture}`)
                console.log(response.data.data, "response.data.data.teacher_personal_introduction")
            }
            else {
                throw new Error("Something Went Wrong")
            }

        } catch (error) {
            console.log(error);
        }
    }



    const resetForm = () => {
        setMZData({
            teacherName: '',
            teacherDesignation: '',
            role: '',
            // instagram: '',
            // facebook: '',
            // twitter: '',
            // linkedin: '',
            bio: '',
            about: '',
            experience: '',
            technology: 50,
            marketing: 50,
            business: 50
        });
        setTeacherProfile(null)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { teacherName, teacherDesignation, role, bio, about, experience, technology, marketing, business } = mzData;


            if (
                !teacherName ||
                !teacherDesignation ||
                !role ||
                !bio ||
                !experience ||
                !technology ||
                !marketing ||
                !business
            ) {
                toast.error('All fields are required', {
                    position: toast.POSITION.TOP_CENTER,
                });
                return
            }

            if (technology < 0 || technology > 100 || marketing < 0 || marketing > 100 || business < 0 || business > 100) {
                toast.error('Each value should be between 0 and 100', {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }


            // let socialLinks = {
            //   instagram,
            //   facebook,
            //   twitter,
            //   linkedin,
            // }

            let teacherPersonalInroduction = {
                bio,
                about
            }

            let skills = {
                technology,
                marketing,
                business
            }

            let data = new FormData();
            data.append("id", id)
            data.append('teacher_name', teacherName);
            data.append('teacher_designation', teacherDesignation);
            data.append('role', role);
            // data.append('teacher_social_links', JSON.stringify(socialLinks));
            data.append('teacher_personal_introduction', JSON.stringify(teacherPersonalInroduction));
            data.append('teacher_personal_experience', experience);
            data.append('teacher_skills', JSON.stringify(skills));
            data.append('teacher_profile_picture', teacherProfile);



            setLoading(true);

            // post request for adding internships to db
            const res = await axios({
                url: `${process.env.NEXT_PUBLIC_API_BASE_URL}updateTeacher.json`,
                method: 'POST',
                data: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            );



            if (res.status === 200) {
                console.log(res, "1");
                setLoading(false);
                // success submission
                toast.success('Teacher Updated', {
                    position: toast.POSITION.TOP_CENTER,
                });
                router.push('/admin/teachers');
            } else {
                setLoading(false);
                console.log(res)
                // errors
                toast.error('failed!.:', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
            console.log(res);
        } catch (err) {
            // errors
            setLoading(false);
            console.log(err.response, "error");
            toast.error('Submission failed! ' + err.response.data?.message, {
                position: toast.POSITION.TOP_CENTER,

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

    const handleTeacherPictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            toast.info('Converting image to WebP...', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });

            const webpFile = await convertToWebP(file);
            setTeacherProfile(webpFile);
            setTeacherProfilePreviw(URL.createObjectURL(webpFile));

            toast.success('Image converted to WebP successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error converting image:', error);
            toast.error('Failed to convert image. Using original format.', {
                position: toast.POSITION.TOP_CENTER,
            });
            setTeacherProfile(file);
            setTeacherProfilePreviw(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        isAuthenticated('/admin/login', router, false);
    }, [isAuthenticated]);



    return (
        <>
<div style={{ display: 'flex', }}>
                <_sidebar />
                {loading ? <LoadingComponent progress={progress} /> : (
                    <div style={{ height: '100vh', width: '100vw' }}>
                        <div style={{ height: '100vh' }} className="flex">
                            <div
                                style={{ height: '70vh', width: '70vw' }}
                                className="flex mx-auto my-auto flex-col"
                            >
                                <h3>Update Teacher</h3>
                                {/* Edition */}
                                <div className="block p-6 rounded-lg shadow-lg h-fit bg-white ">
                                    <form>
                                        {/* Teacher Information */}
                                        <div className="form-group mb-6">
                                            <label htmlFor="teacherName" className="form-label inline-block mb-2 text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={mzData.teacherName}
                                                onChange={(e) => setMZData({ ...mzData, teacherName: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="teacherName"
                                                placeholder="Teacher's Name"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-6">
                                            <label htmlFor="teacherDesignation" className="form-label inline-block mb-2 text-gray-700">
                                                Designation
                                            </label>
                                            <input
                                                type="text"
                                                value={mzData.teacherDesignation}
                                                onChange={(e) => setMZData({ ...mzData, teacherDesignation: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="teacherDesignation"
                                                placeholder="Teacher's Designation"
                                                required
                                            />
                                        </div>

                                        {/* Authority/Technical Member Option */}
                                        <div className="form-group mb-6">
                                            <label htmlFor="role" className="form-label inline-block mb-2 text-gray-700">
                                                Role
                                            </label>
                                            <select
                                                value={mzData.role}
                                                onChange={(e) => setMZData({ ...mzData, role: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="role"
                                                required
                                            >
                                                <option value="">Select Role</option>
                                                <option value="naac">NAAC</option>
                                                <option value="sqaaf">SQAAF</option>
                                            </select>
                                        </div>

                                        {/* Social Links */}
                                        {/* <div className="form-group mb-6">
                      <label className="form-label mb-2 text-gray-700">Social Links</label>
                      <input
                        type="text"
                        value={mzData.instagram}
                        onChange={(e) => setMZData({ ...mzData, instagram: e.target.value })}
                        className="form-control block my-1 w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Instagram"
                      />
                      <input
                        type="text"
                        value={mzData.facebook}
                        onChange={(e) => setMZData({ ...mzData, facebook: e.target.value })}
                        className="form-control block  my-1 w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="facebook"
                      />
                      <input
                        type="text"
                        value={mzData.linkedin}
                        onChange={(e) => setMZData({ ...mzData, linkedin: e.target.value })}
                        className="form-control block  my-1 w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="linkedin"
                      />
                      <input
                        type="text"
                        value={mzData.twitter}
                        onChange={(e) => setMZData({ ...mzData, twitter: e.target.value })}
                        className="form-control block  my-1 w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="twitter"
                      />
                    </div> */}
                                        {/* Personal Introduction */}
                                        <div className="form-group mb-6">
                                            <label htmlFor="teacherBio" className="form-label inline-block mb-2 text-gray-700">
                                                Bio
                                            </label>
                                            <textarea
                                                value={mzData.bio}
                                                onChange={(e) => setMZData({ ...mzData, bio: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="teacherBio"
                                                placeholder="Teacher's Bio"
                                                required
                                            />
                                            <label htmlFor="teacherAbout" className="form-label inline-block mb-2 text-gray-700">
                                                About
                                            </label>
                                            <textarea
                                                value={mzData.about}
                                                onChange={(e) => setMZData({ ...mzData, about: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="teacherAbout"
                                                placeholder="Teacher's About..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-6">
                                            <label htmlFor="teacherBio" className="form-label inline-block mb-2 text-gray-700">
                                                Associate with School / College
                                            </label>
                                            <textarea
                                                value={mzData.experience}
                                                onChange={(e) => setMZData({ ...mzData, experience: e.target.value })}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="teacherBio"
                                                // placeholder=""
                                                required
                                            />
                                        </div>

                                        {/* Repeat similar input fields for About and Personal Experience */}
                                        {/* Teacher Skills */}
                                        {/* <div className="form-group mb-6">
                      <label className="form-label mb-2 text-gray-700">Rate your skills out of 100</label><br />
                      technology<input
                        type="text"
                        value={mzData.technology}
                        onChange={(e) => setMZData({ ...mzData, technology: e.target.value })}
                        className="form-control block w-full my-1 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="eg: 95"
                        min="0"
                        max={100}
                      />
                      Marketing<input
                        type="text"
                        value={mzData.marketing}
                        onChange={(e) => setMZData({ ...mzData, marketing: e.target.value })}
                        className="form-control block w-full my-1 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="eg: 80"
                        min={0}
                        max={100}
                      />
                      Business<input
                        type="text"
                        value={mzData.business}
                        onChange={(e) => setMZData({ ...mzData, business: e.target.value })}
                        className="form-control block w-full my-1 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="eg: 67"
                        min={0}
                        max={100}
                      />
                    </div> */}

                                        <div className="form-group mb-6">
                                            <label htmlFor="teacherProfile" className="form-label inline-block mb-2 text-gray-700">
                                                Teacher Picture
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleTeacherPictureChange(e)}
                                                className="form-control"
                                                id="teacherProfile"
                                            />
                                            {teacherProfilePreview && (
                                                <div className="image-preview mt-2">
                                                    <img src={teacherProfilePreview} alt="Blog Preview" className="w-32 h-32 object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                            onClick={(e) => handleSubmit(e)}
                                        >
                                            SUBMIT
                                        </button>


                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
            <ToastContainer />
        </>
    );
}

const LoadingComponent = ({ progress }) => {
    return (
        <div className="flex w-full h-screen">
            <div className="m-auto">
                <div className="w-[20vh] h-[20vh] p-[5vh]  mb-5 mx-auto border-y-4 border-red-900 rounded-full animate-spin ">
                    <div className="w-[10vh] h-[10vh]  border-y-4 border-red-900 rounded-full  "></div>
                </div>
                {/* <SimpleProgressBar progress={progress} /> */}
                <div className="text-gray-900">Please wait teacher are being Updating, do not close the window...</div>
            </div>
        </div>
    );
}
