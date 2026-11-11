// src/app/advisors/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ADVS = [
  { name: "Ms. Kalyani Dixit", role: "Former Founder · Principal and Director", cats: ["lead"] },
  { name: "Ms. Mini Johny", role: "Master Trainer – CBSE · District Coordinator for Training CoE Bengaluru", cats: ["train", "cbse"] },
  { name: "Dr. Kshma Swarnkar", role: "CBSE Resource Person · AI & Edtech Expert", cats: ["cbse", "tech"] },
  { name: "Ms. Archana Awade", role: "General Manager – Aditya Birla Education Academy", cats: ["lead", "train"] },
  { name: "Ms. Sumithra Singh", role: "Academic Consultant & Teacher Trainer", cats: ["train"] },
  { name: "Mr. Naresh Sharma", role: "CBSE Resource Person · UNESCO Health and Wellness Master Trainer", cats: ["cbse", "train"] },
  { name: "Ms. Manjit Malik", role: "Academic Auditor · Education & School Quality Consultant", cats: ["qa"] },
  { name: "Dr. Rakhee Chaudhary", role: "Accreditation & Quality Assurance Expert", cats: ["qa"] },
  { name: "Mr. Narender Kumar", role: "CBSE Master Trainer & Lead Facilitator", cats: ["cbse", "train"] },
  { name: "Dr. Deepti Chaturvedi", role: "CBSE Resource Person · Founder Principal", cats: ["cbse", "lead"] },
  { name: "Dr. Abhishek Sharma", role: "Advanced Lean Six Sigma Certified Trainer", cats: ["qa", "train"] },
  { name: "Dr. Manjari Tejpal", role: "CBSE Resource Person & SQAAF Trainer", cats: ["cbse", "qa", "train"] },
  { name: "Mr. Jeeson Sunny", role: "CBSE SQAAF – PAT Member", cats: ["qa", "cbse"] },
  { name: "Ms. Mohita Jain", role: "CBSE Resource Person · Career and Guidance Counsellor", cats: ["cbse"] },
  { name: "Dr. Jyoti Prakash Tripathy", role: "CBSE Resource Person, District Coordinator", cats: ["cbse"] },
  { name: "Dr. Bani Godara", role: "CBSE School Principal · CBSE Manual Reviewer", cats: ["lead", "cbse", "qa"] },
];

const CAT = {
  qa: ["Accreditation & Quality", "Supports self-assessment, documentation and evidence work, and leads internal reviews against framework standards."],
  train: ["Training & Facilitation", "Runs workshops and capacity-building sessions so teachers and staff can own the quality work."],
  cbse: ["CBSE Practice", "Brings first-hand CBSE experience to help schools align SQAAF and board requirements with daily practice."],
  lead: ["School Leadership", "Mentors principals and management on governance, planning and building a culture of quality."],
  tech: ["EdTech & AI", "Helps institutions adopt digital and AI tools that make quality processes easier to run."],
};

const FILTERS = [
  ["all", "All advisors"],
  ["qa", "Accreditation & Quality"],
  ["train", "Training & Facilitation"],
  ["cbse", "CBSE Practice"],
  ["lead", "School Leadership"],
];

const SCHOOL_CLIENTS = [
  { name: "Father Agnel Group of Schools", img: "/assets/client-father-agnel.png" },
  { name: "Shalom Group of Schools", img: "/assets/client-shalom.png" },
  { name: "Gayatri Group of Schools", img: "/assets/client-gayatri.png" },
  { name: "Holy Child Group of Schools", img: "/assets/client-holy-child.png" },
  { name: "GD Goenka School", img: "/assets/client-gd-goenka.png" },
  { name: "St. Michael's School", img: "/assets/client-st-michaels.png" },
  { name: "Chinmaya Vidyalaya", img: "/assets/client-chinmaya.png" },
  { name: "Evergreen Public School", img: "/assets/client-evergreen.png" },
  { name: "Livingstone Foundation International", img: "/assets/client-livingstone.png" },
  { name: "SMS Academy of Central Education", img: "/assets/client-sms-academy.png" },
  { name: "Indian Language School, Nigeria", img: "/assets/client-indian-language.png" },
  { name: "Al Ain Juniors School, UAE", img: "/assets/client-al-ain.png" },
];

