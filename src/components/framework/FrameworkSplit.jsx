// src/components/framework/FrameworkSplit.jsx
"use client";

export default function FrameworkSplit({
  eyebrow,
  heading,
  headingHighlight,
  description,
  note,
  image,
  ctaLabel,
  ctaHref,
  items = [],
  background = "#F4F8F8",
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20" style={{ background }}>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid overflow-hidden border border-[#C9D9DC] bg-white lg:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col items-start border-b border-[#D6E3E5] bg-[#EDF7F8] p-8 lg:border-b-0 lg:border-r lg:p-14">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-white px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" />
              {eyebrow}
            </span>
            <h2 className="mt-3.5 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.12] tracking-tight text-[#152A2E]">
              {heading} <span className="text-[#0E8B95]">{headingHighlight}</span>
            </h2>
            {image && (
              <div
                role="img"
                aria-label={heading}
                className="mt-5 w-full border border-[#D6E3E5] bg-white bg-contain bg-center bg-no-repeat"
                style={{ aspectRatio: "16/10", backgroundImage: `url('${image}')` }}
              />
            )}
            {description && (
              <p className="mt-3.5 text-[16px] leading-[1.7] text-[#4C6165]">{description}</p>
            )}
            {note && (
              <p className="mt-3.5 border-l-[3px] border-[#17AEB9] pl-3 text-[13.5px] leading-[1.6] text-[#6A7C80]">
                {note}
              </p>
            )}
            {ctaLabel && (
              <a
                href={ctaHref}
                className="mt-6 inline-flex whitespace-nowrap items-center gap-2 rounded-[10px] bg-[#17AEB9] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(23,174,185,.85)]"
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* Right — items list */}
          <div className="flex flex-col justify-center border-b border-[#D6E3E5] p-8 lg:p-10">
            <div className="border-t border-[#E6EEEF]">
              {items.map((it, i) => (
                <div key={it.title} className="grid grid-cols-[44px_1fr] gap-3.5 border-b border-[#E6EEEF] py-4">
                  <span className="grid h-[38px] w-[38px] place-items-center rounded-[3px] border border-[#B7E2E5] bg-[#EDF7F8] text-[13px] font-extrabold text-[#0E8B95]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[17px] font-extrabold text-[#152A2E]">{it.title}</span>
                    {it.desc && (
                      <span className="mt-1 block text-[15px] leading-[1.6] text-[#4C6165]">{it.desc}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}