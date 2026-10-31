"use client";

import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "Luneblaze’s guidance during our SQAAF implementation was invaluable. Their structured documentation support, responsive team, and user-friendly portal made the entire process smooth and efficient.",
    name: "Mohammad Gaffar",
    role: "Principal · Al Ain Juniors School, UAE",
    img: "/assets/testimonial-1.png",
  },
  {
    quote: "Our SQAAF implementation gained clarity and momentum after partnering with Luneblaze. The structured portal, intuitive dashboard, and timely support helped our team stay aligned with CBSE timelines and manage documentation efficiently.",
    name: "Kusum K P",
    role: "Principal · SMS Academy of Central Education, Karnataka",
    img: "/assets/testimonial-2.png",
  },
  {
    quote: "Luneblaze’s support during our SQAAF implementation was invaluable. Their structured documentation system and intuitive platform made compliance manageable and efficient for our team.",
    name: "Fr. Roy D’Sa",
    role: "Principal · Fr. Agnel Group of Schools",
    img: "/assets/testimonial-3.png",
  },
  {
    quote: "Luneblaze has been an integral part of our SQAAF journey. Their tech-based platform streamlined automation and documentation, providing well-structured, tailored solutions that made accreditation implementation seamless.",
    name: "Dr. Andrew Aohato",
    role: "Principal · Livingstone Foundation International School, Nagaland",
    img: "/assets/testimonial-4.png",
  },
  {
    quote: "Luneblaze has brought structure and clarity to our quality assurance journey. The user-friendly portal, streamlined documentation, progress tracking, and timely expert support have helped us manage SQAAF requirements more effectively.",
    name: "Pradumna Chaturvedi",
    role: "Managing Director · Gayatri Group of Schools",
    img: "/assets/testimonial-5.png",
  },
  {
    quote: "Luneblaze’s technology-driven systems have streamlined our accreditation and assessment processes, significantly enhancing quality and efficiency in our school.",
    name: "Vandana Bhatia",
    role: "Principal · Holy Child Group of Schools",
    img: "/assets/testimonial-6.png",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  const startAutoplay = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 7000);
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timer.current);
  }, []);

  const prev = () => {
    clearInterval(timer.current);
    setActive((i) => (i + testimonials.length - 1) % testimonials.length);
  };
  const next = () => {
    clearInterval(timer.current);
    setActive((i) => (i + 1) % testimonials.length);
  };
  const pick = (i) => {
    clearInterval(timer.current);
    setActive(i);
  };

  const current = testimonials[active];
  const count = `${String(active + 1).padStart(2, "0")} / ${String(testimonials.length).padStart(2, "0")}`;

  return (
    <section className="relative overflow-hidden border-y border-[#D6E3E5] bg-white px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]">
      {/* decorative bg */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.36]"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-24%",
            left: "2%",
            width: "min(440px,46vw)",
            height: "min(440px,46vw)",
            animation: "lbSpinRev 108s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(23,174,185,.16)" }} />
          <div className="absolute rounded-full" style={{ inset: "26%", border: "1px dashed rgba(23,174,185,.14)" }} />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        {/* heading */}
        <div className="text-center">
          <span
            className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]"
            style={{ background: "rgba(223,241,243,.9)" }}
          >
            <span
              className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            Voices from our institutions
          </span>
          <h2 className="mt-[14px] text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            Trusted through <span className="text-[#17AEB9]">partnership.</span>
          </h2>
        </div>

        {/* grid */}
        <div
          className="mt-[clamp(22px,3vw,34px)] grid items-stretch gap-[clamp(16px,2vw,24px)]"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))" }}
        >
          {/* main quote card */}
          <blockquote
            className="relative flex min-h-full flex-col justify-between gap-7 overflow-hidden p-[clamp(30px,4vw,56px)] text-white"
            style={{ margin: 0, background: "linear-gradient(155deg,#17AEB9,#0E8B95)" }}
          >
            {/* orbit decoration */}
            <div
              aria-hidden="true"
              className="absolute"
              style={{
                right: "-60px",
                top: "-60px",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.25)",
                animation: "lbSpin 90s linear infinite",
              }}
            >
              <div className="absolute rounded-full" style={{ inset: "22%", border: "1px dashed rgba(255,255,255,.22)" }} />
            </div>

            {/* quote mark + count */}
            <div className="relative flex items-center justify-between">
              <span
                className="block text-[96px] leading-[.6] text-white/55"
                style={{ fontFamily: "Georgia,serif", height: "44px" }}
              >
                “
              </span>
              <span className="text-[13px] font-extrabold tracking-[.08em] text-white">{count}</span>
            </div>

            {/* quote text */}
            <p
              className="relative m-0 text-pretty font-semibold text-white"
              style={{
                fontSize: "clamp(19px,2vw,25px)",
                lineHeight: 1.55,
                minHeight: "7.5em",
              }}
            >
              {current.quote}
            </p>

            {/* cite */}
            <cite
              className="relative flex items-center gap-[14px] border-t border-white/30 pt-5 not-italic"
            >
              <span
                role="img"
                aria-label={current.name}
                className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-white bg-white bg-cover bg-center"
                style={{ backgroundImage: `url('${current.img}')` }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-extrabold text-white">{current.name}</span>
                <span className="mt-[3px] block text-[14px] text-white">{current.role}</span>
              </span>
              <span className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-transparent text-[16px] text-white transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="grid h-10 w-10 place-items-center rounded-full border-0 bg-white text-[16px] text-[#0E8B95] transition-colors hover:bg-[#EDF7F8]"
                >
                  →
                </button>
              </span>
            </cite>
          </blockquote>

          {/* thumbnail grid */}
          <div
            className="grid content-stretch gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))" }}
          >
            {testimonials.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.name}
                  onClick={() => pick(i)}
                  className="flex flex-col gap-[10px] p-4 text-left transition-colors"
                  style={{
                    background: selected ? "#EDF7F8" : "#fff",
                    border: `1px solid ${selected ? "#17AEB9" : "#C9D9DC"}`,
                    boxShadow: selected ? "inset 3px 0 0 #17AEB9" : "none",
                    color: "#152A2E",
                    cursor: "pointer",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-10 w-10 shrink-0 rounded-full border border-[#B7E2E5] bg-[#EDF7F8] bg-cover bg-center"
                      style={{ backgroundImage: `url('${t.img}')` }}
                    />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-extrabold">{t.name}</span>
                      <span className="mt-[2px] block text-[12.5px] leading-[1.4] text-[#6A7C80]">
                        {t.role}
                      </span>
                    </span>
                  </span>
                  <span
                    className="text-[13.5px] leading-[1.6] text-[#4C6165]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {t.quote}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}