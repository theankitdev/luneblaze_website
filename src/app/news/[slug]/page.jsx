// src/app/news/[slug]/page.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

/* ───────────── Share row ───────────── */
function ShareRow({ title, size = "32" }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const on = (kind) => {
    if (kind === "wa") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank", "noopener");
      return;
    }
    if (kind === "li") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => { setCopied(true); setTimeout(() => setCopied(false), 2000); },
        () => setCopied(false)
      );
    }
  };

  const sz = size === "34" ? "h-[34px] w-[34px]" : "h-8 w-8";
  const ico = size === "34" ? 15 : 14;
  const baseBtn = `inline-flex ${sz} shrink-0 items-center justify-center rounded-[9px] border border-[#DCEAEC] bg-white transition-colors`;

  return (
    <span className="flex items-center gap-[7px]">
      <span className="mr-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9BABAE]">Share</span>
      <button type="button" onClick={() => on("wa")} aria-label="Share on WhatsApp"
        className={`${baseBtn} text-[#25936B] hover:bg-[#25936B] hover:text-white`}>
        <svg width={ico} height={ico} viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" /></svg>
      </button>
      <button type="button" onClick={() => on("li")} aria-label="Share on LinkedIn"
        className={`${baseBtn} text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white`}>
        <svg width={ico} height={ico} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" /></svg>
      </button>
      <button type="button" onClick={() => on("copy")} aria-label="Copy link"
        className={`${baseBtn} text-[#3E5257] hover:border-[#17AEB9] hover:bg-[#17AEB9] hover:text-white`}>
        {copied ? (
          <svg width={ico} height={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        ) : (
          <svg width={ico} height={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1-1" /></svg>
        )}
      </button>
    </span>
  );
}

/* ───────────── Shared related sidebar ───────────── */
const RELATED_POOL = [
  { day: "06", month: "OCT", bg: "#EEEFFB", color: "#5B5BD6", tag: "PLATFORM", title: "Group quality visibility across every campus", href: "/news/group-quality-visibility" },
  { day: "24", month: "SEP", bg: "#FDEDED", color: "#C4373C", tag: "PLATFORM", title: "Classroom observations & teaching assessments", href: "/news/classroom-observations-teaching-assessments" },
  { day: "12", month: "SEP", bg: "#E8F7EF", color: "#0E9F6E", tag: "PLATFORM", title: "Readiness Score explained", href: "/news/readiness-score-explained" },
  { day: "27", month: "AUG", bg: "#FDF4DC", color: "#B98200", tag: "FRAMEWORK", title: "SQAAF cycle announcements", href: "/news/sqaaf-cycle-announcements" },
];

/* ───────────── All 13 articles ───────────── */
const NEWS = {
  "hindu-group-mamdani-rss-bhagwat": {
    tag: "Framework Update", tagColor: "#C4373C", tagBg: "#FDEDED", tagBorder: "#F8D9DA",
    date: "August 27, 2026", readTime: "3 min read",
    title: "Hindu Group Reminds Mamdani of Sworn Duty Ahead of RSS Chief Bhagwat’s New York Event",
    dek: "An American Hindu advocacy group has written to the New York City mayor ahead of a scheduled address by the RSS chief, and issued a community advisory for those attending.",
    image: "/assets/news-hero.png",
    imageCaption: "Representative image. Credit to be added on publication.",
    caption2: "Caption placeholder — describe the image and credit its source.",
    location: "New York, US", category: "World News", published: "Aug 27, 2026",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New York —</strong> A United States-based Hindu advocacy group has written to New York City Mayor Zohran Mamdani ahead of an event in the city at which Rashtriya Swayamsevak Sangh chief Mohan Bhagwat is scheduled to speak, urging the mayor to uphold what it described as his sworn duty to protect the constitutional rights of all residents.' },
      { t: "p", html: "The group also issued an advisory to members of the Hindu American community planning to attend, setting out guidance on personal safety and conduct around the venue." },
      { t: "h2", text: "What the letter says" },
      { t: "p", html: "In its communication, the organisation asked the mayor’s office to ensure that attendees are able to gather without intimidation, and that policing arrangements around the venue are adequate to the expected turnout. It framed the request in terms of the equal protection owed to every faith community in the city." },
      { t: "p", html: "The letter drew a distinction between political disagreement with a speaker and interference with the right of residents to assemble and listen — arguing that the latter is a civil liberties question rather than a partisan one." },
      { t: "h2", text: "The community advisory" },
      { t: "p", html: "Alongside the letter, the group circulated an advisory to those intending to attend. It recommended arriving early, carrying identification, avoiding confrontation with counter-demonstrators, and reporting any incident to venue security and the police rather than responding directly." },
      { t: "p", html: "The advisory also asked attendees to travel in groups where possible and to keep contact details for legal support to hand — measures the group described as precautionary rather than a response to any specific threat." },
      { t: "h2", text: "Context around the visit" },
      { t: "p", html: "Mohan Bhagwat heads the Rashtriya Swayamsevak Sangh, the ideological parent organisation of India’s ruling Bharatiya Janata Party. Public appearances by senior RSS figures abroad have previously drawn both large audiences and organised protest, and have periodically become flashpoints in diaspora politics." },
      { t: "p", html: "Zohran Mamdani, who assumed office as Mayor of New York City, has been a vocal critic of Hindu nationalist politics in India. The advocacy group’s letter acknowledged that record while arguing that the mayor’s personal political positions should not bear on the city’s obligation to facilitate a lawful public event." },
      { t: "h2", text: "What happens next" },
      { t: "p", html: "Neither the mayor’s office nor the New York Police Department had issued a detailed public response to the letter at the time of reporting. Organisers of the event have said arrangements are proceeding as planned." },
    ],
    body2: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> The rollout of the Binary Accreditation System replaces the existing grade bands with a single accredited or not-accredited outcome, alongside maturity levels one through five for institutions choosing to progress further.' },
      { t: "p", html: "The cycle shortens from five years to three, and the process moves fully online — removing the on-site peer team visit that has shaped institutional preparation for the last decade." },
      { t: "h2", text: "What changes for institutions mid-cycle" },
      { t: "p", html: "Institutions with a current accreditation continue under their existing validity. The practical implication is for those preparing a fresh submission — the evidence expectations change shape, even where the underlying criteria do not." },
      { t: "h2", text: "What to do now" },
      { t: "p", html: "Audit your metric-level evidence against the published criteria and record where a claim rests on a document that does not yet exist. That gap list is the whole of the work." },
    ],
  },
  "news-group": {
    tag: "Platform Update", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "October 6, 2026", readTime: "4 min read",
    title: "Group quality visibility across every campus",
    dek: "Monitor institutions through a shared leadership dashboard — from a single school to a multi-campus group, everything in one live view.",
    image: "/assets/group-schools.png", imageCaption: "The group dashboard brings every campus into one view.",
    location: "Faridabad, India", category: "Platform", published: "Oct 6, 2026",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Luneblaze has released a consolidated group dashboard that brings every campus in a school network onto one screen. Trustees and directors can now see readiness, evidence completion and open actions across the whole group without switching between schools.' },
      { t: "p", html: "The dashboard is built around the three parameters that most reliably predict readiness: documentation status, staff participation and audit frequency. Each campus appears as a row, so weak spots surface first." },
      { t: "h2", text: "What leadership sees" },
      { t: "p", html: "The overview displays a group-wide readiness score alongside per-campus scores, benchmarked against the group median. Trend arrows show whether each campus is improving or slipping since the last cycle." },
      { t: "p", html: "Drill-down works down to the standard level — so a director who sees a dip in one campus can find the exact domain and evidence gap driving it, without asking the coordinator for a report." },
      { t: "h2", text: "Designed for role separation" },
      { t: "p", html: "Group management sees the aggregate. Each school’s coordinators continue working inside their own space, with their own evidence, meetings and improvement plans. Nothing crosses between campuses unless the group explicitly opts in." },
      { t: "p", html: "The dashboard is available now on all existing plans and requires no additional setup — any institution that belongs to a group will see the group tab appear automatically once at least two campuses are linked." },
    ],
  },
  "news-observations": {
    tag: "Platform Update", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "September 24, 2026", readTime: "4 min read",
    title: "Classroom observations & teaching assessments",
    dek: "Bring teaching practice into the same quality record as your documents, evidence and improvement plans.",
    image: "/assets/blog-in-3.webp", imageCaption: "Observation notes feed directly into the improvement plan.",
    location: "Faridabad, India", category: "Platform", published: "Sep 24, 2026",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Classroom observations have long lived in a separate register from the quality file. That gap closes this cycle: Luneblaze now records observations, teacher assessments and follow-up actions in the same workspace as evidence and improvement plans.' },
      { t: "p", html: "Each observation is tied to a teacher, a grade and a subject, and — critically — to the standard or domain it informs. So the evidence is no longer “we observed ten classrooms” but “we observed ten classrooms and here is what changed as a result”." },
      { t: "h2", text: "From observation to action" },
      { t: "p", html: "When an observation flags a gap, the coordinator can raise an improvement action directly from the observation record, with a named owner and a review date. The action appears in the same plan the leadership team already reviews." },
      { t: "p", html: "Trends build automatically across the year, so recurring gaps in a subject or grade become visible rather than scattered across individual notes." },
      { t: "h2", text: "Practical defaults" },
      { t: "p", html: "Observation templates ship with the framework defaults for SQAAF and NABET and can be edited. Both frameworks emphasise evidence of implementation, and observation records — dated, attributed and linked — are the clearest form of that evidence." },
    ],
  },
  "news-readiness": {
    tag: "Platform Update", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "September 12, 2026", readTime: "5 min read",
    title: "Readiness Score™ explained",
    dek: "Three practical parameters for continuous readiness monitoring — how they combine, what they measure, and what they deliberately do not.",
    image: "/assets/blog-in-2.webp", imageCaption: "The Readiness Score combines three parameters into one indicator.",
    location: "Faridabad, India", category: "Platform", published: "Sep 12, 2026",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Readiness Score™ is the number you see in the corner of every Luneblaze dashboard. It compresses a large amount of underlying activity into a single figure, and it is deliberately simple. Three parameters, weighted and combined.' },
      { t: "h2", text: "The three parameters" },
      { t: "p", html: "<strong>Documentation Status</strong> — of the documents and evidence your framework requires, what proportion exists and is current." },
      { t: "p", html: "<strong>Staff Inclusivity</strong> — what proportion of the staff who should be contributing to evidence and actions actually are. A plan that only the coordinator maintains is a plan that collapses." },
      { t: "p", html: "<strong>Audit Frequency</strong> — how recently internal reviews, mock audits or self-assessments have taken place. Stale reviews are a warning sign independent of the documentation itself." },
      { t: "h2", text: "What it does not measure" },
      { t: "p", html: "Readiness Score™ is not a prediction of grade or accreditation outcome. It is not a substitute for evidence quality. And it does not cover pedagogy, learning outcomes or teaching quality — those are assessed separately, through observation and outcome review." },
      { t: "p", html: "Treat it as a smoke detector: quiet when things are roughly fine, alert when something needs attention. If it drops, the dashboard will show you exactly which parameter caused the change." },
    ],
  },
  "news-sqaaf-cycle": {
    tag: "SQAAF", tagColor: "#0E8B95", tagBg: "#E4F5F6", tagBorder: "#B7E2E5",
    date: "Coming soon", readTime: "6 min read",
    title: "SQAAF cycle announcements and framework revisions",
    dek: "A plain-language summary whenever the framework or submission timeline changes — which domains it touches, and what your team needs to do differently.",
    image: "/assets/blog-4.png", imageCaption: "Summary of the current SQAAF cycle.",
    location: "India", category: "Framework", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> Whenever CBSE revises the School Quality Assessment and Assurance Framework, or shifts a submission timeline, we publish a summary here within 48 hours of the change. It covers the framework, not our platform.' },
      { t: "h2", text: "What these summaries cover" },
      { t: "p", html: "A plain-language description of what changed. Whether the change is structural (new domain, revised weightage) or procedural (submission window, portal timing). Which standards or sub-domains are affected. And a concrete checklist of what a school at each stage — pre-assessment, mid-cycle or approaching submission — should do differently." },
      { t: "h2", text: "What we do not do" },
      { t: "p", html: "We do not interpret the framework on CBSE’s behalf, and we do not speculate about the impact on grades. Where the framework is ambiguous, we say so and describe the options schools have been taking." },
      { t: "p", html: "Subscribe via the WhatsApp group or LinkedIn newsletter below to be notified when the next summary is published." },
    ],
  },
  "news-naac-updates": {
    tag: "NAAC", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "Coming soon", readTime: "5 min read",
    title: "NAAC grading and assessment process updates",
    dek: "Changes to criteria weightage, DVV rules and the peer team process, as they land.",
    image: "/assets/blog-6.png", imageCaption: "NAAC framework reference.",
    location: "India", category: "Framework", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Bengaluru —</strong> Under the Binary Accreditation System, NAAC’s assessment model is changing faster than at any point in the last decade. This page will document each revision as it is published.' },
      { t: "h2", text: "What we track" },
      { t: "p", html: "Changes to the seven criteria and their indicative weightages. Revisions to DVV rules and the clarifications process. Updates to the IIQA and SSR submission formats. Shifts in the peer team visit protocol — including the move to fully online assessment under the Binary framework." },
      { t: "h2", text: "Practical implications" },
      { t: "p", html: "Each update is paired with a one-paragraph note on what it means for an institution at each stage of preparation: IIQA pending, SSR in draft, DVV open, peer team scheduled. Where an update changes the evidence pattern — rather than the criteria themselves — the note says so explicitly." },
    ],
  },
  "news-dashboard-features": {
    tag: "Platform Update", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "Coming soon", readTime: "4 min read",
    title: "New features in the Luneblaze dashboard",
    dek: "Release notes covering analytics, reporting and evidence workflow improvements.",
    image: "/assets/blog-5.png", imageCaption: "Dashboard release.",
    location: "Faridabad, India", category: "Platform", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> A running log of what has shipped in the Luneblaze dashboard, grouped by release. Each entry names the change, who it affects and what to do differently.' },
      { t: "h2", text: "What ships" },
      { t: "p", html: "Analytics views — new charts, new breakdowns, new exports. Reporting improvements — scheduled reports, custom date ranges, role-specific views. Evidence workflow changes — new file-type support, better version tracking, improved bulk upload." },
      { t: "h2", text: "Feedback loop" },
      { t: "p", html: "Most of the features in this log started as requests from coordinators using the platform. If something is missing, the fastest route is a message on WhatsApp — we read everything." },
    ],
  },
  "news-nba-cycle": {
    tag: "NBA", tagColor: "#3B6FD4", tagBg: "#E8EFFC", tagBorder: "#C5D8F8",
    date: "Coming soon", readTime: "5 min read",
    title: "NBA accreditation cycle notices",
    dek: "Tier changes, SAR revisions and submission window announcements.",
    image: "/assets/blog-1.webp", imageCaption: "NBA cycle reference.",
    location: "India", category: "Framework", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> NBA accredits programmes rather than institutions, and its cycle is shorter and more frequent than NAAC’s. This page collects the notices that matter to department-level teams.' },
      { t: "h2", text: "What we publish" },
      { t: "p", html: "SAR submission windows and deadlines. Revisions to the ten SAR criteria and their weightages. Tier structure changes and what they mean for eligibility and renewal. Updates to the CO-PO mapping requirements and attainment calculation methods." },
      { t: "h2", text: "Where NBA differs" },
      { t: "p", html: "NBA’s evidence base is more tightly bound to outcomes and attainment data than NAAC’s or NABET’s. A programme that has not been tracking CO-PO attainment consistently through the year cannot produce the evidence NBA expects. Start the tracking at least eighteen months before the submission window." },
    ],
  },
  "news-nirf-window": {
    tag: "NIRF", tagColor: "#B98200", tagBg: "#FDF4DC", tagBorder: "#F2DCB0",
    date: "Coming soon", readTime: "4 min read",
    title: "NIRF submission window and parameter changes",
    dek: "What moved in the ranking methodology, and what it means for your data.",
    image: "/assets/blog-3.webp", imageCaption: "NIRF parameter reference.",
    location: "India", category: "Framework", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> NIRF’s submission window opens every year without fail. The institutions that do well are not the ones that work harder during the window — they are the ones that collect data continuously through the year.' },
      { t: "h2", text: "Parameter changes to watch" },
      { t: "p", html: "The five parameter groups — Teaching, Learning & Resources; Research & Professional Practice; Graduation Outcomes; Outreach & Inclusivity; Perception — carry published weightages that occasionally shift. When they do, the practical effect is usually to change which data point matters most, not whether it is collected at all." },
      { t: "h2", text: "Preparation rhythm" },
      { t: "p", html: "Collect faculty, research, graduation and placement data on a rolling monthly cycle. Validate against the previous year. File the submission against a validated dataset, not a compiled one. That discipline is worth more than any single year’s push." },
    ],
  },
  "news-milestones": {
    tag: "Community", tagColor: "#0E9F6E", tagBg: "#E8F7EF", tagBorder: "#B8E8CF",
    date: "Coming soon", readTime: "5 min read",
    title: "Institution milestones and accreditation results",
    dek: "Celebrating schools and colleges in our community as they reach the next level.",
    image: "/assets/blog-2.webp", imageCaption: "Community milestones.",
    location: "India", category: "Community", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Every cycle, a handful of institutions in the Luneblaze community reach a milestone worth marking: a first accreditation, a grade upgrade, a maturity level crossed, a new campus brought online.' },
      { t: "h2", text: "What we celebrate" },
      { t: "p", html: "First-time accreditations. Grade and maturity-level improvements. Renewals after a complete cycle. And the quieter milestones — the coordinator who finally got the whole staff contributing evidence without being chased, the head of school who moved from annual scramble to continuous review." },
      { t: "h2", text: "How to share" },
      { t: "p", html: "Institution teams can flag a milestone on WhatsApp. We ask permission before publishing, and institutions can opt out at any time." },
    ],
  },
  "news-nabet-revisions": {
    tag: "NABET", tagColor: "#0E9F6E", tagBg: "#E8F7EF", tagBorder: "#B8E8CF",
    date: "Coming soon", readTime: "4 min read",
    title: "NABET standard revisions",
    dek: "Updates to the school accreditation standard and assessment process.",
    image: "/assets/blog-in-2.webp", imageCaption: "NABET standard reference.",
    location: "India", category: "Framework", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> NABET, the school accreditation board of the Quality Council of India, revises its standard periodically. This page tracks every change as it is published.' },
      { t: "h2", text: "What we track" },
      { t: "p", html: "Revisions to the accreditation parameters — the 36 criteria that structure the self-assessment. Changes to the onsite assessment protocol. Updates to the document assessment and non-conformity closure process. Shifts in surveillance requirements." },
      { t: "h2", text: "The practical implication" },
      { t: "p", html: "NABET’s standard places heavier emphasis on process documentation than SQAAF’s. A school that has already implemented SQAAF systematically can reuse most of its evidence base, but the documentation discipline has to be even tighter — the standard asks you to show that processes are followed consistently, not just that they exist." },
    ],
  },
  "news-policy-notes": {
    tag: "Policy", tagColor: "#C4373C", tagBg: "#FDEDED", tagBorder: "#F8D9DA",
    date: "Coming soon", readTime: "6 min read",
    title: "Policy notes on educational quality",
    dek: "How national policy shifts affect quality assurance work on the ground.",
    image: "/assets/blog-in-3.webp", imageCaption: "Policy reference.",
    location: "India", category: "Policy", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">New Delhi —</strong> National education policy moves slowly, then quickly. When it moves, quality assurance work on the ground has to adjust. This page collects policy notes with practical implications for the institutions we serve.' },
      { t: "h2", text: "What we cover" },
      { t: "p", html: "NEP implementation updates that touch assessment, accreditation or institutional governance. CBSE circulars relevant to school quality work. UGC and AICTE notifications affecting higher-education accreditation. State-level policy moves that change the framework landscape in a particular region." },
      { t: "h2", text: "What we do not do" },
      { t: "p", html: "We are not policy advocates. We do not speculate about future regulation. Our notes are limited to describing what has actually been published, what it says, and what it means for institutions currently working through an accreditation cycle." },
    ],
  },
  "news-press": {
    tag: "Community", tagColor: "#0E9F6E", tagBg: "#E8F7EF", tagBorder: "#B8E8CF",
    date: "Coming soon", readTime: "3 min read",
    title: "Luneblaze in the press",
    dek: "Coverage, interviews and speaking appearances from the team.",
    image: "/assets/blog-in-5.webp", imageCaption: "Press coverage.",
    location: "India", category: "Community", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Occasional coverage, interviews and speaking appearances from the Luneblaze team — collected in one place for institutions, partners and anyone else interested in the work.' },
      { t: "h2", text: "What you’ll find" },
      { t: "p", html: "Interviews on education quality and accreditation. Podcast appearances discussing framework implementation. Conference talks and panel discussions. Press coverage of platform releases and community milestones." },
      { t: "p", html: "For press enquiries, contact contact@luneblaze.com." },
    ],
  },
  "news-digest": {
    tag: "Platform Update", tagColor: "#5B5BD6", tagBg: "#EEEFFB", tagBorder: "#DCDCF8",
    date: "Coming soon", readTime: "8 min read",
    title: "Quarterly quality digest",
    dek: "Everything that changed across all five frameworks, in one read.",
    image: "/assets/blog-in-1.webp", imageCaption: "Quarterly digest.",
    location: "India", category: "Platform", published: "Coming soon",
    body: [
      { t: "p", html: '<strong style="color:#152A2E">Faridabad —</strong> Every quarter, we consolidate the changes across SQAAF, NABET, NAAC, NBA and NIRF into a single digest — so a coordinator working across multiple frameworks does not have to read five separate update streams.' },
      { t: "h2", text: "Structure" },
      { t: "p", html: "One section per framework. Within each section: changes to the framework itself, changes to the submission or assessment process, and a short practical note on what institutions should do differently in the coming quarter." },
      { t: "h2", text: "One-page summary" },
      { t: "p", html: "Each digest opens with a one-page summary for leadership — the changes that require a decision, and the changes that require only awareness. Coordinators can forward the summary upward without rewriting it." },
    ],
  },
};

