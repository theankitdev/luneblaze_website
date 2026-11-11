// src/components/careers/RolesSection.jsx
"use client";

import Link from "next/link";

const ROLES = [
  {
    slug: "quality-consultant",
    dept: "Consulting",
    type: "Full-time",
    title: "Quality & Accreditation Consultant",
    location: "Faridabad / Remote",
    desc: "Guide institutions through SQAAF, NABET or NAAC cycles end to end — assessment, documentation, evidence and audit readiness.",
  },
  {
    slug: "iqac-specialist",
    dept: "Consulting",
    type: "Full-time",
    title: "IQAC Implementation Specialist",
    location: "Remote",
    desc: "Work with college IQAC teams on criteria mapping, SSR preparation and DVV response.",
  },
  {
    slug: "frontend-engineer",
    dept: "Engineering",
    type: "Full-time",
    title: "Frontend Engineer",
    location: "Faridabad / Remote",
    desc: "Build the dashboards institutions run their quality cycle on. Careful, accessible, fast interfaces.",
  },
  {
    slug: "customer-success",
    dept: "Customer",
    type: "Full-time",
    title: "Customer Success Manager",
    location: "Faridabad",
    desc: "Own the relationship with a portfolio of institutions from onboarding through to accreditation.",
  },
  {
    slug: "content-training",
    dept: "Content",
    type: "Full-time",
    title: "Content & Training Associate",
    location: "Remote",
    desc: "Produce the guides, webinars and training that help quality teams do the work themselves.",
  },
  {
    slug: "business-development",
    dept: "Growth",
    type: "Full-time",
    title: "Business Development — Institutions",
    location: "Faridabad / Field",
    desc: "Work with school groups and universities to scope how Luneblaze fits their quality journey.",
  },
];

export default function RolesSection() {
  return (
    <section
      id="roles"
      className="relative overflow-hidden bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] py-[clamp(46px,5vw,76px)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.36] [background-image:radial-gradient(circle,rgba(23,174,185,0.18)_1.1px,transparent_1.1px)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mx-auto max-w-[960px] text-center">
          <h2 className="m-0 text-[clamp(30px,3.6vw,48px)] font-extrabold leading-[1.1] tracking-[-0.034em] text-[#152A2E]">
            Current Openings
          </h2>
          <p className="mx-auto mt-[18px] max-w-[820px] text-[clamp(16px,1.25vw,19px)] leading-[1.72] text-[#5F7175]">
            Roles are listed as they open. If nothing matches but you think you belong
            here, write to us anyway — we read everything.
          </p>
        </div>

        <div className="mt-[clamp(32px,3.6vw,48px)] grid grid-cols-1 gap-[clamp(14px,1.6vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <Link
              key={r.slug}
              href={`/career/${r.slug}`}
              className="group flex flex-col gap-4 rounded-[10px] border border-[#E4EEEF] bg-white p-[clamp(24px,2.4vw,32px)] no-underline transition-[transform,border-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] hover:-translate-y-[5px] hover:border-[#17AEB9] hover:shadow-[0_22px_44px_-28px_rgba(15,60,66,0.45)]"
            >
              <span className="flex flex-wrap gap-2">
                <span className="rounded-[4px] bg-[#E4F5F6] px-[13px] py-[6px] text-[11.5px] font-extrabold text-[#0E8B95]">
                  {r.dept}
                </span>
                <span className="rounded-[4px] bg-[#EEEFFB] px-[13px] py-[6px] text-[11.5px] font-extrabold text-[#5B5BD6]">
                  {r.type}
                </span>
              </span>

              <span className="flex-1">
                <span className="block text-[clamp(17px,1.5vw,20px)] font-extrabold leading-[1.25] tracking-[-0.02em] text-[#152A2E]">
                  {r.title}
                </span>
                <span className="mt-[7px] block text-[clamp(12.5px,1.05vw,14px)] font-bold text-[#8A9B9E]">
                  {r.location}
                </span>
                <span className="mt-[11px] block text-[clamp(14px,1.05vw,15.5px)] leading-[1.65] text-[#5F7175]">
                  {r.desc}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 text-[clamp(13px,1vw,14.5px)] font-bold text-[#0E8B95]">
                View role
                <span
                  aria-hidden="true"
                  className="inline-flex transition-transform duration-300 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] group-hover:translate-x-1"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h14" />
                    <path d="M12 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}