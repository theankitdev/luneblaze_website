// src/components/webinar/WebinarCard.jsx
"use client";

import Link from "next/link";

const TAG_COLORS = {
  sqaaf: "#0E8B95",
  nabet: "#0E9F6E",
  naac: "#5B5BD6",
  nba: "#3B6FD4",
  nirf: "#B98200",
  quality: "#0E8B95",
};

export default function WebinarCard({ item }) {
  const share = (kind, e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== "undefined" ? `${window.location.origin}${item.href}` : `https://luneblaze.com${item.href}`;
    const title = item.title;
    if (kind === "wa") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank", "noopener");
    } else if (kind === "li") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
    } else if (kind === "copy" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Link
      href={item.href}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-[#E4EEEF] bg-white transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#17AEB9] hover:shadow-[0_28px_54px_-32px_rgba(15,60,66,0.5)]"
    >
      {/* Thumbnail */}
      <span className="relative block aspect-square w-full shrink-0 overflow-hidden bg-[#EDF4F5]">
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          className="block h-full w-full object-contain"
        />

        {/* Play button */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 inline-flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,174,185,0.95)] text-white shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5Z" />
          </svg>
        </span>

        {/* Tag chip top-left */}
        <span
          className="absolute left-[11px] top-[11px] inline-flex items-center rounded-[4px] px-[10px] py-[5px] text-[9px] font-extrabold tracking-[0.1em]"
          style={{
            background: "rgba(255,255,255,0.94)",
            color: TAG_COLORS[item.cat] || "#0E8B95",
          }}
        >
          {item.tag}
        </span>

        {/* Status pill top-right */}
        {item.status && (
          <span className="absolute right-[11px] top-[11px] inline-flex items-center rounded-[4px] bg-[rgba(21,42,46,0.86)] px-[10px] py-[5px] text-[9px] font-extrabold tracking-[0.06em] text-white">
            {item.status}
          </span>
        )}
      </span>

      {/* Body */}
      <span className="flex flex-1 flex-col gap-2 px-[clamp(16px,1.8vw,22px)] py-[clamp(16px,1.8vw,22px)]">
        {/* Meta */}
        <span className="text-[10.5px] font-bold text-[#66787C]">
          {item.meta}
          {item.length && (
            <>
              <span
                aria-hidden="true"
                className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-[#B6CDD0] align-middle"
              />
              {item.length}
            </>
          )}
        </span>

        <span className="block text-[15.5px] font-extrabold leading-[1.32] tracking-[-0.018em] text-[#152A2E]">
          {item.title}
        </span>

        <span className="block flex-1 text-[12.5px] leading-[1.58] text-[#5F7175]">
          {item.desc}
        </span>

        {/* CTA */}
        <span className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-bold text-[#0E8B95]">
          {item.cta || "Watch session"}
          <svg
            width="13"
            height="13"
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
        </span>

        {/* Share row */}
        <span className="mt-3 flex items-center gap-1.5 border-t border-[#EDF4F5] pt-3">
          <span className="flex-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#66787C]">
            Share
          </span>
          <button
            type="button"
            onClick={(e) => share("wa", e)}
            aria-label="Share on WhatsApp"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#E4EEEF] bg-[#F2F9FA] text-[#25936B] transition-colors hover:bg-[#25936B] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => share("li", e)}
            aria-label="Share on LinkedIn"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#E4EEEF] bg-[#F2F9FA] text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => share("copy", e)}
            aria-label="Copy link"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#E4EEEF] bg-[#F2F9FA] text-[#3E5257] transition-colors hover:border-[#17AEB9] hover:bg-[#17AEB9] hover:text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1 1" />
              <path d="M14 10a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
          </button>
        </span>
      </span>
    </Link>
  );
}