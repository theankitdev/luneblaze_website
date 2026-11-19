"use client";
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import _sidebar from '@/components/admin/_sidebar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
// import { BASE_URL } from '../api/constants';
import Image from "next/image";
import useFetch from '@/hooks/useFetch';
// import SimpleProgressBar from "@/Components/Loading/SimpleProgressBar";
// TODO: Replace with the intended shared internships component.
import { isAuthenticated } from '@/services/admin-auth';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Magzine() {
	const router = useRouter();
    const searchParams = useSearchParams();
	const [swrData, setSWRData] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataLoading, setDataLoading] = useState(true);
	const [front_page, setFrontPage] = useState(null);
	const [progress, setProgress] = useState(0);


	const [courseImage, setCourseImage] = useState(null);
	const [courseThumbnail, setCourseThumnail] = useState(null);

	const [orgData, setOrgData] = useState([]);

	const { data, fetchData } = useFetch();

	const [mzData, setMZData] = useState({
		organizationId: '',
		courseTitle: '',
		courseDescription: '',
		courseDifficulty: 'beginner',
		courseDuration: '',
		courseLesson: '',
		enrolledStudents: '',
		courseLanguage: '',
		coursePrice: '',
		courseGoal: '',
	});

	const resetForm = () => {
		setMZData({
			organizationId: '',
			courseTitle: '',
			courseDescription: '',
			courseDifficulty: 'beginner',
			courseDuration: '',
			courseLesson: '',
			enrolledStudents: '',
			courseLanguage: '',
			coursePrice: '',
			courseGoal: '',
			coursePicture: '',
			courseThumbnail: '',
		});
	};

	useEffect(() => {
		fetchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}getAllOrganisations.json`, "GET")
		setOrgData(data)
	}, [data])




	useEffect(() => {
		// isAuthenticated('/admin/login', router, false);


		if (!true) return;

		if (!searchParams.get("id")) return;

		const handleUpdateData = async () => {
			try {
				const res = await axios.get(BASE_URL + `get.json?id=${searchParams.get("id")}`);
				if (res.status === 200) {
					setMZData({
						Edition: res.data.edition,
						Price: res.data.price,
						About: res.data.about,
						meta: res.data.meta_tags,
						description: res.data.description,
					});
					setDataLoading(false);
					setSWRData(true);
				}
				// data && setSWRData(data);
			} catch (err) {
				console.log(err);
			}
		};

		handleUpdateData();
	}, [true]);

	const handleUpdate = async (e) => {

		e.preventDefault();
		try {
			if (!searchParams.get("id")) return;

			if (!true) return;

			const id = searchParams.get("id");

			const { Edition, Price, About, meta, description } = mzData;

			if (!file || !Edition || !About || !Price || !meta || !description) {
				toast.error('Please fill in all required fields.', {
					position: toast.POSITION.TOP_CENTER,
				});
				return;
			}

			const headers = {
				'Content-Type': 'multipart/form-data',
			};
			setLoading(true);
			const res = await axios.post(
				BASE_URL + `update/?id=${id}`,
				{
					file,
					Edition,
					About,
					Price,
					meta,
					description,
				},
				{
					headers,
				}
			);

			if (res.status === 200) {
				setLoading(false);
				toast.success('Update Successfully', {
					position: toast.POSITION.TOP_CENTER,
				});
			}
		} catch (err) {
			setLoading(false);
			// errors
			toast.error('Update failed!', {
				position: toast.POSITION.TOP_CENTER,
			});
		}
	};

	const handleSubmit = async (e) => {
		// console.log(mzData.organizationId)
		e.preventDefault();

		try {
			const { organizationId, courseTitle, courseDescription, courseDifficulty, courseDuration, courseLesson, enrolledStudents, courseLanguage, coursePrice, courseGoal } = mzData;

			if (
				!organizationId ||
				!courseTitle ||
				!courseDescription ||
				!courseDuration ||
				!courseLesson ||
				!enrolledStudents ||
				!courseLanguage ||
				!coursePrice ||
				!courseGoal ||
				!courseImage ||
				!courseThumbnail

			) {
				toast.error('All fields are required', {
					position: toast.POSITION.TOP_CENTER,
				});
				return
			}



			let data = new FormData();

			data.append('organisation_id', organizationId);
			data.append('course_title', courseTitle);
			data.append('course_description', courseDescription);
			data.append('course_difficulty', courseDifficulty);
			data.append('course_duration', courseDuration);
			data.append('course_lessons', courseLesson);
			data.append('enrolled_student_count', enrolledStudents);
			data.append('course_language', courseLanguage);
			data.append('course_price', coursePrice);
			data.append('course_goal', courseGoal);
			data.append('course_thumbnail', courseThumbnail);
			data.append('course_picture', courseImage);



			setLoading(true);

			// post request for adding internships to db
			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}addInternship.json`,
				method: 'POST',
				data: data,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
			);

			if (res.status === 201) {
				setLoading(false);
				// success submission
				toast.success('Internship Added', {
					position: toast.POSITION.TOP_CENTER,
				});
				resetForm()
			} else {
				setLoading(false);
				console.log(res)
				// errors
				toast.error('Inernship failed!.:', {
					position: toast.POSITION.TOP_CENTER,
				});
			}
			console.log(res);
		} catch (err) {
			// errors
			setLoading(false);
			console.log();
			toast.error('Submission failed! ' + err.response.data?.message, {
				position: toast.POSITION.TOP_CENTER,

			});
		}
	};

	const handlePictureChange = (e) => {
		setCourseImage(e.target.files[0])
	}

	const handleThumbnailChange = (e) => {
		setCourseThumnail(e.target.files[0])
	}

	useEffect(() => {
		isAuthenticated('/admin/login', router, false);
	}, [isAuthenticated]);

	return (
		<>
<div style={{ display: 'flex', }}>
				<_sidebar />
				{loading ? <LoadingComponent progress={progress} /> : (

					swrData ? (
						<div style={{ height: '100vh', width: '100vw' }}>
							<div style={{ height: '100vh' }} className="flex">
								<div
									style={{ height: '70vh', width: '70vw' }}
									className="flex mx-auto my-auto flex-col"
								>
									<h3>Update Internship</h3>

									{/* Edition */}
									<div className="block p-6 rounded-lg font-inter font-normal shadow-lg h-fit bg-white ">
										<form>
											{/* Organization Id */}
											<div className="form-group mb-6">
												<label htmlFor="organizationId" className="form-label inline-block mb-2 text-gray-700">
													Organization Id
												</label>
												<input
													type="text"
													value={mzData.organizationId}
													onChange={(e) => setOrgId(e.target.value)}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="organizationId"
													placeholder="Organization Id"
												/>
											</div>
											{/* Course Title */}
											<div className="form-group mb-6">
												<label htmlFor="courseTitle" className="form-label inline-block mb-2 text-gray-700">
													Course Title
												</label>
												<input
													type="text"
													value={mzData.courseTitle}
													onChange={(e) => setMZData({ ...mzData, courseTitle: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseTitle"
													placeholder="Course Title"
												/>
											</div>
											{/* Course description */}
											<div className="form-group mb-6">
												<label htmlFor="courseDescription" className="form-label inline-block mb-2 text-gray-700">
													Course Description
												</label>
												<textarea
													value={mzData.courseDescription}
													onChange={(e) => setMZData({ ...mzData, courseDescription: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDescription"
													placeholder="Course Description"
												/>
											</div>
											{/* Course difficulty */}
											<div className="form-group mb-6">
												<label htmlFor="courseDifficulty" className="form-label inline-block mb-2 text-gray-700">
													Course Difficulty
												</label>
												<select
													value={mzData.courseDifficulty}
													onChange={(e) => setMZData({ ...mzData, courseDifficulty: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDifficulty"
												>
													<option value="beginner">Beginner</option>
													<option value="intermediate">Intermediate</option>
													<option value="advanced">Advanced</option>
												</select>
											</div>
											{/* Organization Id */}
											<div className="form-group mb-6">
												<label htmlFor="organizationId" className="form-label inline-block mb-2 text-gray-700">
													Organization Id
												</label>
												<input
													type="text"
													value={mzData.organizationId}
													onChange={(e) => setMZData({ ...mzData, organizationId: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="organizationId"
													placeholder="Organization Id"
												/>
											</div>
											{/* Course Title */}
											<div className="form-group mb-6">
												<label htmlFor="courseTitle" className="form-label inline-block mb-2 text-gray-700">
													Course Title
												</label>
												<input
													type="text"
													value={mzData.courseTitle}
													onChange={(e) => setMZData({ ...mzData, courseTitle: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseTitle"
													placeholder="Course Title"
												/>
											</div>
											{/* Course description */}
											<div className="form-group mb-6">
												<label htmlFor="courseDescription" className="form-label inline-block mb-2 text-gray-700">
													Course Description
												</label>
												<textarea
													value={mzData.courseDescription}
													onChange={(e) => setMZData({ ...mzData, courseDescription: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDescription"
													placeholder="Course Description"
												/>
											</div>
											{/* Course difficulty */}
											<div className="form-group mb-6">
												<label htmlFor="courseDifficulty" className="form-label inline-block mb-2 text-gray-700">
													Course Difficulty
												</label>
												<select
													value={mzData.courseDifficulty}
													onChange={(e) => setMZData({ ...mzData, courseDifficulty: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDifficulty"
												>
													<option value="beginner">Beginner</option>
													<option value="intermediate">Intermediate</option>
													<option value="advanced">Advanced</option>
												</select>
											</div>
											<div className="form-group mb-6">
												<label htmlFor="courseDuration" className="form-label inline-block mb-2 text-gray-700">
													Course Duration
												</label>
												<input
													type="text"
													value={mzData.courseDuration}
													onChange={(e) => setMZData({ ...mzData, courseDuration: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDuration"
													placeholder="Course Duration (e.g. 10 hours)"
												/>
											</div>
											{/* Course Lesson */}
											<div className="form-group mb-6">
												<label htmlFor="courseLesson" className="form-label inline-block mb-2 text-gray-700">
													Course Lesson
												</label>
												<input
													type="text"
													value={mzData.courseLesson}
													onChange={(e) => setMZData({ ...mzData, courseLesson: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseLesson"
													placeholder="Course Lesson (e.g. 10 lectures)"
												/>
											</div>
											{/* Enrolled Students Count */}
											<div className="form-group mb-6">
												<label htmlFor="enrolledStudents" className="form-label inline-block mb-2 text-gray-700">
													Enrolled Students Count
												</label>
												<input
													type="number"
													value={mzData.enrolledStudents}
													onChange={(e) => setMZData({ ...mzData, enrolledStudents: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="enrolledStudents"
													placeholder="Enrolled Students Count"
												/>
											</div>
											{/* Course Language */}
											<div className="form-group mb-6">
												<label htmlFor="courseLanguage" className="form-label inline-block mb-2 text-gray-700">
													Course Language
												</label>
												<input
													type="text"
													value={mzData.courseLanguage}
													onChange={(e) => setMZData({ ...mzData, courseLanguage: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseLanguage"
													placeholder="Course Language"
												/>
											</div>
											{/* Course Price */}
											<div className="form-group mb-6">
												<label htmlFor="coursePrice" className="form-label inline-block mb-2 text-gray-700">
													Course Price
												</label>
												<input
													type="text"
													value={mzData.coursePrice}
													onChange={(e) => setMZData({ ...mzData, coursePrice: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="coursePrice"
													placeholder="Course Price"
												/>
											</div>
											{/* Course Goal */}
											<div className="form-group mb-6">
												<label htmlFor="courseGoal" className="form-label inline-block mb-2 text-gray-700">
													Course Goal
												</label>
												<textarea
													value={mzData.courseGoal}
													onChange={(e) => setMZData({ ...mzData, courseGoal: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseGoal"
													placeholder="Course Goal"
												/>
											</div>
											{/* Course Picture */}
											<div className="form-group mb-6">
												<label htmlFor="coursePicture" className="form-label inline-block mb-2 text-gray-700">
													Course Picture (Recommended size: 1300 X 650)
												</label>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handlePictureChange(e)}
													className="form-control"
													id="coursePicture"
												/>
											</div>
											{/* Course Thumbnail */}
											<div className="form-group mb-6 ">
												<label htmlFor="courseThumbnail" className="form-label inline-block mb-2 text-gray-700">
													Course Thumbnail (Recommended size: 270 X 270)
												</label>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handleThumbnailChange(e)}
													className="form-control"
													id="courseThumbnail"
												/>
											</div>
											<button
												className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
												onClick={(e) => handleUpdate(e)}
											>
												UPDATE
											</button>
										</form>

									</div>
								</div>
							</div>
						</div>
					) : (
						<div style={{ height: '100vh', width: '100vw' }}>
							<div style={{ height: '100vh' }} className="flex">
								<div
									style={{ height: '70vh', width: '70vw' }}
									className="flex mx-auto my-auto flex-col"
								>
									<h3>Add Internship</h3>
									{/* Edition */}
									<div className="block p-6 rounded-lg shadow-lg h-fit bg-white ">
										<form>
											{/* Organization name */}
											<div className="form-group mb-6">

												<select
													value={mzData.organizationId}
													onChange={(e) => setMZData({ ...mzData, organizationId: e.target.value })}

													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDifficulty"
												>
													<option>Select Organization</option>
													{
														orgData?.map((_) => (
															<option value={_.organisation_id}>{_.organisation_name}</option>
														))
													}
												</select>
											</div>
											{/* Course Title */}
											<div className="form-group mb-6">
												<label htmlFor="courseTitle" className="form-label inline-block mb-2 text-gray-700">
													Internship Title
												</label>
												<input
													type="text"
													value={mzData.courseTitle}
													onChange={(e) => setMZData({ ...mzData, courseTitle: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseTitle"
													placeholder="Course Title"
													required
												/>
											</div>
											{/* Course description */}
											<div className="form-group mb-6">
												<label htmlFor="courseDescription" className="form-label inline-block mb-2 text-gray-700">
													Internship Description
												</label>
												<textarea
													value={mzData.courseDescription}
													onChange={(e) => setMZData({ ...mzData, courseDescription: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDescription"
													placeholder="Course Description"
													required
												/>
											</div>
											{/* Course difficulty */}
											<div className="form-group mb-6">
												<label htmlFor="courseDifficulty" className="form-label inline-block mb-2 text-gray-700">
													Internship Difficulty
												</label>
												<select
													value={mzData.courseDifficulty}
													onChange={(e) => setMZData({ ...mzData, courseDifficulty: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDifficulty"
												>
													<option value="beginner">Beginner</option>
													<option value="intermediate">Intermediate</option>
													<option value="advanced">Advanced</option>
												</select>
											</div>
											<div className="form-group mb-6">
												<label htmlFor="courseDuration" className="form-label inline-block mb-2 text-gray-700">
													Internship Duration
												</label>
												<input
													type="text"
													value={mzData.courseDuration}
													onChange={(e) => setMZData({ ...mzData, courseDuration: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseDuration"
													placeholder="Course Duration (e.g. 10 hours)"
													required
												/>
											</div>
											{/* Course Lesson */}
											<div className="form-group mb-6">
												<label htmlFor="courseLesson" className="form-label inline-block mb-2 text-gray-700">
													Internship Lesson
												</label>
												<input
													type="text"
													value={mzData.courseLesson}
													onChange={(e) => setMZData({ ...mzData, courseLesson: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseLesson"
													placeholder="Course Lesson (e.g. 10 lectures)"
													required
												/>
											</div>
											{/* Enrolled Students Count */}
											<div className="form-group mb-6">
												<label htmlFor="enrolledStudents" className="form-label inline-block mb-2 text-gray-700">
													Enrolled Students Count
												</label>
												<input
													type="number"
													value={mzData.enrolledStudents}
													onChange={(e) => setMZData({ ...mzData, enrolledStudents: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="enrolledStudents"
													placeholder="Enrolled Students Count"
													required
												/>
											</div>
											{/* Course Language */}
											<div className="form-group mb-6">
												<label htmlFor="courseLanguage" className="form-label inline-block mb-2 text-gray-700">
													Internship Language
												</label>
												<input
													type="text"
													value={mzData.courseLanguage}
													onChange={(e) => setMZData({ ...mzData, courseLanguage: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseLanguage"
													placeholder="Course Language"
													required
												/>
											</div>
											{/* Course Price */}
											<div className="form-group mb-6">
												<label htmlFor="coursePrice" className="form-label inline-block mb-2 text-gray-700">
													Internship Price
												</label>
												<input
													type="text"
													value={mzData.coursePrice}
													onChange={(e) => setMZData({ ...mzData, coursePrice: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="coursePrice"
													placeholder="Course Price"
													required
												/>
											</div>
											{/* Course Goal */}
											<div className="form-group mb-6">
												<label htmlFor="courseGoal" className="form-label inline-block mb-2 text-gray-700">
													Internship Goal
												</label>
												<textarea
													value={mzData.courseGoal}
													onChange={(e) => setMZData({ ...mzData, courseGoal: e.target.value })}
													className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
													id="courseGoal"
													placeholder="Course Goal"
													required
												/>
											</div>
											{/* Course Picture */}
											<div className="form-group mb-6">
												<label htmlFor="coursePicture" className="form-label inline-block mb-2 text-gray-700">
													Internship Image (Recommended size: 1300 X 650)
												</label>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handlePictureChange(e)}
													className="form-control"
													id="coursePicture"
													required
												/>
											</div>
											{/* Course Thumbnail */}
											<div className="form-group mb-6">
												<label htmlFor="courseThumbnail" className="form-label inline-block mb-2 text-gray-700">
													Internship Thumbnail (Recommended size: 270 X 270)
												</label>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handleThumbnailChange(e)}
													className="form-control"
													id="courseThumbnail"
													required
												/>
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
					))
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
				<div className="text-gray-900">Please wait Internship are being Added, do not close the window...</div>
			</div>
		</div>
	);
}
