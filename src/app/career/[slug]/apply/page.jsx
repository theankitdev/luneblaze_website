
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getJobBySlug,
  submitJobApplication,
} from "@/services/jobService";

const ROLE_OPTIONS = [
  "Quality & Accreditation Consultant",
  "IQAC Implementation Specialist",
  "Frontend Engineer",
  "Customer Success Manager",
  "Content & Training Associate",
  "Business Development — Institutions",
  "Something else",
];

const EXPERIENCE_OPTIONS = [
  "Fresher",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "10+ years",
];

export default function ApplyPage({ params }) {
  const [slug, setSlug] = useState("");
  const [job, setJob] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [sent, setSent] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Resolve dynamic route params
  useEffect(() => {
    let active = true;

    Promise.resolve(params)
      .then((resolvedParams) => {
        if (active) {
          setSlug(resolvedParams?.slug || "");
        }
      })
      .catch((error) => {
        console.error("Route Params Error:", error);

        if (active) {
          setSubmitError(
            "Unable to read the job URL. Please go back and try again."
          );
          setLoadingJob(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params]);

  // Fetch job details
  useEffect(() => {
    if (!slug) return;

    let active = true;

    const fetchJob = async () => {
      setLoadingJob(true);
      setSubmitError("");

      try {
        const data = await getJobBySlug(slug);

        if (!active) return;

        if (!data) {
          setJob(null);
          setSubmitError(
            "This job opening is no longer available."
          );
          return;
        }

        setJob(data);
        setSelectedRole(data.title || "");
      } catch (error) {
        if (!active) return;

        console.error("Get Job Details Error:", error);

        setJob(null);
        setSubmitError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load this job opening. Please try again."
        );
      } finally {
        if (active) {
          setLoadingJob(false);
        }
      }
    };

    fetchJob();

    return () => {
      active = false;
    };
  }, [slug]);

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!job?.id || !slug) {
      setSubmitError(
        "Job details are not available. Please refresh the page and try again."
      );
      return;
    }

    const formElement = e.currentTarget;

    setSubmitting(true);
    setSubmitError("");

    try {
      // Keep FormData intact so the resume file is not lost.
      const formData = new FormData(formElement);

      // Backend identifies the job using its slug.
      formData.append("slug", slug);

      // Send multipart/form-data through jobService.
      const response = await submitJobApplication(formData);

      // Validate API response.
      if (
        response?.status !== "success" &&
        response?.success !== true
      ) {
        throw new Error(
          response?.message ||
            response?.error ||
            "Application submission failed."
        );
      }

      setSent(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Submit Job Application Error:", error);

      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Your application could not be submitted. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loadingJob || !slug) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCEAEC] border-t-[#17AEB9]" />

          <p className="mt-4 text-sm font-semibold text-[#5F7175]">
            Loading application form...
          </p>
        </div>
      </main>
    );
  }

  // Job not found
  if (!job) {
    return (
      <main className="min-h-screen bg-[#FBFCFC] px-5 pt-32 text-center font-[Manrope,ui-sans-serif,system-ui,sans-serif]">
        <h1 className="text-2xl font-extrabold text-[#152A2E]">
          Job not available
        </h1>

        <p className="mt-3 text-sm text-[#5F7175]">
          {submitError}
        </p>

        <Link
          href="/careers"
          className="mt-5 inline-flex font-bold text-[#0E8B95]"
        >
          See current openings
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">

      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-[clamp(20px,4vw,52px)] pb-[clamp(22px,2.6vw,34px)] pt-[clamp(60px,4vw,134px)]"
      >
        <div className="relative mx-auto max-w-[820px] text-center">
          <span className="inline-flex items-center gap-2 rounded-[4px] border border-[#BEE2E6] bg-[#DFF1F3] px-[14px] py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">
            Application
          </span>

          <h1 className="mt-[18px] text-[clamp(27px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.034em] text-[#152A2E]">
            Tell Us About Yourself
          </h1>

          <p className="mx-auto mt-4 max-w-[56ch] text-[clamp(14.5px,1.15vw,17px)] leading-[1.64] text-[#4C6165]">
            A few questions rather than a long form. We read every application ourselves.
          </p>
        </div>
      </section>

      {/* Form / Success */}
      <section
        id="form"
        className="relative overflow-hidden bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] pb-[clamp(40px,4.6vw,68px)] pt-[clamp(24px,2.8vw,42px)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FDFD] via-[#F1FAFB] to-[#EDF7F8]" />

          <div className="absolute inset-0 opacity-[0.24] [background-image:radial-gradient(circle,rgba(23,174,185,0.22)_1.1px,transparent_1.1px)] [background-size:30px_30px]" />
        </div>

        <div className="relative mx-auto max-w-[760px]">

          {!sent ? (
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="rounded-[10px] border border-[#DCEAEC] bg-white p-[clamp(20px,2.2vw,30px)] shadow-[0_2px_4px_rgba(23,35,38,0.03),0_30px_60px_-42px_rgba(15,60,66,0.45)]"
            >
              {/* Error */}
              {submitError && (
                <div
                  role="alert"
                  className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}

              {/* Selected job */}
              <div className="mb-3 rounded-[8px] bg-[#F1FAFB] px-4 py-3 text-sm text-[#3E5257]">
                Applying for:{" "}
                <strong className="text-[#152A2E]">
                  {job.title}
                </strong>
              </div>

              <div className="grid gap-[13px]">

                {/* About you */}
                <div className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">
                  About you
                </div>

                <div className="grid gap-[13px] sm:grid-cols-2">
                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Full name
                    </span>

                    <input
                      required
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                  </label>

                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Age
                    </span>

                    <input
                      required
                      type="number"
                      min={16}
                      max={80}
                      name="age"
                      placeholder="e.g. 28"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                  </label>
                </div>

                <div className="grid gap-[13px] sm:grid-cols-2">
                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Email
                    </span>

                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                  </label>

                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Phone
                    </span>

                    <input
                      required
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                  </label>
                </div>

                <div className="grid gap-[13px] sm:grid-cols-2">
                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Role applying for
                    </span>

                    <select
                      required
                      name="role"
                      value={selectedRole}
                      onChange={(event) =>
                        setSelectedRole(event.target.value)
                      }
                      className="w-full appearance-none rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    >
                      <option value="">Select</option>

                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}

                      {/* Allow the actual job title even if it is
                          not included in the predefined role list. */}
                      {job.title &&
                        !ROLE_OPTIONS.includes(job.title) && (
                          <option value={job.title}>
                            {job.title}
                          </option>
                        )}
                    </select>
                  </label>

                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Years of experience
                    </span>

                    <select
                      required
                      name="experience"
                      defaultValue=""
                      className="w-full appearance-none rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    >
                      <option value="">Select</option>

                      {EXPERIENCE_OPTIONS.map((experience) => (
                        <option
                          key={experience}
                          value={experience}
                        >
                          {experience}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Background */}
                <div className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">
                  Background
                </div>

                <label className="grid gap-[7px]">
                  <span className="text-[12px] font-bold text-[#3E5257]">
                    Education
                  </span>

                  <textarea
                    required
                    name="education"
                    rows={2}
                    placeholder="Highest qualification, institution and year"
                    className="w-full resize-y rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                  />
                </label>

                <div className="grid gap-[13px] sm:grid-cols-2">
                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Resume
                    </span>

                    <input
                      required
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                    <span className="text-[11px] text-[#8A9B9E]">
                      Accepted formats: PDF, DOC, DOCX
                    </span>
                  </label>

                  <label className="grid gap-[7px]">
                    <span className="text-[12px] font-bold text-[#3E5257]">
                      Profile link{" "}
                      <span className="font-medium text-[#8A9B9E]">
                        (LinkedIn, portfolio)
                      </span>
                    </span>

                    <input
                      name="profile"
                      type="url"
                      placeholder="https://"
                      className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                    />
                  </label>
                </div>

                <label className="grid gap-[7px]">
                  <span className="text-[12px] font-bold text-[#3E5257]">
                    Recent projects
                  </span>

                  <textarea
                    required
                    name="projects"
                    rows={4}
                    placeholder="Two or three things you have worked on recently, and what your part in them was"
                    className="w-full resize-y rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                  />
                </label>

                <label className="grid gap-[7px]">
                  <span className="text-[12px] font-bold text-[#3E5257]">
                    Why do you want to join Luneblaze?
                  </span>

                  <textarea
                    required
                    name="why"
                    rows={4}
                    placeholder="What draws you to this work in particular"
                    className="w-full resize-y rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                  />
                </label>

                <label className="grid gap-[7px]">
                  <span className="text-[12px] font-bold text-[#3E5257]">
                    Anything else?{" "}
                    <span className="font-medium text-[#8A9B9E]">
                      (optional)
                    </span>
                  </span>

                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Notice period, location constraints, anything we should know"
                    className="w-full resize-y rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]"
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#17AEB9] px-6 py-3.5 text-[14.5px] font-extrabold tracking-[0.02em] text-white shadow-[0_12px_28px_-10px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "SUBMITTING..."
                  : "SUBMIT APPLICATION"}

                {!submitting && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12h14" />
                    <path d="M12 6l6 6-6 6" />
                  </svg>
                )}
              </button>

              <p className="mt-3 text-center text-[11.5px] leading-[1.55] text-[#8A9B9E]">
                We reply to every application, usually within a week.
              </p>
            </form>
          ) : (

            /* Success message */
            <div className="mx-auto mt-[clamp(10px,2vw,30px)] max-w-[600px] rounded-[10px] border border-[#DCEAEC] bg-white px-[clamp(28px,3.4vw,48px)] py-[clamp(28px,3.4vw,48px)] text-center shadow-[0_2px_4px_rgba(23,35,38,0.03),0_34px_66px_-40px_rgba(15,60,66,0.5)]">
              <span
                aria-hidden="true"
                className="inline-flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#E8F7EF] text-[#0E9F6E] shadow-[0_0_0_9px_rgba(232,247,239,0.4)]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>

              <h2 className="mt-6 text-[clamp(23px,2.6vw,32px)] font-extrabold tracking-[-0.03em] text-[#152A2E]">
                Application received
              </h2>

              <p className="mx-auto mt-3 max-w-[42ch] text-[clamp(14.5px,1.15vw,16.5px)] leading-[1.66] text-[#5F7175]">
                Thanks for taking the time to apply. Your application has been submitted successfully. We will be in touch after reviewing it.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#17AEB9] px-[22px] py-3 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  See other openings
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-[#DCEAEC] bg-white px-[21px] py-3 text-[14px] font-bold text-[#152A2E] transition-[transform,border-color] hover:-translate-y-0.5 hover:border-[#17AEB9]"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
