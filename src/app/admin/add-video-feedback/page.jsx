"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useFetch from '@/hooks/useFetch';
import { isAuthenticated } from '@/services/admin-auth';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

export default function Magzine() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);
	const [logo, setLogo] = useState(null);
	const imageInputRef = useRef(null);
	const logoInputRef = useRef(null);

	const { data, fetchData } = useFetch();

	const [mzData, setMZData] = useState({
		name: '',
		designation: '',
		text_feedback: '', // Updated field
		school_name: ''
	});

	const resetForm = () => {
		setMZData({
			name: '',
			designation: '',
			text_feedback: '', // Updated field
			school_name: '',
		});
		imageInputRef.current.value = null;
		logoInputRef.current.value = null;
		setImage(null);
		setLogo(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { name, designation, text_feedback, school_name } = mzData; // Updated field
			if (!name || !designation || !text_feedback || !school_name || !image || !logo) {
				toast.error('All fields are required', {
					position: toast.POSITION.TOP_CENTER,
				});
				return;
			}

			let data = new FormData();
			data.append('name', name);
			data.append('designation', designation);
			data.append('school_name', school_name);
			data.append('text_feedback', text_feedback); // Updated field
			data.append('image', image);
			data.append('school_logo', logo);
			setLoading(true);

			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}addVideoFeed.json`,
				method: 'POST',
				data: data,
				headers: {
					'content-Type': 'multipart/form-data',
				},
			});

			if (res.status === 200) {
				setLoading(false);
				toast.success('Feedback Added', {
					position: toast.POSITION.TOP_CENTER,
				});
				resetForm();
			} else {
				setLoading(false);
				toast.error('Feedback failed!', {
					position: toast.POSITION.TOP_CENTER,
				});
			}
		} catch (err) {
			setLoading(false);
			toast.error('Submission failed! ' + err.response?.data?.message, {
				position: toast.POSITION.TOP_CENTER,
			});
		}
	};

	const handlePictureChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			try {
				const webpFile = await convertToWebP(file);
				setImage(webpFile);
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
	const handleLogoChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			try {
				const webpFile = await convertToWebP(file);
				setLogo(webpFile);
				toast.success('Logo converted to WebP format', {
					position: toast.POSITION.TOP_CENTER,
				});
			} catch (error) {
				console.error('Error converting logo:', error);
				toast.error('Failed to convert logo', {
					position: toast.POSITION.TOP_CENTER,
				});
			}
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
					<div style={{ height: '100vh' }} className="flex">
						<div
							style={{ height: '70vh', width: '70vw' }}
							className="flex mx-auto my-auto flex-col"
						>
							<h3>Add Feedback</h3>
							<div className="block p-6 rounded-lg shadow-lg h-fit bg-white">
								<form>
									<div className="form-group mb-6">
										<label htmlFor="studentName" className="form-label inline-block mb-2 text-gray-700">
											Person Name
										</label>
										<input
											type="text"
											value={mzData.name}
											onChange={(e) => setMZData({ ...mzData, name: e.target.value })}
											className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											id="name"
											placeholder="Enter name"
											required
										/>
									</div>
									<div className="form-group mb-6">
										<label htmlFor="Class" className="form-label inline-block mb-2 text-gray-700">
											Designation
										</label>
										<textarea
											value={mzData.designation}
											onChange={(e) => setMZData({ ...mzData, designation: e.target.value })}
											className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											id="designation"
											placeholder="Enter the Designation"
											required
										/>
									</div>
									<div className="form-group mb-6">
										<label htmlFor="feedback" className="form-label inline-block mb-2 text-gray-700">
											Text Feedback
										</label>
										<textarea
											value={mzData.text_feedback} // Updated field
											onChange={(e) => setMZData({ ...mzData, text_feedback: e.target.value })} // Updated field
											className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											id="feedback"
											placeholder="Enter Feedback"
											required
										/>
									</div>
									<div className="form-group mb-6">
										<label htmlFor="school" className="form-label inline-block mb-2 text-gray-700">
											School Name
										</label>
										<input
											type="text"
											value={mzData.school_name}
											onChange={(e) => setMZData({ ...mzData, school_name: e.target.value })}
											className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											id="school"
											placeholder="Enter School Name"
											required
										/>
									</div>
									<div className="form-group mb-6">
										<label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">
											Image
										</label>
										<input
											type="file"
											accept="image/*"
											onChange={handlePictureChange}
											className="form-control"
											id="image"
											ref={imageInputRef}
											required
										/>
									</div>
									<div className="form-group mb-6">
										<label htmlFor="logo" className="form-label inline-block mb-2 text-gray-700">
											School Logo
										</label>
										<input
											type="file"
											accept="image/*"
											onChange={handleLogoChange}
											className="form-control"
											id="logo"
											ref={logoInputRef}
											required
										/>
									</div>
									<button
										className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
										onClick={handleSubmit}
									>
										SUBMIT
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
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
				<div className="text-gray-900">Please wait Feedback is being Added, do not close the window...</div>
			</div>
		</div>
	);
};
