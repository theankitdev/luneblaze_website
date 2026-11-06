// src/components/framework/FrameworkTestimonials.jsx
"use client";

import { useState } from "react";

export default function FrameworkTestimonials({
  eyebrow = "Voices from our institutions",
  heading = "Trusted through",
  headingHighlight = "partnership.",
  items = [],
  background = "#F4F8F8",
}) {
  const [i, setI] = useState(0);
  const cur = items[i] || {};
  const go = (d) => setI((v) => (v + d + items.length) % items.length);

  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20" style={{ background }}>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading} <span className="text-[#17AEB9]">{headingHighlight}</span>
          </h2>
        </div>

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <blockquote className="relative flex flex-col justify-between gap-7 overflow-hidden bg-gradient-to-br from-[#17AEB9] to-[#0E8B95] p-8 text-white lg:p-14">
            <div className="flex items-center justify-between">
              <span className="h-11 font-serif text-[96px] leading-[0.6] text-white/55">“</span>
              <span className="text-[13px] font-extrabold tracking-[.08em]">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <p className="text-[clamp(19px,2vw,25px)] font-semibold leading-[1.55] text-white">{cur.quote}</p>
            <cite className="flex items-center gap-4 border-t border-white/30 pt-5 not-italic">
              <span className="h-13 w-13 shrink-0 rounded-full border-2 border-white bg-white bg-cover" style={{ width: 52, height: 52, backgroundImage: `url('${cur.img}')` }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-extrabold text-white">{cur.name}</span>
                <span className="mt-1 block text-sm text-white">{cur.role}</span>
              </span>
              <span className="flex gap-2">
                <button onClick={() => go(-1)} aria-label="Previous testimonial" className="h-11 w-11 rounded-full border border-white/60 bg-transparent text-base text-white">←</button>
                <button onClick={() => go(1)} aria-label="Next testimonial" className="h-11 w-11 rounded-full border-0 bg-white text-base text-[#0E8B95]">→</button>
              </span>
            </cite>
          </blockquote>

          <div className="grid content-start gap-3">
            {items.map((t, idx) => (
              <button
                key={t.name}
                onClick={() => setI(idx)}
                className="flex flex-col gap-2.5 border p-4 text-left"
                style={{
                  background: idx === i ? "#EDF7F8" : "#fff",
                  borderColor: idx === i ? "#17AEB9" : "#C9D9DC",
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="h-10 w-10 shrink-0 rounded-full border border-[#B7E2E5] bg-[#EDF7F8] bg-cover" style={{ backgroundImage: `url('${t.img}')` }} />
                  <span className="min-w-0">
                    <span className="block text-[15px] font-extrabold text-[#152A2E]">{t.name}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-tight text-[#6A7C80]">{t.role}</span>
                  </span>
                </span>
                <span className="line-clamp-3 text-[13.5px] leading-[1.6] text-[#4C6165]">{t.quote}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}