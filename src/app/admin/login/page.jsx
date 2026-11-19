"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { isAuthenticated, setToken } from '@/services/admin-auth';
import Image from 'next/image';
//import {BASE_URL} from "@/pages/api/constants";

export default function Login() {
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [showOtpPopup, setShowOtpPopup] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
	const [isTimerActive, setIsTimerActive] = useState(false);
	const [canResend, setCanResend] = useState(false);
	const otpInputRef = useRef(null);

	const router = useRouter();

	// Format timer to MM:SS
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	useEffect(() => {
		isAuthenticated('/admin', router, true);
	}, []);

	// Timer effect for OTP expiry
	useEffect(() => {
		let interval = null;
		if (isTimerActive && timer > 0) {
			interval = setInterval(() => {
				setTimer(timer => timer - 1);
			}, 1000);
		} else if (timer === 0) {
			setIsTimerActive(false);
			setCanResend(true);
		}
		return () => clearInterval(interval);
	}, [isTimerActive, timer]);

	// Reset timer when OTP popup opens
	useEffect(() => {
		if (showOtpPopup) {
			setTimer(300); // Reset to 5 minutes
			setIsTimerActive(true);
			setCanResend(false);
		}
	}, [showOtpPopup]);
	// Step 1: Check if email exists
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}authUserExist.json`,
				method: 'POST',
				data: { email },
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (res.status === 200 && res.data.status === 'success') {
				// Continue to OTP
				const otpRes = await axios({
					url: `${process.env.NEXT_PUBLIC_API_BASE_URL}getAuthUserViaEmail.json`,
					method: 'POST',
					data: { email },
					headers: {
						'Content-Type': 'application/json',
					},
					validateStatus: () => true,
				});
				if (otpRes.status === 200) {
					setShowOtpPopup(true);
					setSuccessMsg('OTP sent to your email.');
				} else {
					setShowOtpPopup(true);
					setError(otpRes.data.message || 'Failed to send OTP.');
				}
			} else {
				setError(res.data.message || 'User does not exist.');
			}

		} catch (err) {
			setSuccessMsg('');
			setError('Something went wrong.');
		}
		setLoading(false);
	};

	// Step 3: Handle OTP submit
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Check if OTP has expired on frontend
		if (timer === 0 && !canResend) {
			setError('OTP has expired. Please request a new one.');
			setLoading(false);
			return;
		}

		try {
			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}verifyOtpAndLogin.json`,
				method: 'POST',
				data: { email, otp },
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (res.status === 200 && res.data.status === 'success') {
				setSuccessMsg('Logged in successfully!');
				// Save user type in sessionStorage for sidebar
				if (res.data.user) {
					sessionStorage.setItem('user', JSON.stringify(res.data.user));
					await router.push('/admin');
				}

			} else {
				setError(res.data.message || 'Invalid OTP');
			}
		} catch (err) {
			setError('Something went wrong.');
		}
		setLoading(false);
	};


	// Loading screen component
	const LoadingScreen = () => (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-70">
			<div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center text-center">
				<Image
					src="https://media.licdn.com/dms/image/v2/C510BAQG5ZUP8tGjkFQ/company-logo_200_200/company-logo_200_200/0/1630596373940?e=2147483647&v=beta&t=yyuwvUeejbj57nDb1MZnui_qzwUdYHgBydXS3SkNC5E"
					width={100}
					height={100}
					alt="LuneBlaze Logo"
					className="mb-4"
				/>
				<h2 className="text-2xl font-extrabold text-gray-900 mb-2">Logging in...</h2>
				<p className="text-lg text-gray-700 mb-4">Organization: LuneBlaze</p>
				<div className="loader"></div>
				<style jsx>{`
				.loader {
					border: 8px solid #f3f3f3;
					border-top: 8px solid #3498db;
					border-radius: 50%;
					width: 60px;
					height: 60px;
					animation: spin 1s linear infinite;
					margin-top: 20px;
				}
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
			</div>
		</div>
	);
	// Resend OTP function
	const handleResendOtp = async () => {
		setError('');
		setSuccessMsg('');
		setLoading(true);
		try {
			const otpRes = await axios({
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}getAuthUserViaEmail.json`,
				method: 'POST',
				data: { email },
				headers: {
					'Content-Type': 'application/json',
				},
				validateStatus: () => true,
			});
			if (otpRes.status === 200) {
				setSuccessMsg('New OTP sent to your email.');
				setTimer(300); // Reset to 5 minutes
				setIsTimerActive(true);
				setCanResend(false);
				setOtp(''); // Clear previous OTP input
			} else {
				setError(otpRes.data.message || 'Failed to send OTP.');
			}
		} catch (err) {
			setError('Something went wrong.');
		}
		setLoading(false);
	};
	// OTP Popup
	const OtpPopup = () => {
		useEffect(() => {
			// Auto-focus the input when popup opens
			if (otpInputRef.current) {
				otpInputRef.current.focus();
			}
		}, []);

		return (
			<div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-70">
				<div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center text-center">
					<h2 className="text-2xl font-extrabold text-gray-900 mb-4">Enter OTP</h2>

					{/* Timer Display */}
					<div>
						{isTimerActive ? (
							<p className="text-[#17aeb6] font-semibold">
								OTP expires in: <span className="text-red-600">{formatTime(timer)}</span>
							</p>
						) : (
							<p className="text-red-600 font-semibold">OTP has expired</p>
						)}
					</div>
					{!canResend && (
						<form onSubmit={handleOtpSubmit} className="w-full">
							<input
								ref={otpInputRef}
								type="text"
								placeholder="Enter OTP"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
								disabled={loading}
								maxLength={6}
								autoComplete="off"
								inputMode="numeric"
								pattern="[0-9]*"
							/>
							<button
								type="submit"
								className="theme-btn btn-style-one bg-theme-color2 w-full"
								disabled={loading || (timer === 0 && !canResend)}
							>
								{loading ? 'Verifying...' : 'Verify OTP'}
							</button>
						</form>
					)}
					{/* Resend OTP Button */}

					{canResend && (
						<button
							onClick={handleResendOtp}
							className="mt-2 bg-[#17aeb6] text-white px-2 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm "
							disabled={loading}
						>
							{loading ? 'Sending...' : 'Resend OTP'}
						</button>
					)}
					{!canResend && error && <p className="text-red-600 mt-2">{error}</p>}
					{!canResend && successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
				</div>
			</div>
		);
	};


	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<section className="h-screen bg-gray-100" style={{ backgroundImage: "url('https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464866.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
			<div className="flex flex-col justify-center items-center h-full bg-gray-50 bg-opacity-20 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:flex lg:items-center lg:justify-between">
						{/* Left Image Section */}
						<div className="lg:w-1/2 mb-12 lg:mb-0 flex justify-center">
							<Image
								src="https://st4.depositphotos.com/14431644/22105/i/450/depositphotos_221058814-stock-illustration-word-writing-text-accredited-business.webp"
								width={400}
								height={400}
								alt="Accredited Business"
								className="rounded-lg shadow-xl"
							/>
						</div>

						{/* Right Form Section */}
						<div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-lg backdrop-blur-md mt-8 lg:mt-0 lg:ml-8">
							<h2 className="text-3xl font-extrabold text-gray-900 mb-6">
								Sign in to Admin Dashboard
							</h2>
							<p className="text-gray-600 mb-6">Please Enter Authorized Email</p>

							<form onSubmit={handleSubmit}>
								<div className="mb-6">
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email
									</label>
									<input
										type="text"
										id="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div className="flex justify-center items-center">
									<button
										type="submit"
										className="theme-btn btn-style-one bg-theme-color2"
									>
										{loading ? 'Logging in...' : 'Sign In'}
									</button>
								</div>

								{error && (
									<p className="text-red-600 mt-4">{error}</p>
								)}
								{successMsg && (
									<p className="text-green-600 mt-4">{successMsg}</p>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
			{showOtpPopup && <OtpPopup />}
		</section>
	);
}
