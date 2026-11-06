// src/components/framework/InsidePlatform.jsx
"use client";

export default function InsidePlatform({
  eyebrow = "Inside the platform",
  heading = "What the Luneblaze",
  headingHighlight = "Platform Provides",
  description = "Everything the framework asks of you, in one workspace — and everything your team needs to keep it moving between cycles.",
  videoSrc = "assets/hero-video.mp4",
  videoLabel = "Luneblaze · Platform walkthrough",
  ctaText = "View Dashboard ↗",
  ctaHref = "https://www.luneblaze.com",
  background = "#FFFFFF",
  accentColor = "#17AEB9",
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20"
      style={{ background }}
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: accentColor,
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3.5 max-w-3xl text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
              {description}
            </p>
          )}
        </div>

        {/* Portal video preview card */}
        <div
          className="mt-12 border border-[#C9D9DC] bg-white"
          data-rv=""
        >
          <div className="flex items-center bg-[#F4F8F8] p-4 sm:p-5 lg:p-6">
            <div className="w-full border border-[#C9D9DC] bg-white shadow-[0_24px_50px_-32px_rgba(15,60,66,.5)]">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 border-b border-[#E6EEEF] px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#F0676B]" />
                <span className="h-2 w-2 rounded-full bg-[#F5CF68]" />
                <span className="h-2 w-2 rounded-full bg-[#7FD4A8]" />
                <span className="ml-2 text-xs font-bold text-[#4C6165]">
                  {videoLabel}
                </span>
              </div>
              {/* Video */}
              <video
                data-hv=""
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls
                className="block w-full aspect-video object-cover bg-[#0F2A30]"
              />
            </div>
          </div>

          {/* CTA bar */}
          <div className="flex justify-center border-t border-[#D6E3E5] px-5 py-4">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#17AEB9] px-5 py-3 text-[15px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(23,174,185,.85)] transition-colors hover:bg-[#0E8B95]"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}