const ALL = ADVS.map((x, i) => ({
  i,
  pos: i + 1,
  name: x.name,
  role: x.role,
  img: `/assets/advisor-${i + 1}.png`,
  cats: x.cats,
  tags: x.cats.map((c) => CAT[c][0]),
  how: x.cats.map((c) => CAT[c][1]).join(" "),
}));

export default function AdvisorsPage() {
  const [filter, setFilter] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);

  const shown = ALL.filter((a) => filter === "all" || a.cats.includes(filter));
  const cur = openIdx !== null ? ALL[openIdx] : null;

  const prev = () => setOpenIdx((s) => (s === null ? 0 : (s + 15) % 16));
  const next = () => setOpenIdx((s) => (s === null ? 0 : (s + 1) % 16));
  const close = () => setOpenIdx(null);

  // Lock body scroll + close on Escape while the modal is open
  useEffect(() => {
    if (openIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.26]"
            style={{
              backgroundImage: "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
              backgroundSize: "30px 30px",
              animation: "lbGridPan 44s linear infinite",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "-24%", left: "50%", transform: "translateX(-50%)",
              width: "min(880px,94vw)", height: "min(880px,94vw)",
              animation: "lbSpin 150s linear infinite",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(23,174,185,.13)]" />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-[1000px] flex-col items-center px-5 pb-14 pt-12 text-center sm:px-8 lg:pt-18">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[#DFF1F3] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" style={{ animation: "lbPulse 2.4s ease-in-out infinite" }} />
            Our advisors
          </span>
          <h1 className="mt-5 max-w-4xl text-balance text-[clamp(32px,4.4vw,58px)] font-extrabold leading-[1.05] tracking-[-.036em] text-[#152A2E]">
            Guided by Experience.{" "}
            <span className="text-[#17AEB9]">Strengthened by Expertise.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[62ch] text-[clamp(14.5px,1.15vw,17.5px)] leading-[1.66] text-[#4C6165]">
            A collective of 50+ education leaders, CBSE resource persons, master trainers and
            accreditation specialists who work alongside institutions on implementation,
            training and quality reviews.
          </p>
          <div className="mt-7 flex">
            {[1, 3, 8, 12, 16].map((n, i) => (
              <img
                key={n}
                src={`/assets/advisor-${n}.png`}
                alt=""
                style={{ marginLeft: i === 0 ? 0 : -14 }}
                className="h-[54px] w-[54px] rounded-full border-[3px] border-white object-cover shadow-[0_10px_22px_-12px_rgba(15,60,66,.6)]"
              />
            ))}
          </div>
          <div className="mt-6 grid w-full max-w-[640px] grid-cols-3 border border-[#B2D6DB] bg-white">
            <div className="border-r border-[#DCEAEC] p-4 text-left">
              <span className="block text-[clamp(26px,2.8vw,36px)] font-extrabold leading-none tracking-[-.04em] text-[#0E8B95]">50+</span>
              <span className="mt-1.5 block text-xs font-bold text-[#4C6165]">Advisors in the network</span>
            </div>
            <div className="border-r border-[#DCEAEC] p-4 text-left">
              <span className="block text-[clamp(26px,2.8vw,36px)] font-extrabold leading-none tracking-[-.04em] text-[#152A2E]">5</span>
              <span className="mt-1.5 block text-xs font-bold text-[#4C6165]">Frameworks supported</span>
            </div>
            <div className="p-4 text-left">
              <span className="block text-[clamp(26px,2.8vw,36px)] font-extrabold leading-none tracking-[-.04em] text-[#152A2E]">10+</span>
              <span className="mt-1.5 block text-xs font-bold text-[#4C6165]">Years of expertise</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Directory ─────────────────────────────────────── */}
      <section
        id="directory"
        className="relative mx-2.5 my-2.5 overflow-hidden border border-[#E4EEEF] bg-[#FCFDFD] px-5 py-14 sm:px-8 lg:mx-5 lg:my-5 lg:px-12 lg:py-16"
        style={{ borderRadius: 10 }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-[640px]">
              <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.09] tracking-[-.032em] text-[#152A2E]">
                Meet the advisors
              </h2>
              <p className="mt-3.5 text-[clamp(14px,1.08vw,16px)] leading-[1.66] text-[#5F7175]">
                Filter by area of expertise, then open a profile to see how each advisor
                supports institutions.
              </p>
            </div>
            <span className="text-[13px] font-bold text-[#4C6165]">
              Showing {shown.length} of 16
            </span>
          </div>

          {/* Filter pills */}
          <div role="group" aria-label="Filter advisors by expertise" className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map(([key, label]) => {
              const on = key === filter;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={on}
                  className={`min-h-[44px] rounded-full px-4 text-[13.5px] font-bold transition-colors ${
                    on
                      ? "border border-[#152A2E] bg-[#152A2E] text-white"
                      : "border border-[#B2D6DB] bg-white text-[#152A2E] hover:border-[#17AEB9]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Advisor cards */}
          <div className="mt-6 grid gap-4 sm:mt-8" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
            {shown.map((a) => (
              <article
                key={a.name}
                className="group flex flex-col items-start gap-3 rounded-[10px] border border-[#DCEAEC] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#17AEB9] hover:shadow-[0_28px_54px_-32px_rgba(15,60,66,.5)]"
              >
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-[92px] w-[92px] rounded-full border-[3px] border-white object-cover shadow-[0_12px_26px_-14px_rgba(15,60,66,.6)]"
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <h3 className="text-[17px] font-extrabold leading-[1.3] tracking-[-.02em] text-[#152A2E]">
                    {a.name}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[#5F7175]">{a.role}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#DBEDEF] bg-[#EDF7F8] px-2.5 py-1 text-[11px] font-bold text-[#0E7A83]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIdx(a.i)}
                  className="cursor-pointer inline-flex min-h-[44px] items-center gap-1.5 font-extrabold text-[14px] text-[#0E8B95] hover:text-[#17AEB9]"
                >
                  View profile <span aria-hidden="true">↗</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How advisors work ─────────────────────────────── */}
      <section
        id="how"
        className="relative mx-2.5 overflow-hidden px-5 py-14 sm:px-8 lg:mx-5 lg:px-12 lg:py-16"
        style={{ borderRadius: 10 }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute" style={{
          top: "-22%", right: "-8%", width: "min(460px,48vw)", height: "min(460px,48vw)",
          animation: "lbSpin 122s linear infinite",
        }}>
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(23,174,185,.14)]" />
        </div>
        <div className="relative mx-auto max-w-[1320px]">
          <div className="mx-auto max-w-[720px] text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-white px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
              How advisors work with you
            </span>
            <h2 className="mt-4 text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.09] tracking-[-.032em] text-[#152A2E]">
              Expertise alongside <span className="text-[#17AEB9]">your team.</span>
            </h2>
            <p className="mx-auto mt-3.5 max-w-[60ch] text-[clamp(14px,1.08vw,16px)] leading-[1.66] text-[#5F7175]">
              Advisors join your quality cycle where it helps most, from first assessment
              to the review that follows.
            </p>
          </div>
          <div className="mt-8 grid border border-[#B2D6DB] bg-white" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            {[
              ["01", "Implementation guidance", "Interpret framework requirements, plan documentation and set up evidence structures with your coordinators."],
              ["02", "Capacity building", "Workshops and training sessions that help teachers and staff own the quality work, not just complete it."],
              ["03", "Quality reviews", "Internal reviews and mock audits that surface gaps early and turn findings into owned actions."],
              ["04", "Leadership mentoring", "Guidance for principals and management on governance, planning and building a culture of quality."],
            ].map(([n, t, d]) => (
              <div key={n} className="border-b border-r border-[#DCEAEC] p-6 last:border-r-0">
                <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[3px] bg-[#17AEB9] text-[13px] font-extrabold text-white">
                  {n}
                </span>
                <h3 className="mt-4 text-[18px] font-extrabold tracking-[-.02em] text-[#152A2E]">{t}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5F7175]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────── */}
      <section
        id="cta-band"
        className="relative mt-2.5 overflow-hidden bg-[#0E7A83] px-5 py-14 sm:px-8 lg:px-12 lg:py-16"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(255,255,255,.16) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-7">
          <div className="min-w-0 flex-[1_1_460px]">
            <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-.032em] text-white">
              Bring an advisor into your quality cycle.
            </h2>
            <p className="mt-3 max-w-[56ch] text-[clamp(14px,1.08vw,16px)] leading-[1.66] text-[#D7F0F2]">
              Tell us where your institution is in its journey and we will match you with
              the right expertise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 rounded-[10px] bg-white px-6 py-4 font-extrabold text-[15px] text-[#0E7A83]"
            >
              Book a Demo <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/advisor-apply"
              className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(255,255,255,.6)] px-5 py-3.5 font-bold text-[15px] text-white hover:bg-white/10"
            >
              Join the advisory network
            </Link>
          </div>
        </div>
      </section>

      {/* ── Profile modal ─────────────────────────────────── */}
      {cur && (
        <div
          role="presentation"
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 130,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, background: "rgba(11,32,35,.55)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={cur.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative", width: "min(760px,100%)",
              maxHeight: "calc(100vh - 40px)", overflow: "auto",
              background: "#fff", border: "1px solid #DCEAEC", borderRadius: 24,
              boxShadow: "0 40px 80px -30px rgba(11,32,35,.6)",
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close profile"
              style={{
                position: "absolute", top: 14, right: 14,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 44, height: 44, borderRadius: "50%",
                background: "#F2F9FA", border: "1px solid #DCEAEC",
                color: "#152A2E", cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12" /><path d="M18 6L6 18" />
              </svg>
            </button>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div style={{
                flex: "1 1 240px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 14,
                padding: "36px 24px", background: "#EDF7F8", borderRight: "1px solid #DBEDEF",
              }}>
                <img
                  src={cur.img}
                  alt={cur.name}
                  style={{
                    width: 168, height: 168, objectFit: "cover", borderRadius: "50%",
                    border: "4px solid #fff", boxShadow: "0 18px 36px -18px rgba(15,60,66,.6)",
                  }}
                />
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: ".14em",
                  textTransform: "uppercase", color: "#0E7A83",
                }}>
                  Advisor {cur.pos} of 16
                </span>
              </div>

              <div style={{
                flex: "1 1 360px", minWidth: 0, padding: "36px 30px 30px",
                display: "flex", flexDirection: "column", gap: 14,
              }}>
                <h2 style={{
                  margin: 0, paddingRight: 44,
                  fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.15,
                  letterSpacing: "-.03em", fontWeight: 800, color: "#152A2E",
                }}>
                  {cur.name}
                </h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontWeight: 700, color: "#0E8B95" }}>
                  {cur.role}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cur.tags.map((t) => (
                    <span key={t} style={{
                      padding: "5px 10px", background: "#EDF7F8",
                      border: "1px solid #DBEDEF", borderRadius: 999,
                      fontSize: 12, fontWeight: 700, color: "#0E7A83",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ paddingTop: 14, borderTop: "1px solid #E4EEEF" }}>
                  <span style={{
                    display: "block", fontSize: 11, fontWeight: 800,
                    letterSpacing: ".14em", textTransform: "uppercase", color: "#4C6165",
                  }}>
                    How they support institutions
                  </span>
                  <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.66, color: "#5F7175" }}>
                    {cur.how}
                  </p>
                </div>
                <div style={{
                  padding: "12px 14px", background: "#F7FBFB",
                  border: "1px dashed #B2D6DB", fontSize: 13, lineHeight: 1.6, color: "#4C6165",
                }}>
                  [Short bio: add two or three lines on experience, institutions served and focus areas]
                </div>
                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 12, marginTop: 6,
                }}>
                  <Link
                    href="/book-a-demo"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#17AEB9", color: "#fff",
                      padding: "13px 20px", borderRadius: 10,
                      fontWeight: 700, fontSize: 14, textDecoration: "none",
                    }}
                  >
                    Request an advisory session <span aria-hidden="true">↗</span>
                  </Link>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous advisor"
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: "#fff", border: "1px solid #B2D6DB",
                        fontSize: 17, fontWeight: 800, color: "#152A2E", cursor: "pointer",
                      }}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next advisor"
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: "#fff", border: "1px solid #B2D6DB",
                        fontSize: 17, fontWeight: 800, color: "#152A2E", cursor: "pointer",
                      }}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}