// src/app/advisor-apply/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const EXPERIENCE_OPTIONS = [
  { value: "accreditation", label: "Accreditation & quality" },
  { value: "training", label: "Training & facilitation" },
  { value: "leadership", label: "School leadership" },
  { value: "cbse", label: "CBSE & SQAAF" },
  { value: "higher-ed", label: "NAAC, NBA & NIRF" },
  { value: "edtech", label: "EdTech & AI" },
];

const WHAT_ADVISORS_DO = [
  "Guide institutions through SQAAF, NABET, NAAC, NBA and NIRF work",
  "Run workshops and capacity-building sessions for staff",
  "Lead internal reviews and mock audits",
  "Mentor school leaders on governance and planning",
];

const WHAT_HAPPENS_NEXT = [
  ["01", "We review your profile", "Our quality team reads every application."],
  ["02", "An introductory call", "We talk through your experience and availability."],
  ["03", "Onboarding", "A walkthrough of the platform and how engagements run."],
];

const YEARS_OPTIONS = ["5–10 years", "10–15 years", "15–20 years", "20+ years"];

export default function AdvisorApplyPage() {
  const [applySent, setApplySent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top of form section when switching to the thank-you state
  useEffect(() => {
    if (!applySent) return;
    const el = document.getElementById("apply-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [applySent]);

  async function submitApply(e) {
    e.preventDefault();
    setSubmitting(true);

    // TODO: replace with your real endpoint
    // const fd = new FormData(e.currentTarget);
    // const body = {
    //   name: fd.get("name"),
    //   email: fd.get("email"),
    //   phone: fd.get("phone"),
    //   city: fd.get("city"),
    //   role: fd.get("role"),
    //   years: fd.get("years"),
    //   experience: fd.getAll("exp"),
    //   linkedin: fd.get("linkedin"),
    //   about: fd.get("about"),
    // };
    // await fetch("/api/advisor-apply", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body),
    // });

    // Simulated response
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setApplySent(true);
  }

  const inputStyle = {
    height: 46,
    padding: "0 13px",
    border: "1px solid #B2D6DB",
    background: "#fff",
    fontFamily: "inherit",
    fontSize: 14,
    color: "#152A2E",
    borderRadius: 0,
    outline: "none",
    width: "100%",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    fontSize: 13,
    fontWeight: 700,
    color: "#152A2E",
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{
          padding:
            "clamp(60px,4vw,150px) clamp(20px,4vw,52px) clamp(36px,4vw,56px)",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
          />
          <div
            className="absolute inset-0 opacity-[0.26]"
            style={{
              backgroundImage:
                "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
              backgroundSize: "30px 30px",
              animation: "lbGridPan 44s linear infinite",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-[1000px] text-center">
          <Link
            href="/advisors"
            className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#0E8B95] no-underline"
          >
            ← All advisors
          </Link>
          <h1 className="mt-4 text-balance text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-.036em] text-[#152A2E]">
            Share your expertise.{" "}
            <span className="text-[#17AEB9]">Strengthen more institutions.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-[clamp(14.5px,1.15vw,17.5px)] leading-[1.66] text-[#4C6165]">
            We work with principals, trainers, auditors and accreditation
            specialists who want to help schools and colleges build quality that
            lasts. Tell us about your experience.
          </p>
        </div>
      </section>

      {/* ── Apply form ───────────────────────────────────── */}
      <section
        id="apply-form"
        className="relative overflow-hidden border border-[#DCEAEC] bg-[#FCFDFD]"
      >
        <div className="flex flex-wrap">
          {/* ── Aside ───────────────────────────────────── */}
          <aside
            className="flex min-w-0 flex-col gap-[26px] border-r border-[#DBEDEF] bg-[#EDF7F8]"
            style={{
              flex: "1 1 320px",
              padding:
                "clamp(34px,4vw,56px) clamp(22px,3.4vw,46px)",
            }}
          >
            <div>
              <span
                className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#0E7A83]"
              >
                What advisors do
              </span>
              <ul className="mt-3 flex list-none flex-col gap-2.5 p-0">
                {WHAT_ADVISORS_DO.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[14px] leading-[1.55] text-[#152A2E]"
                  >
                    <span aria-hidden="true" className="font-extrabold text-[#17AEB9]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#CFE6E9] pt-[22px]">
              <span className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#0E7A83]">
                What happens next
              </span>
              <ol className="mt-3 flex list-none flex-col gap-3.5 p-0">
                {WHAT_HAPPENS_NEXT.map(([n, title, desc]) => (
                  <li
                    key={n}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="inline-flex flex-none items-center justify-center rounded-[3px] bg-[#17AEB9] text-[12px] font-extrabold text-white"
                      style={{ width: 28, height: 28 }}
                    >
                      {n}
                    </span>
                    <span className="text-[14px] leading-[1.55] text-[#4C6165]">
                      <b className="text-[#152A2E]">{title}</b>
                      <br />
                      {desc}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center gap-3 border-t border-[#CFE6E9] pt-[22px]">
              <div className="flex">
                {[2, 9, 13].map((n, i) => (
                  <img
                    key={n}
                    src={`/assets/advisor-${n}.png`}
                    alt=""
                    style={{ marginLeft: i === 0 ? 0 : -10 }}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-[13px] font-bold leading-[1.5] text-[#4C6165]">
                Join 50+ advisors already in the network
              </span>
            </div>
          </aside>

          {/* ── Form panel ──────────────────────────────── */}
          <div
            className="min-w-0"
            style={{
              flex: "2 1 520px",
              padding:
                "clamp(34px,4vw,56px) clamp(22px,3.4vw,46px)",
            }}
          >
            {!applySent && (
              <form
                onSubmit={submitApply}
                className="flex flex-col gap-[18px]"
              >
                <h2 className="text-[clamp(22px,2.4vw,30px)] font-extrabold tracking-[-.03em] text-[#152A2E]">
                  Advisor application
                </h2>

                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(220px,1fr))",
                  }}
                >
                  <label style={labelStyle}>
                    Full name
                    <input
                      required
                      name="name"
                      type="text"
                      autoComplete="name"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Email
                    <input
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Phone
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    City
                    <input
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Current role
                    <input
                      required
                      name="role"
                      type="text"
                      placeholder="e.g. Principal, CBSE Resource Person"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Years of experience
                    <select
                      name="years"
                      style={{ ...inputStyle, padding: "0 10px" }}
                    >
                      {YEARS_OPTIONS.map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="p-0 text-[13px] font-bold text-[#152A2E]">
                    Areas of expertise
                  </legend>
                  <div
                    className="mt-2.5 grid gap-2"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(200px,1fr))",
                    }}
                  >
                    {EXPERIENCE_OPTIONS.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2.5 border border-[#DCEAEC] bg-white text-[14px] text-[#152A2E]"
                        style={{
                          minHeight: 44,
                          padding: "0 12px",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="exp"
                          value={value}
                          style={{
                            width: 18,
                            height: 18,
                            accentColor: "#17AEB9",
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label style={labelStyle}>
                  LinkedIn profile
                  <input
                    name="linkedin"
                    type="url"
                    placeholder="https://www.linkedin.com/in/…"
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Tell us about your experience
                  <textarea
                    name="about"
                    rows={5}
                    style={{
                      padding: "12px 13px",
                      border: "1px solid #B2D6DB",
                      background: "#fff",
                      fontFamily: "inherit",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "#152A2E",
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3.5">
                  <span className="text-[12.5px] leading-[1.5] text-[#5F7175]">
                    By applying you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-bold text-[#0E8B95]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#17AEB9] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      minHeight: 48,
                      padding: "0 26px",
                      fontSize: 15,
                      border: 0,
                      cursor: "pointer",
                      boxShadow:
                        "0 16px 32px -14px rgba(23,174,185,.85)",
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit application"}
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </form>
            )}

            {applySent && (
              <div
                className="flex flex-col items-start gap-3.5"
                style={{ padding: "clamp(20px,3vw,40px) 0" }}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center rounded-full bg-[#E4F5F6] text-[26px] font-extrabold text-[#0E8B95]"
                  style={{ width: 56, height: 56 }}
                >
                  ✓
                </span>
                <h2 className="text-[clamp(22px,2.4vw,30px)] font-extrabold tracking-[-.03em] text-[#152A2E]">
                  Thank you for applying.
                </h2>
                <p className="max-w-[52ch] text-[15px] leading-[1.66] text-[#5F7175]">
                  Our quality team will review your profile and get in touch
                  about an introductory call.
                </p>
                <div className="mt-1.5 flex flex-wrap gap-3">
                  <Link
                    href="/advisors"
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#17AEB9] px-5 py-3.5 text-[14px] font-bold text-white no-underline"
                  >
                    Meet our advisors <span aria-hidden="true">↗</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setApplySent(false)}
                    className="cursor-pointer rounded-[10px] border border-[#B2D6DB] bg-white text-[14px] font-bold text-[#152A2E]"
                    style={{ minHeight: 46, padding: "0 18px" }}
                  >
                    Submit another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}