Object.assign(NEWS, {
  "group-quality-visibility": NEWS["news-group"],
  "classroom-observations-teaching-assessments": NEWS["news-observations"],
  "readiness-score-explained": NEWS["news-readiness"],
  "sqaaf-cycle-announcements": NEWS["news-sqaaf-cycle"],
  "naac-grading-assessment-updates": NEWS["news-naac-updates"],
  "luneblaze-dashboard-features": NEWS["news-dashboard-features"],
  "nba-accreditation-cycle-notices": NEWS["news-nba-cycle"],
  "nirf-submission-window-updates": NEWS["news-nirf-window"],
  "institution-milestones-accreditation-results": NEWS["news-milestones"],
  "nabet-standard-revisions": NEWS["news-nabet-revisions"],
  "policy-notes-educational-quality": NEWS["news-policy-notes"],
  "luneblaze-in-the-press": NEWS["news-press"],
  "quarterly-quality-digest": NEWS["news-digest"],
});

const PUBLIC_NEWS_SLUGS = [
  "group-quality-visibility",
  "classroom-observations-teaching-assessments",
  "readiness-score-explained",
  "sqaaf-cycle-announcements",
  "naac-grading-assessment-updates",
  "luneblaze-dashboard-features",
  "nba-accreditation-cycle-notices",
  "nirf-submission-window-updates",
  "institution-milestones-accreditation-results",
  "nabet-standard-revisions",
  "policy-notes-educational-quality",
  "luneblaze-in-the-press",
  "quarterly-quality-digest",
];

