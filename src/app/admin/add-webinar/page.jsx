"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from '@/services/admin-auth';
import dynamic from 'next/dynamic';
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

export default function Magzine() {
	const router = useRouter();
	const fileInputRef = useRef(null);
	const imagefileinputRef = useRef(null);

	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);

	const editor = useRef(null);

	// --- CHANGE 1: Create a state to store the list of teachers ---
	const [teachers, setTeachers] = useState([]);

	const [mzData, setMZData] = useState({
		title: '',
		description: '',
		youtube: '',
		webinar_link: '',
		start_time: '',
		end_time: '',
		subtitle: '',
		date: '',
		content: '',
		speaker: '', // This will now hold the selected teacher's name
		fees: '',
		attendees: '',
		type: '',
	});

	const resetForm = () => {
		setMZData({
			title: '',
			description: '',
			youtube: '',
			webinar_link: '',
			start_time: '',
			end_time: '',
			subtitle: '',
			date: '',
			content: '',
			speaker: '',
			fees: '',
			attendees: '',
			type: '',
		});
		setImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		if (imagefileinputRef.current) {
			imagefileinputRef.current.value = '';
		}
	};

	// --- CHANGE 2: Correctly fetch teachers and populate the 'teachers' state ---
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				// Use axios to fetch the teachers list
				const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAllTeachers.json`);
				if (res.data && res.data.status === 'success') {
					// Set the array of teachers from the API response
					setTeachers(res.data.data);
				} else {
					toast.error('Could not fetch the list of teachers.');
				}
			} catch (error) {
				console.error("Error fetching teachers:", error);
				toast.error('An error occurred while fetching teachers.');
			}
		};

		fetchTeachers();
	}, []); // Empty dependency array makes this run only once when the component mounts

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Destructure 'speaker' from mzData
			const { title, description, youtube, subtitle, date, content, speaker, start_time, end_time, webinar_link, fees, attendees, type } = mzData;
			if (!title || !description || !image || !subtitle || !date || !content || !start_time || !end_time || !webinar_link || !fees || !attendees || !speaker || !type) {
				toast.error('All fields are required', {
					position: toast.POSITION.TOP_CENTER,
				});
				return;
			}

			let data = new FormData();
			data.append('title', title);
			data.append('description', description);
			data.append('youtube_link', youtube);
			data.append('webinar_link', webinar_link);
			data.append('start_time', start_time);
			data.append('end_time', end_time);
			data.append('image', image);
			data.append('subtitle', subtitle);
			data.append('session_date', date);
			data.append('content', content)
			data.append('speaker', speaker);
			data.append('fees', fees);
			data.append('attendees', attendees);
			data.append('type', type);

			setLoading(true);

			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}addSession.json`,
				method: 'POST',
				data: data,
				headers: {
					'content-Type': 'multipart/form-data',
				},
			});

			if (res.status === 200) {
				setLoading(false);
				toast.success('Session Added', {
					position: toast.POSITION.TOP_CENTER,
				});
				resetForm();
			} else {
				setLoading(false);
				toast.error('Session failed!', {
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
	}

	const handleEditorChange = (newContent) => {
		setMZData({ ...mzData, content: newContent });
	};

	useEffect(() => {
		isAuthenticated('/admin/login', router, false);
	}, [router]);

	return (
		<>
<div style={{ display: 'flex' }}>
				<_sidebar />
				<div style={{ height: '100vh', width: '100vw' }}>
					<div style={{ height: '100vh' }} className="flex">
						<div style={{ height: '70vh', width: '70vw' }} className="flex mx-auto my-auto flex-col">
							<h3>Add Webinar Video</h3>
							<div className="block p-6 rounded-lg shadow-lg h-fit bg-white">
								<form onSubmit={handleSubmit}>
									{/* ... other form fields ... */}
									<div className="form-group mb-6">
										<label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">Webinar Title</label>
										<input type="text" value={mzData.title} onChange={(e) => setMZData({ ...mzData, title: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="title" placeholder="Session Title" required />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="subtitle" className="form-label inline-block mb-2 text-gray-700">Webinar Subtitle (write as like placeholder for SEO friendly)</label>
										<input type="text" value={mzData.subtitle} onChange={(e) => setMZData({ ...mzData, subtitle: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="subtitle" placeholder="assessment-framework-of-sqaa" required />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="description" className="form-label inline-block mb-2 text-gray-700">Brief about Topic (Overview)</label>
										<textarea value={mzData.description} onChange={(e) => setMZData({ ...mzData, description: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="description" placeholder="Webinar Brief" required />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="link" className="form-label inline-block mb-2 text-gray-700">Youtube Link</label>
										<input type="text" value={mzData.youtube} onChange={(e) => setMZData({ ...mzData, youtube: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="link" placeholder="Youtube Link" />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="google_link" className="form-label inline-block mb-2 text-gray-700">Google Meet Link</label>
										<input type="text" value={mzData.webinar_link} onChange={(e) => setMZData({ ...mzData, webinar_link: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="google_link" placeholder="Google Meet Link" />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="fees" className="form-label inline-block mb-2 text-gray-700">Registration Fees</label>
										<input type="text" value={mzData.fees} onChange={(e) => setMZData({ ...mzData, fees: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="fees" placeholder="Registration Fees" />
									</div>

									{/* --- CHANGE 3: Update the select/dropdown to use the correct state and handlers --- */}
									<div className="form-group mb-6">
										<label htmlFor="speaker" className="form-label inline-block mb-2 text-gray-700">
											Speaker
										</label>
										<select
											value={mzData.speaker} // Bind value to the 'speaker' property in mzData
											onChange={(e) => setMZData({ ...mzData, speaker: e.target.value })} // Update the correct state on change
											className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											id="speaker"
											required
										>
											<option value="">Select Speaker *</option>
											{/* Map over the 'teachers' state array to render options */}
											{teachers.map((teacher) => (
												<option key={teacher.teacher_id} value={teacher.teacher_name}>
													{teacher.teacher_name}
												</option>
											))}
										</select>
									</div>

									<div className="form-group mb-6">
										<label htmlFor="type" className="form-label inline-block mb-2 text-gray-700">
											Type
										</label>
										<select
											value={mzData.type}
											onChange={(e) => setMZData({ ...mzData, type: e.target.value })}
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
										<label htmlFor="attendees" className="form-label inline-block mb-2 text-gray-700">Attendees</label>
										<input type="text" value={mzData.attendees} onChange={(e) => setMZData({ ...mzData, attendees: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="attendees" placeholder="Attendees" />
									</div>

									<div className="form-group mb-6">
										<label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Webinar Related Image</label>
										<input type="file" accept="image/*" onChange={handlePictureChange} className="form-control" id="image" ref={fileInputRef} required />
									</div>
									<div className="form-group mb-6">
										<label htmlFor="date" className="form-label inline-block mb-2 text-gray-700">Webinar Date</label>
										<input type='date' value={mzData.date} onChange={(e) => setMZData({ ...mzData, date: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="date" placeholder="date" required />
									</div>
									<div className="flex gap-4 mb-6">
										<div className="form-group w-1/2">
											<label htmlFor="start_time" className="form-label inline-block mb-2 text-gray-700">Webinar start time</label>
											<input type='time' value={mzData.start_time} onChange={(e) => setMZData({ ...mzData, start_time: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="start_time" placeholder="start_time" required />
										</div>
										<div className="form-group w-1/2">
											<label htmlFor="end_time" className="form-label inline-block mb-2 text-gray-700">Webinar End time</label>
											<input type='time' value={mzData.end_time} onChange={(e) => setMZData({ ...mzData, end_time: e.target.value })} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="end_time" placeholder="end_time" required />
										</div>
									</div>
									<JoditEditor ref={editor} value={mzData.content} tabIndex={1} onChange={handleEditorChange} />
									<button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">SUBMIT</button>
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
				<div className="text-gray-900">Please wait, feedback is being added. Do not close the window...</div>
			</div>
		</div>
	);
}
