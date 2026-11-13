"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ROLES = {
  "quality-consultant": {
    title: "Quality & Accreditation Consultant",
    dept: "Consulting",
    type: "Full-time",
    place: "Faridabad / Remote",
    experience: "2+ years",
    blurb:
      "Guide institutions through SQAAF, NABET or NAAC cycles end to end — assessment, documentation, evidence and audit readiness.",
    about: [
      "You will work directly with schools and colleges through a full quality cycle — sitting with leadership, mapping their position against the framework, and turning gaps into a plan they can actually execute.",
      "This is hands-on work rather than advisory-at-a-distance. You will be in the documents, in the evidence, and in the room when the assessor arrives.",
    ],
    do: [
      "Run self-assessment and gap analysis with institutional teams.",
      "Build documentation and evidence sets against framework standards.",
      "Conduct mock audits and prepare institutions for external assessment.",
      "Train IQAC and focus-group members so the work continues without you.",
    ],
    want: [
      "Direct experience inside a quality or accreditation cycle, from either side.",
      "Comfort writing clearly — policies, SOPs and reports that hold up under review.",
      "Willingness to travel to institutions when a cycle needs it.",
    ],
  },
  "iqac-specialist": {
    title: "IQAC Implementation Specialist",
    dept: "Consulting",
    type: "Full-time",
    place: "Remote",
    experience: "2+ years",
    blurb:
      "Work with college IQAC teams on criteria mapping, SSR preparation and DVV response.",
    about: [
      "You will sit inside IQAC workflows — from criteria mapping to SSR drafting and DVV replies — and help institutions run a genuinely continuous quality cycle, not an annual scramble.",
      "The role rewards people who know the NAAC manual intimately and can translate it into something a department coordinator can execute.",
    ],
    do: [
      "Map institutional practice against NAAC criteria and key indicators.",
      "Draft and review SSR sections with IQAC coordinators.",
      "Prepare DVV clarifications with supporting evidence.",
      "Run internal readiness reviews ahead of peer team visits.",
    ],
    want: [
      "Hands-on IQAC or SSR drafting experience.",
      "Familiarity with NAAC / NABET / NBA / NIRF frameworks.",
      "Strong written communication and attention to detail.",
    ],
  },
  "frontend-engineer": {
    title: "Frontend Engineer",
    dept: "Engineering",
    type: "Full-time",
    place: "Faridabad / Remote",
    experience: "2+ years",
    blurb:
      "Build the dashboards institutions run their quality cycle on. Careful, accessible, fast interfaces.",
    about: [
      "You will own product surfaces used daily by principals, IQAC coordinators and quality teams — dashboards, evidence workflows, review screens.",
      "We care about craft: real accessibility, meaningful interactions, and performance that holds up on modest hardware.",
    ],
    do: [
      "Ship React/Next.js features end to end with design and backend.",
      "Own component architecture and design-system quality.",
      "Instrument and improve performance on real devices.",
      "Review PRs and raise the bar on frontend standards.",
    ],
    want: [
      "Strong React + Next.js fundamentals.",
      "Comfort with Tailwind and modern CSS.",
      "An eye for accessibility and detail.",
    ],
  },
  "customer-success": {
    title: "Customer Success Manager",
    dept: "Customer",
    type: "Full-time",
    place: "Faridabad",
    experience: "3+ years",
    blurb:
      "Own the relationship with a portfolio of institutions from onboarding through to accreditation.",
    about: [
      "You will be the trusted point of contact for a portfolio of schools and colleges — from onboarding through their accreditation cycle and beyond.",
      "Success here looks like institutions renewing because the product genuinely changed how they work, not because the contract rolled over.",
    ],
    do: [
      "Onboard new institutions and drive activation.",
      "Run quarterly reviews with leadership and quality teams.",
      "Translate institutional needs into product feedback.",
      "Own renewals and expansion within your portfolio.",
    ],
    want: [
      "Prior CS/account management experience in B2B SaaS.",
      "Strong relationship-building and communication.",
      "Comfort with data — usage, health scores, renewals.",
    ],
  },
  "content-training": {
    title: "Content & Training Associate",
    dept: "Content",
    type: "Full-time",
    place: "Remote",
    experience: "1+ years",
    blurb:
      "Produce the guides, webinars and training that help quality teams do the work themselves.",
    about: [
      "You will translate quality frameworks into practical guides, walkthroughs, webinars and in-product help.",
      "The work is editorial and instructional — clarity matters more than cleverness.",
    ],
    do: [
      "Write guides and playbooks on SQAAF, NAAC and related frameworks.",
      "Produce and host training webinars for institutions.",
      "Maintain the in-product help library.",
      "Work with the product team on onboarding content.",
    ],
    want: [
      "Excellent written English and structural thinking.",
      "Familiarity with education quality frameworks (or appetite to learn).",
      "Comfort presenting to small groups.",
    ],
  },
  "business-development": {
    title: "Business Development — Institutions",
    dept: "Growth",
    type: "Full-time",
    place: "Faridabad / Field",
    experience: "3+ years",
    blurb:
      "Work with school groups and universities to scope how Luneblaze fits their quality journey.",
    about: [
      "You will own the top of the funnel for institutional deals — school groups, universities and colleges.",
      "This is consultative selling: understanding where an institution is in their quality cycle and mapping Luneblaze to it.",
    ],
    do: [
      "Build and manage a pipeline of institutional opportunities.",
      "Run discovery calls with principals, IQAC heads and trust leadership.",
      "Partner with Customer Success on handoffs and renewals.",
      "Represent Luneblaze at education events and webinars.",
    ],
    want: [
      "B2B SaaS sales experience, ideally in education.",
      "Strong consultative and discovery skills.",
      "Willingness to travel across India when needed.",
    ],
  },
};

