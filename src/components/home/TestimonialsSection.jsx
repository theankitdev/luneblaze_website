"use client";

import { useState, useEffect, useRef } from "react";
import testimonialService from "@/services/testimonialService";

export default function TestimonialsSection() {
  // Keep the complete API result in memory. The UI shows six at a time,
  // but navigation moves through the full list (1, 2, ... 6, 7, 8 ...).
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);
  const testimonialsRef = useRef([]);
  const activeRef = useRef(0);

  const mapTestimonials = (rows, host) =>
    rows
      .map((item, index) => ({
        id: item.id ?? `${item.name || "testimonial"}-${index}`,
        quote: item.text_feedback || "",
        name: item.name || "Institution",
        role: [item.designation || item.role, item.school_name]
          .filter(Boolean)
          .join(" · "),
        img: testimonialService.getFeedImageUrl(item.image, host) || "",
        logo: testimonialService.getFeedImageUrl(item.logo, host),
      }))
      .filter((item) => item.quote || item.name);

  const setActiveIndex = (index) => {
    const safeIndex = Math.max(0, Math.min(index, testimonialsRef.current.length - 1));
    activeRef.current = safeIndex;
    setActive(safeIndex);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllTestimonials = async () => {
      setLoading(true);
      const allRows = [];
      let pageNumber = 1;
      const pageSize = 6;
      let imageHost = "";

      try {
        // API uses offset as a page number: 1, 2, 3, etc.
        // Fetch every page so moving past item 6 selects item 7, not item 1.
        while (true) {
          let response;
          try {
            response = await testimonialService.getFeed(pageNumber, pageSize);
          } catch (error) {
            // CakePHP returns 404 when there are no more records.
            if (error?.response?.status === 404 || error?.status === 404) break;
            throw error;
          }

          const rows = Array.isArray(response?.data) ? response.data : [];
          if (response?.host) imageHost = response.host;
          if (rows.length === 0) break;

          allRows.push(...rows);
          if (rows.length < pageSize) break;
          pageNumber += 1;
        }

        if (!isMounted) return;

        const mapped = mapTestimonials(allRows, imageHost);
        if (mapped.length > 0) {
          testimonialsRef.current = mapped;
          setTestimonials(mapped);
          setActiveIndex(0);
        } else {
          testimonialsRef.current = [];
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Do not show hard-coded data when the API fails.
        testimonialsRef.current = [];
        setTestimonials([]);
        setActive(0);
        activeRef.current = 0;
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllTestimonials();
    return () => {
      isMounted = false;
      clearInterval(timer.current);
    };
  }, []);

  const prev = () => {
    clearInterval(timer.current);
    if (activeRef.current > 0) setActiveIndex(activeRef.current - 1);
  };

  const next = () => {
    clearInterval(timer.current);
    if (activeRef.current < testimonialsRef.current.length - 1) {
      setActiveIndex(activeRef.current + 1);
    }
  };

  const pick = (index) => {
    clearInterval(timer.current);
    setActiveIndex(index);
  };

  useEffect(() => {
    clearInterval(timer.current);
    if (testimonials.length <= 1) return undefined;

    timer.current = setInterval(() => {
      if (activeRef.current < testimonialsRef.current.length - 1) {
        setActiveIndex(activeRef.current + 1);
      } else {
        clearInterval(timer.current);
      }
    }, 7000);

    return () => clearInterval(timer.current);
  }, [testimonials, active]);

  const current = testimonials[active] || null;
  const pageStart = Math.floor(active / 6) * 6;
  const visibleTestimonials = testimonials.slice(pageStart, pageStart + 6);
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
          {current ? (
            <>
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
                  disabled={loading || active === 0}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-transparent text-[16px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  disabled={loading || active >= testimonials.length - 1}
                  className="grid h-10 w-10 place-items-center rounded-full border-0 bg-white text-[16px] text-[#0E8B95] transition-colors hover:bg-[#EDF7F8] disabled:cursor-not-allowed disabled:opacity-50"
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
            {visibleTestimonials.map((t, i) => {
              const actualIndex = pageStart + i;
              const selected = actualIndex === active;
              return (
                <button
                  key={t.id || t.name}
                  onClick={() => pick(actualIndex)}
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
            </>
          ) : (
            <div className="col-span-full py-12 text-center text-[#6A7C80]">
              {loading ? "Loading testimonials..." : "No testimonials available."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
