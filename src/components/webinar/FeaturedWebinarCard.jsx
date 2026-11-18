
"use client";

import Link from "next/link";

export default function FeaturedWebinarCard({ item }) {
  if (!item) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${item.href}`
      : `https://luneblaze.com${item.href}`;

  const shareText = `${item.title} — ${shareUrl}`;

  const format =
    item.webinarLink && item.youtubeLink
      ? "Live + recording"
      : item.webinarLink
      ? "Live session"
      : item.youtubeLink
      ? "Recording"
      : "Webinar";

  return (
    <div className="mb-[clamp(20px,2.4vw,30px)] grid items-center gap-[clamp(18px,2.2vw,32px)] rounded-[10px] border border-[#DCEAEC] bg-white p-[clamp(16px,1.8vw,22px)] shadow-[0_2px_4px_rgba(23,35,38,0.03),0_34px_68px_-44px_rgba(15,60,66,0.45)] md:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
      <div className="relative min-h-[clamp(220px,26vw,300px)] overflow-hidden rounded-[8px] bg-[#EDF4F5]">
        <img
          src={item.img || "/assets/blog-4.png"}
          alt={item.title}
          className="absolute inset-0 block h-full w-full bg-[#EDF7F8] object-contain"
        />

        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 inline-flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,174,185,0.96)] text-white shadow-[0_18px_36px_-14px_rgba(0,0,0,0.55)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5Z" />
          </svg>
        </span>

        <span className="absolute left-[13px] top-[13px] inline-flex items-center gap-1.5 rounded-[4px] bg-[rgba(196,55,60,0.96)] px-[12px] py-1.5 text-[9.5px] font-extrabold tracking-[0.1em] text-white">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
          {item.status || "UPCOMING"}
        </span>
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#E4F5F6] px-3 py-1 text-[9.5px] font-extrabold tracking-[0.12em] text-[#0E7A83]">
          FEATURED
        </span>

        <h2 className="mt-3.5 text-[clamp(20px,2.2vw,29px)] font-extrabold leading-[1.16] tracking-[-0.028em] text-[#152A2E]">
          {item.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.64] text-[#5F7175]">
          {item.desc}
        </p>

        {item.speaker && (
          <div className="mt-3 flex items-center gap-3">
            {item.speakerImage && (
              <img
                src={item.speakerImage}
                alt={item.speaker}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}

            <div>
              <p className="text-[13px] font-bold text-[#152A2E]">
                {item.speaker}
              </p>
              {item.designation && (
                <p className="text-[11px] text-[#66787C]">
                  {item.designation}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-[18px] flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#3E5257]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0E8B95"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="5" width="16" height="15" rx="2.5" />
              <path d="M8 3.5v3M16 3.5v3M4 10h16" />
            </svg>
            {item.meta}
          </span>

          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#3E5257]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0E8B95"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </svg>
            {item.length || "Session"}
          </span>

          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#3E5257]">
            {format}
          </span>
        </div>

        <div className="mt-[22px] flex flex-wrap gap-2.5">
          <Link
            href={item.href}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#17AEB9] px-[22px] py-[13px] text-[14px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5"
          >
            {item.cta || "Register interest"}
            <svg
              width="15"
              height="15"
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
          </Link>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[4px] border border-[#C7E7D9] bg-white px-[18px] py-3 text-[13.5px] font-bold text-[#25936B] transition-colors hover:bg-[#25936B] hover:text-white"
          >
            Share
          </a>
        </div>
      </div>
    </div>
  );
}