export default function JobOpeningPage({ params }) {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    Promise.resolve(params).then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) return null;
  const role = ROLES[slug];
  if (!role) {
    return (
      <main className="min-h-screen bg-white font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
        <div className="mx-auto max-w-[1100px] px-5 pt-32 pb-20">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] hover:text-[#0E8B95]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12H6" />
              <path d="M12 6l-6 6 6 6" />
            </svg>
            All openings
          </Link>
          <h1 className="mt-6 text-[clamp(28px,3.6vw,46px)] font-extrabold leading-[1.08] tracking-[-0.034em] text-[#152A2E]">
            Role not found
          </h1>
          <p className="mt-4 text-base text-[#4C6165]">
            This opening is no longer available.{" "}
            <Link href="/careers" className="font-semibold text-[#0E8B95] hover:underline">
              See current openings
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
      {/* ── Hero — WHITE ─────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-[clamp(20px,4vw,52px)] pb-[clamp(24px,2.8vw,38px)] pt-[clamp(60px,4vw,134px)]"
      >
        <div className="relative mx-auto max-w-[1100px]">
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] transition-colors hover:text-[#0E8B95]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M20 12H6" />
                <path d="M12 6l-6 6 6 6" />
              </svg>
              All openings
            </Link>

            <span className="ml-auto flex items-center gap-[7px]">
              <span className="mr-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9BABAE]">
                Share
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${role.title} at Luneblaze — ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white text-[#25936B] transition-colors hover:bg-[#25936B] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" />
                </svg>
              </a>
            </span>
          </div>

          <div className="mt-[22px] flex flex-wrap gap-[7px]">
            <span className="rounded-full bg-[#E4F5F6] px-[13px] py-[6px] text-[10.5px] font-extrabold tracking-[0.06em] text-[#0E8B95]">
              {role.dept}
            </span>
            <span className="rounded-full bg-[#EEEFFB] px-[13px] py-[6px] text-[10.5px] font-extrabold tracking-[0.06em] text-[#5B5BD6]">
              {role.type}
            </span>
            <span className="rounded-full bg-[#F2F9FA] px-[13px] py-[6px] text-[10.5px] font-extrabold tracking-[0.06em] text-[#5F7175]">
              {role.place}
            </span>
          </div>

          <h1 className="mt-[17px] max-w-[26ch] text-[clamp(28px,3.6vw,46px)] font-extrabold leading-[1.08] tracking-[-0.034em] text-[#152A2E]">
            {role.title}
          </h1>
          <p className="mt-4 max-w-[64ch] text-[clamp(14.5px,1.15vw,17px)] leading-[1.66] text-[#4C6165]">
            {role.blurb}
          </p>
        </div>
      </section>

      {/* ── Body — inside TEAL surround ──────────────────── */}
      <div className="relative bg-[#EDF7F8] px-[clamp(10px,1.5vw,20px)] py-[clamp(26px,3vw,44px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle,rgba(23,174,185,0.22)_1.1px,transparent_1.1px)] [background-size:28px_28px]" />
        </div>

        <section
          id="body"
          className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[10px]  px-[clamp(20px,4vw,52px)] pt-[clamp(26px,3vw,44px)] pb-[clamp(40px,4.6vw,68px)]"
        >
          <div className="grid items-start gap-[clamp(22px,2.8vw,44px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
            <div>
              <h2 className="text-[clamp(19px,2vw,25px)] font-extrabold leading-[1.2] tracking-[-0.028em] text-[#152A2E]">
                About the role
              </h2>
              {role.about.map((para, i) => (
                <p
                  key={i}
                  className="mt-[13px] text-[clamp(14.5px,1.14vw,16.5px)] leading-[1.76] text-[#3E5257]"
                >
                  {para}
                </p>
              ))}

              <h2 className="mt-[clamp(26px,3vw,38px)] text-[clamp(19px,2vw,25px)] font-extrabold leading-[1.2] tracking-[-0.028em] text-[#152A2E]">
                What you will do
              </h2>
              <ul className="mt-[14px] grid list-none gap-[11px] p-0">
                {role.do.map((item, i) => (
                  <li key={i} className="flex gap-[11px] text-[14.5px] leading-[1.68] text-[#3E5257]">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E4F5F6] text-[#0E8B95]"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-[clamp(26px,3vw,38px)] text-[clamp(19px,2vw,25px)] font-extrabold leading-[1.2] tracking-[-0.028em] text-[#152A2E]">
                What we are looking for
              </h2>
              <ul className="mt-[14px] grid list-none gap-[11px] p-0">
                {role.want.map((item, i) => (
                  <li key={i} className="flex gap-[11px] text-[14.5px] leading-[1.68] text-[#3E5257]">
                    <span aria-hidden="true" className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#17AEB9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aside — sticky "At a glance" */}
            <aside className="grid gap-3 self-start lg:sticky lg:top-24">
              <div className="rounded-[10px] border border-[#DCEAEC] bg-white p-[clamp(17px,1.9vw,22px)] shadow-[0_2px_4px_rgba(23,35,38,0.03),0_24px_48px_-34px_rgba(15,60,66,0.45)]">
                <div className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">
                  At a glance
                </div>
                <div className="mt-[13px] grid gap-[11px]">
                  {[
                    ["Team", role.dept],
                    ["Location", role.place],
                    ["Type", role.type],
                    ["Experience", role.experience],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-2.5">
                      <span className="text-[12px] font-semibold text-[#5F7175]">{k}</span>
                      <span className="text-right text-[12px] font-extrabold text-[#152A2E]">{v}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/career/${slug}/apply`}
                  className="mt-4 flex w-full items-center justify-center gap-[9px] rounded-[4px] bg-[#17AEB9] px-5 py-[13px] text-[13.5px] font-extrabold tracking-[0.02em] text-white shadow-[0_12px_26px_-12px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-[3px]"
                >
                  APPLY FOR THIS ROLE
                  <span aria-hidden="true" className="inline-flex">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12h14" />
                      <path d="M12 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}