/* ───────────── Icons ───────────── */
function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5 4 12l5 7" />
      <path d="M4 12h16" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h14" />
      <path d="m12 6 6 6-6 6" />
    </svg>
  );
}

/* ───────────── Article prose renderer ───────────── */
function ArticleContent({ blocks = [] }) {
  return blocks.map((block, index) =>
    block.t === "h2" ? (
      <h2
        key={`${block.text}-${index}`}
        className="mt-[clamp(30px,3.4vw,46px)] max-w-[34ch] text-left text-[clamp(19px,1.05rem+1.05vw,27px)] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#101E21] [text-wrap:balance] max-sm:mt-[30px] max-sm:text-xl"
      >
        {block.text}
      </h2>
    ) : (
      <p
        key={`paragraph-${index}`}
        className="mt-[1.05em] max-w-[72ch] text-left text-[clamp(15px,0.9rem+0.42vw,17px)] leading-[1.78] text-[#3E5257] [text-wrap:pretty] first:mt-0 max-sm:text-[15px] max-sm:leading-[1.72] [&_strong]:font-extrabold [&_strong]:text-[#152A2E]"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    )
  );
}

/* ───────────── Page ───────────── */
export default function NewsDetailPage() {
  const routeParams = useParams();
  const routeSlug = routeParams?.slug;
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  const bodyRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const body = bodyRef.current;
      const fill = progressRef.current;
      if (!body || !fill) return;

      const rect = body.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : rect.top < 0 ? 1 : 0;

      fill.style.width = `${(progress * 100).toFixed(2)}%`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [slug]);

  if (!slug) return null;

  const news = NEWS[slug];

  /* ── Not found ── */
  if (!news) {
    return (
      <main className="min-h-screen overflow-x-clip bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,-apple-system,sans-serif] text-[#172326] antialiased [box-sizing:border-box]">
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#F9FDFD] via-[#F4FBFB] to-[#FCFDFD] px-5 pb-6 pt-[clamp(60px,4vw,96px)] sm:px-[clamp(20px,4vw,52px)] sm:pb-[clamp(28px,3vw,42px)] max-sm:pb-6 max-sm:pt-[62px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.34]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="mx-auto w-[min(calc(100%-40px),840px)] max-sm:w-[min(calc(100%-36px),840px)]">
            <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] no-underline transition-colors duration-[250ms] hover:text-[#0E8B95]">
              <ArrowLeft />
              Back to News
            </Link>
            <div className="py-[clamp(56px,8vw,100px)]">
              <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#0E8B95]">LUNEBLAZE NEWSROOM</span>
              <h1 className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#101E21]">
                Article not found
              </h1>
              <p className="mb-[22px] mt-3.5 max-w-[55ch] text-[15px] leading-[1.7] text-[#5F7175]">
                This news item is no longer available. Browse the latest updates from the Luneblaze team.
              </p>
              <Link href="/news" className="inline-flex items-center gap-[9px] rounded-[10px] bg-[#17AEB9] px-[19px] py-[13px] text-[13.5px] font-bold text-white no-underline hover:bg-[#0E8B95]">
                Explore all news <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const related = PUBLIC_NEWS_SLUGS
    .filter((itemSlug) => itemSlug !== slug && NEWS[itemSlug])
    .slice(0, 4)
    .map((itemSlug) => ({ slug: itemSlug, ...NEWS[itemSlug] }));

  return (
    <main className="min-h-screen overflow-x-clip bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,-apple-system,sans-serif] text-[#172326] antialiased [&_*]:box-border">

      {/* Reading progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[96] h-[3px] bg-transparent" aria-hidden="true">
        <span
          ref={progressRef}
          className="block h-full w-0 rounded-r-[3px] bg-gradient-to-r from-[#17AEB9] to-[#5B5BD6] transition-[width] duration-100 ease-linear"
        />
      </div>

      {/* Editorial article header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#F9FDFD] via-[#F4FBFB] to-[#FCFDFD] px-[clamp(20px,4vw,52px)] pb-[clamp(28px,3vw,42px)] pt-[clamp(60px,4vw,96px)] max-sm:pb-6 max-sm:pt-[62px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.34]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="mx-auto w-[min(calc(100%-40px),840px)] max-sm:w-[min(calc(100%-36px),840px)]">
          <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] no-underline transition-colors duration-[250ms] hover:text-[#0E8B95]">
            <ArrowLeft />
            Back to News
          </Link>

          <div className="mt-6">
            <span
              className="inline-flex items-center gap-[7px] rounded-[7px] border px-[11px] py-1.5 text-[9.5px] font-extrabold uppercase leading-[1.3] tracking-[0.14em]"
              style={{ background: news.tagBg, borderColor: news.tagBorder, color: news.tagColor }}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ background: news.tagColor }} />
              {news.tag}
            </span>
          </div>

          <h1 className="mt-6 max-w-[22ch] text-[clamp(29px,3.8vw,50px)] font-extrabold leading-[1.08] tracking-[-0.036em] text-[#101E21] [text-wrap:balance] max-sm:mt-5 max-sm:max-w-full max-sm:text-[clamp(25px,1rem+4.4vw,31px)] max-sm:leading-[1.14] max-sm:tracking-[-0.028em]">
            {news.title}
          </h1>
          <p className="mt-4 max-w-[66ch] text-[clamp(14.5px,0.88rem+0.42vw,17px)] font-normal leading-[1.68] text-[#3E5257] [text-wrap:pretty] max-sm:mt-3 max-sm:text-sm max-sm:leading-[1.62]">
            {news.dek}
          </p>

          <div className="mt-[clamp(22px,2.4vw,30px)] flex flex-wrap items-center gap-x-[clamp(18px,3vw,38px)] gap-y-[13px] border-b border-[#E4EEEF] pb-[clamp(22px,2.4vw,30px)] max-sm:mt-5 max-sm:gap-x-[18px] max-sm:gap-y-[13px] max-sm:pb-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full border border-[#CDE8EA] bg-gradient-to-br from-[#E4F5F6] to-[#EEEFFB] text-[11px] font-extrabold tracking-[-0.03em] text-[#0E8B95]" aria-hidden="true">LB</span>
              <span className="text-[13px] font-bold text-[#152A2E] max-sm:text-xs">Luneblaze Quality Team</span>
            </div>

            <div className="flex min-w-0 items-baseline gap-[9px] max-sm:gap-1.5">
              <span className="text-[11.5px] font-semibold text-[#8A9B9E] max-sm:text-[10.5px]">Category</span>
              <span className="text-[13px] font-bold text-[#152A2E] max-sm:text-xs">{news.category}</span>
            </div>

            <div className="flex min-w-0 items-baseline gap-[9px] max-sm:gap-1.5">
              <span className="text-[11.5px] font-semibold text-[#8A9B9E] max-sm:text-[10.5px]">Date</span>
              <span className="text-[13px] font-bold text-[#152A2E] max-sm:text-xs">{news.date}</span>
            </div>

            <div className="flex min-w-0 items-baseline gap-[9px] max-sm:gap-1.5">
              <span className="text-[11.5px] font-semibold text-[#8A9B9E] max-sm:text-[10.5px]">Read</span>
              <span className="text-[13px] font-bold text-[#152A2E] max-sm:text-xs">{news.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section
        id="news-body"
        ref={bodyRef}
        className="relative mx-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[clamp(26px,3vw,44px)] border border-[#E4EEEF] bg-[#FCFDFD] px-[clamp(18px,4vw,52px)] pb-[clamp(40px,4.6vw,68px)] pt-0 max-sm:rounded-3xl max-sm:px-4 max-sm:pb-9"
      >
        <article className="mx-auto w-[min(100%,840px)]">
          <div className="my-0 mb-3.5 ml-auto flex justify-end">
            <ShareRow title={news.title} />
          </div>

          <div className="relative mt-[clamp(26px,3vw,40px)] aspect-video w-full overflow-hidden rounded-[20px] border border-[#DCEAEC] bg-[#EDF4F5] max-sm:mt-[22px] max-sm:rounded-[15px]">
            <Image
              src={news.image}
              alt={news.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 840px"
              className="object-cover"
            />
          </div>

          {news.imageCaption && (
            <p className="mx-0.5 mt-[11px] text-[11.5px] leading-[1.55] text-[#8A9B9E]">
              {news.imageCaption}
            </p>
          )}

          <div className="mt-[clamp(28px,3.2vw,44px)]">
            <ArticleContent blocks={news.body} />
          </div>

          <div className="mt-[clamp(30px,3.4vw,44px)] flex flex-wrap items-center gap-3 rounded-[14px] border border-[#DBEDEF] bg-[#EDF7F8] px-5 py-[18px] max-sm:items-stretch max-sm:p-[15px]">
            <p className="min-w-0 flex-1 text-sm font-semibold leading-[1.68] text-[#0B3A40]">
              Working towards NAAC? See how Luneblaze prepares your submission.
            </p>
            <Link
              href="/naac"
              className="inline-flex flex-none items-center justify-center gap-[9px] rounded-[10px] border border-[#17AEB9] bg-[#17AEB9] px-5 py-3 text-[13.5px] font-bold text-white no-underline transition-[transform,border-color,background] duration-[280ms] ease-[cubic-bezier(.22,.8,.2,1)] hover:-translate-y-0.5 hover:bg-[#0E8B95] max-sm:w-full"
            >
              Explore NAAC <ArrowRight />
            </Link>
          </div>

          {news.caption2 && (
            <p className="mx-0.5 mt-[11px] text-[11.5px] leading-[1.55] text-[#8A9B9E]">
              {news.caption2}
            </p>
          )}

          {news.body2?.length > 0 && (
            <div className="mt-[clamp(28px,3.2vw,44px)]">
              <ArticleContent blocks={news.body2} />
            </div>
          )}

          <div className="mt-[clamp(30px,3.4vw,44px)] flex flex-wrap items-center gap-3 border-t border-[#E4EEEF] pt-[clamp(22px,2.4vw,30px)] max-sm:items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A9B9E]">
              Share this article
            </span>
            <div className="inline-flex items-center gap-[7px]">
              <ShareRow title={news.title} size="34" />
            </div>
            <a
              href="https://www.linkedin.com/newsletters/7125753253224493056/"
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex flex-none items-center justify-center gap-[9px] rounded-[10px] border border-[#DCEAEC] bg-white px-5 py-3 text-[13.5px] font-bold text-[#152A2E] no-underline transition-[transform,border-color,background] duration-[280ms] ease-[cubic-bezier(.22,.8,.2,1)] hover:-translate-y-0.5 hover:border-[#17AEB9]"
            >
              Get new insights <ArrowRight />
            </a>
          </div>
        </article>
      </section>

      {/* Related news cards */}
      <section className="relative mx-[clamp(10px,1.5vw,20px)] mt-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[clamp(26px,3vw,44px)] border border-[#DBEDEF] bg-[#EDF7F8] px-[clamp(20px,4vw,52px)] py-[clamp(42px,4.8vw,70px)] max-sm:rounded-3xl max-sm:px-4 max-sm:py-[38px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.34]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto w-[min(100%,1320px)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#152A2E]">
                More News
              </h2>
              <p className="mt-3 text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.62] text-[#5F7175]">
                More updates and insights from the Luneblaze quality team.
              </p>
            </div>

            <Link
              href="/news"
              className="inline-flex flex-none items-center justify-center gap-[9px] rounded-[10px] border border-[#DCEAEC] bg-white px-5 py-3 text-[13.5px] font-bold text-[#152A2E] no-underline transition-[transform,border-color,background] duration-[280ms] ease-[cubic-bezier(.22,.8,.2,1)] hover:-translate-y-0.5 hover:border-[#17AEB9]"
            >
              View all news <ArrowRight />
            </Link>
          </div>

          <div className="mt-[clamp(24px,2.8vw,36px)] grid grid-cols-4 gap-[clamp(11px,1.3vw,16px)] max-md:grid-cols-2 max-sm:gap-2.5 max-[380px]:grid-cols-1">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#DCEAEC] bg-white no-underline transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,.8,.2,1)] hover:-translate-y-1.5 hover:border-[#17AEB9] hover:shadow-[0_24px_48px_-30px_rgba(15,60,66,0.5)]"
              >
                <span className="relative block aspect-video w-full flex-none overflow-hidden bg-[#EDF4F5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(.22,.8,.2,1)] group-hover:scale-[1.045]"
                  />
                  <span
                    className="absolute left-[11px] top-[11px] inline-flex items-center rounded-[7px] px-[11px] py-[5px] text-[9.5px] font-extrabold uppercase tracking-[0.09em] max-sm:left-2 max-sm:top-2 max-sm:px-[7px] max-sm:py-1 max-sm:text-[8px]"
                    style={{ background: item.tagBg, color: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                </span>

                <span className="flex flex-1 flex-col gap-[7px] px-4 pb-[17px] pt-[15px] max-sm:px-3 max-sm:pb-3.5 max-sm:pt-3">
                  <span className="text-[11px] font-bold text-[#8A9B9E] max-sm:text-[10px]">{item.published}</span>
                  <span className="block text-[14.5px] font-extrabold leading-[1.3] tracking-[-0.018em] text-[#152A2E] max-sm:text-[12.5px]">
                    {item.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}