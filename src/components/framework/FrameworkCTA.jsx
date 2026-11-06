// src/components/framework/FrameworkCTA.jsx
"use client";

export default function FrameworkCTA({
  eyebrow,
  heading,
  description,
  ctaLabel,
  ctaHref,
  email,
  background = "#F4F8F8",
}) {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20" style={{ background }}>
      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden border border-[#17AEB9] bg-[#17AEB9] px-6 py-14 text-center text-white sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,.4) 1.1px,transparent 1.1px)", backgroundSize: "30px 30px", animation: "lbGridPan 46s linear infinite" }} />
          </div>
          <div className="relative">
            <div className="text-xs font-extrabold uppercase tracking-[.16em] text-white">{eyebrow}</div>
            <h2 className="mt-3 text-[clamp(28px,3.8vw,48px)] font-extrabold leading-tight tracking-tight text-white">{heading}</h2>
            <p className="mx-auto mt-4 max-w-[580px] text-[17px] leading-[1.7] text-white">{description}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={ctaHref} className="inline-flex items-center gap-2.5 rounded-[10px] bg-white px-7 py-4 text-base font-extrabold text-[#152A2E] transition-colors hover:bg-[#152A2E] hover:text-white">
                {ctaLabel}
              </a>
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center rounded-[10px] border border-white/70 px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/15">
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}