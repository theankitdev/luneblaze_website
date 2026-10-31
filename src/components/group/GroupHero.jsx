// src/components/group/GroupHero.jsx
"use client";

import { useEffect, useRef } from "react";

export default function GroupHero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  const bars = [
    { m: "APR", h: "38%", c: "#B7E2E5" },
    { m: "MAY", h: "47%", c: "#B7E2E5" },
    { m: "JUN", h: "55%", c: "#B7E2E5" },
    { m: "JUL", h: "63%", c: "#B7E2E5" },
    { m: "AUG", h: "70%", c: "#B7E2E5" },
    { m: "SEP", h: "78%", c: "#17AEB9" },
  ];

  return (
    <section className="relative overflow-hidden bg-white border-b border-[#D6E3E5]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none lf-herobg" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[.28]"
          style={{
            background: "#EAF6F7 url('/assets/group-schools.png') center/cover no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0,#fff_38%,rgba(255,255,255,.72)_62%,rgba(255,255,255,.35))]" />
        <div
          className="absolute inset-0 opacity-[.26]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          className="absolute top-[-30%] right-[-10%] w-[min(900px,96vw)] h-[min(900px,96vw)]"
          style={{ animation: "lbSpin 150s linear infinite" }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(23,174,185,.13)]" />
          <div className="absolute inset-[36%] rounded-full border border-[rgba(91,91,214,.1)]" />
        </div>
      </div>

      {/* Main grid */}
      <div
        className="lf-herowrap relative max-w-[1280px] mx-auto px-[clamp(16px,3vw,32px)] py-[clamp(52px,6vw,104px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-x-[clamp(36px,5vw,72px)] gap-y-6 items-center"
      >
        {/* 1) TEXT */}
        <div data-rv="">
          <span className="inline-flex items-center gap-2 px-[14px] py-[6px] bg-[rgba(223,241,243,.9)] border border-[#BEE2E6] rounded-full text-[10.5px] leading-[1.4] font-extrabold tracking-[.16em] uppercase text-[#0E7A83] whitespace-nowrap max-w-full">
            <span
              className="flex-none w-1.5 h-1.5 rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            For groups of institutions
          </span>
          <h1 className="mt-5 font-extrabold text-[clamp(36px,5vw,64px)] leading-[1.05] tracking-[-.035em] text-[#152A2E] text-balance">
            One vision. One standard.{" "}
            <span className="text-[#17AEB9]">Every school.</span>
          </h1>
          <p className="mt-[22px] max-w-[580px] text-[clamp(16px,1.35vw,18px)] leading-[1.7] text-[#4C6165] text-pretty">
            Transform multi-school excellence through AI-powered quality management.
            Centralize quality, standardize operations and accelerate SQAAF readiness.
          </p>
          <div className="flex flex-wrap gap-3 mt-[30px]">
            <a
              href="/book-a-demo.html?interest=School%20Group"
              className="inline-flex items-center gap-[10px] whitespace-nowrap px-[26px] py-4 rounded-[10px] font-bold text-base bg-[#17AEB9] text-white border border-[#17AEB9] shadow-[0_12px_28px_-12px_rgba(23,174,185,.85)] hover:-translate-y-0.5 transition-transform"
            >
              Book a Group Demo ↗
            </a>
            <a
              href="#group-ecosystem"
              className="inline-flex items-center gap-[10px] whitespace-nowrap px-[26px] py-4 rounded-[10px] font-bold text-base bg-white text-[#152A2E] border border-[#C9D9DC] hover:-translate-y-0.5 transition-transform"
            >
              Explore group capabilities ↓
            </a>
          </div>
        </div>

        {/* 2) VIDEO — self-center forces vertical centering in the 2-row span */}
        <div
          className="lf-herovid self-center"
          data-rv=""
          style={{
            position: "relative",
            background: "#fff",
            border: "1px solid #C9D9DC",
            boxShadow: "0 40px 80px -46px rgba(15,60,66,.55)",
            padding: 10,
          }}
        >
          <div className="flex items-center gap-2 px-1.5 pb-2.5">
            <span className="w-[9px] h-[9px] rounded-full bg-[#F0676B]" />
            <span className="w-[9px] h-[9px] rounded-full bg-[#F5CF68]" />
            <span className="w-[9px] h-[9px] rounded-full bg-[#7FD4A8]" />
            <span className="ml-2 text-xs font-bold text-[#4C6165]">
              Luneblaze · Platform walkthrough
            </span>
          </div>
          <div className="relative aspect-video bg-[#0F2427] overflow-hidden">
            <video
              ref={videoRef}
              src="/assets/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3) DASHBOARD */}
        <div
          data-rv=""
          className="mt-2"
          style={{
            position: "relative",
            background: "#fff",
            border: "1px solid #C9D9DC",
            borderRadius: 6,
            boxShadow: "0 40px 80px -48px rgba(15,60,66,.55)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-[30%] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg,transparent,rgba(23,174,185,.07),transparent)",
              animation: "lbScan 6s linear infinite",
            }}
          />
          <div className="flex justify-between items-center gap-2.5 px-4 py-[13px] border-b border-[#D6E3E5] bg-[#F7FAFA] text-[13px]">
            <b>
              ◈ Luneblaze{" "}
              <span className="font-medium text-[#6A7C80]">/ Quality workspace</span>
            </b>
            <span className="text-[11px] font-bold text-[#0E8B95] border border-[#B7E2E5] bg-[#EDF7F8] px-2 py-[3px] rounded-full">
              Illustrative preview
            </span>
          </div>
          <div className="p-4">
            <div className="font-extrabold text-[15px]">Quality at a glance</div>
            <div className="mt-[3px] text-xs text-[#6A7C80]">
              Your school's continuous improvement journey
            </div>
            <div className="mt-3.5 grid grid-cols-2 border border-[#D6E3E5]">
              <div className="p-3 border-r border-[#D6E3E5]">
                <div className="text-[11px] font-bold text-[#6A7C80]">Readiness Score™</div>
                <div className="mt-1 font-extrabold text-[28px] leading-none">
                  78
                  <span className="text-[13px] text-[#9AAAAD]"> / 100</span>
                </div>
                <div className="mt-1 text-[11px] text-[#6A7C80]">
                  Documentation · Staff · Audits
                </div>
              </div>
              <div className="p-3">
                <div className="text-[11px] font-bold text-[#6A7C80]">Improvement actions</div>
                <div className="mt-1 font-extrabold text-[28px] leading-none">
                  18
                  <span className="text-[13px] text-[#9AAAAD]"> / 24</span>
                </div>
                <div className="mt-1 text-[11px] text-[#6A7C80]">Completed this cycle</div>
              </div>
            </div>
            <div className="mt-4 text-[11px] font-extrabold tracking-[.06em] text-[#6A7C80]">
              READINESS OVER TIME
            </div>
            <div className="mt-2.5 h-[90px] flex items-end gap-2 border-b border-[#D6E3E5]">
              {bars.map((b, i) => (
                <i key={i} className="flex-1" style={{ height: b.h, background: b.c }} />
              ))}
            </div>
            <div className="flex gap-2 mt-1.5 text-[10px] font-bold text-[#9AAAAD]">
              {bars.map((b, i) => (
                <span key={i} className="flex-1 text-center">
                  {b.m}
                </span>
              ))}
            </div>
            <div className="mt-3.5 flex gap-2.5 items-start border-l-[3px] border-[#17AEB9] bg-[#F4FAFA] px-3 py-2.5 text-[12.5px] text-[#4C6165]">
              <b className="text-[#152A2E]">✓ Small actions. Lasting improvement.</b>{" "}
              Every task connected to a bigger quality goal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}