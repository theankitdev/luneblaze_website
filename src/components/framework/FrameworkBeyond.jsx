// src/components/framework/FrameworkBeyond.jsx
"use client";

export default function FrameworkBeyond({
  eyebrow = "Beyond documentation",
  heading = "Our NABET",
  headingHighlight = "Accreditation Support",
  description,
  items = [],
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
              style={{ background: accentColor }}
            />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
              {description}
            </p>
          )}
        </div>

        {/* 10-item grid — titles only */}
        <div
          className="mt-10 grid border border-[#C9D9DC] bg-white sm:mt-12 md:grid-cols-2 xl:grid-cols-5"
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className="flex flex-col border-b border-r border-[#D6E3E5] p-6 transition-colors hover:bg-[#F4FAFA] lg:p-7"
              style={{
                borderTop: i === 0 ? `3px solid ${accentColor}` : "3px solid transparent",
              }}
            >
              <span
                className="inline-flex w-fit rounded-sm px-2 py-1 text-xs font-extrabold tracking-[.08em] text-white"
                style={{ background: accentColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[clamp(15px,1.4vw,17px)] font-extrabold leading-snug tracking-tight text-[#152A2E]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}