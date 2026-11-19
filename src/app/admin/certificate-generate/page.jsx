
"use client";

import React, { useState, useEffect, useCallback } from "react";
import _sidebar from "@/components/admin/_sidebar";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/services/admin-auth";

const API_URL = "https://certificate-generator-r95z.onrender.com";

const Form = () => {
  const router = useRouter();

  const [sheetId, setSheetId] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [webinarName, setWebinarName] = useState("");
  const [date, setDate] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);

  // Fetch certificate generation progress
  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/fetch-progress`);

      if (!response.ok) {
        throw new Error("Unable to fetch progress");
      }

      const result = await response.json();

      if (result.progress !== undefined) {
        const currentProgress = Number(result.progress);

        setProgress(
          Math.min(100, Math.max(0, currentProgress || 0))
        );
      }

      if (result.generatedCount !== undefined) {
        setGeneratedCount(Number(result.generatedCount) || 0);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, []);

  // Poll progress every 3 seconds
  useEffect(() => {
    fetchProgress();

    const interval = setInterval(() => {
      fetchProgress();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchProgress]);

  // Authentication
  useEffect(() => {
    isAuthenticated("/admin/login", router, false);
  }, [router]);

  // Generate certificates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setStatusType("info");
    setStatusMessage(
      "Generating and sending certificates, please wait..."
    );

    try {
      const response = await fetch(
        `${API_URL}/generate-certificates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sheetId,
            sheetName,
            webinarName,
            date,
            organizedBy,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Certificate generation failed."
        );
      }

      setStatusType("success");
      setStatusMessage(
        result.message || "Certificates generated and sent successfully!"
      );

      // Refresh progress
      fetchProgress();

    } catch (error) {
      console.error("Certificate generation error:", error);

      setStatusType("error");
      setStatusMessage(
        error.message ||
        "An error occurred while generating certificates."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="flex min-h-screen w-full bg-[#F4F8F8]">

      {/* Sidebar */}
      <_sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-y-auto">

        <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 lg:py-12">

          {/* Page Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold tracking-wide text-gray-900 md:text-3xl">
              LUNEBLAZE CERTIFICATES GENERATOR
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Generate and send webinar certificates directly
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            <form onSubmit={handleSubmit}>

              {/* Google Sheets ID */}
              <div className="mb-5">
                <label className={labelClass}>
                  Google Sheets ID
                </label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter Google Sheets ID"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  required
                />
              </div>

              {/* Sheet Name */}
              <div className="mb-5">
                <label className={labelClass}>
                  Sheet Name
                </label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter sheet name"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  required
                />
              </div>

              {/* Webinar Name */}
              <div className="mb-5">
                <label className={labelClass}>
                  Webinar Name
                </label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter webinar name"
                  value={webinarName}
                  onChange={(e) => setWebinarName(e.target.value)}
                  required
                />
              </div>

              {/* Date */}
              <div className="mb-5">
                <label className={labelClass}>
                  Date
                </label>

                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Speaker Name */}
              <div className="mb-7">
                <label className={labelClass}>
                  Speaker Name
                </label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter speaker name"
                  value={organizedBy}
                  onChange={(e) => setOrganizedBy(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Generating Certificates..."
                    : "Generate and Send Certificates"}
                </button>
              </div>

            </form>

            {/* Status Message */}
            {statusMessage && (
              <div
                role="status"
                className={`mt-6 rounded-lg border p-4 text-sm font-medium ${
                  statusType === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : statusType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {statusMessage}
              </div>
            )}

          </div>

          {/* Progress Section */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Generation Progress
              </h2>

              <span className="text-lg font-bold text-blue-600">
                {progress}%
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div
              className="h-5 w-full overflow-hidden rounded-full bg-gray-200"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Generated Count */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5">

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Certificates Generated and Sent
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-700">
                  {generatedCount}
                </p>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                {progress >= 100 ? "Completed" : "In Progress"}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Form;
