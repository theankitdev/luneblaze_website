// src/components/webinar/FeaturedWebinarCard.jsx
"use client";

import Link from "next/link";

export default function FeaturedWebinarCard({
  image = "/assets/blog-4.png",
  title = "SQAAF Self-Assessment: A Practical Walkthrough",
  description = "A working session on scoring all 84 standards — weightage, evidence expectations and the mistakes that cost schools marks. Bring your own domain and we will walk it through.",
  href = "/webinars/human-resources-sqaaf-domain-3",
  meta = "Date to be announced",
  length = "60 minutes",
  format = "Live + recording",
}) {
  return (
    <div className="mb-[clamp(20px,2.4vw,30px)] grid items-center gap-[clamp(18px,2.2vw,32px)] rounded-[10px] border border-[#DCEAEC] bg-white p-[clamp(16px,1.8vw,22px)] shadow-[0_2px_4px_rgba(23,35,38,0.03),0_34px_68px_-44px_rgba(15,60,66,0.45)] md:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
      <div className="relative min-h-[clamp(220px,26vw,300px)] overflow-hidden rounded-[8px] bg-[#EDF4F5]">
        <img src={image} alt="" className="absolute inset-0 block h-full w-full bg-[#EDF7F8] object-contain" />

        {/* Play button */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 inline-flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,174,185,0.96)] text-white shadow-[0_18px_36px_-14px_rgba(0,0,0,0.55)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5Z" />
          </svg>
        </span>

        {/* UPCOMING pill */}
        <span className="absolute left-[13px] top-[13px] inline-flex items-center gap-1.5 rounded-[4px] bg-[rgba(196,55,60,0.96)] px-[12px] py-1.5 text-[9.5px] font-extrabold tracking-[0.1em] text-white">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
          UPCOMING
        </span>
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#E4F5F6] px-3 py-1 text-[9.5px] font-extrabold tracking-[0.12em] text-[#0E7A83]">
          FEATURED
        </span>
        <h2 className="mt-3.5 text-[clamp(20px,2.2vw,29px)] font-extrabold leading-[1.16] tracking-[-0.028em] text-[#152A2E]">
          {title}
        </h2>
        <p className="mt-3 text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.64] text-[#5F7175]">
          {description}
        </p>

        <div className="mt-[18px] flex flex-wrap gap-4">
          {[
            {
              label: meta,
              icon: (
                <>
                  <rect x="4" y="5" width="16" height="15" rx="2.5" />
                  <path d="M8 3.5v3M16 3.5v3M4 10h16" />
                </>
              ),
            },
            {
              label: length,
              icon: (
                <>
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" />
                </>
              ),
            },
            {
              label: format,
              icon: (
                <>
                  <circle cx="9" cy="8.5" r="3.2" />
                  <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
                  <path d="M16 6.8a3 3 0 0 1 0 5.9" />
                </>
              ),
            },
          ].map((m) => (
            <span key={m.label} className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#3E5257]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0E8B95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {m.icon}
              </svg>
              {m.label}
            </span>
          ))}
        </div>

        <div className="mt-[22px] flex flex-wrap gap-2.5">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#17AEB9] px-[22px] py-[13px] text-[14px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Register interest
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h14" />
              <path d="M12 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${title} — https://luneblaze.com${href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[4px] border border-[#C7E7D9] bg-white px-[18px] py-3 text-[13.5px] font-bold text-[#25936B] transition-colors hover:bg-[#25936B] hover:text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
            </svg>
            Share
          </a>
        </div>
      </div>
    </div>
  );
}