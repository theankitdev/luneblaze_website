"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";

const BLOGS = [
  {
    slug: "documentation-systems-that-scale",
    title: "Documentation Systems That Scale",
    tag: "SQAAF",
    category: "Process Improvement",
    image: "/assets/blog-6.png",
    author: "Luneblaze Team",
    date: "August 2026",
    readTime: "6 min read",
    excerpt:
      "A central repository that keeps working as your institution grows.",
    content: [
      {
        type: "paragraph",
        text: "As institutions grow, managing documents across departments and academic years becomes increasingly complex. A structured documentation system helps maintain consistency.",
      },
      { type: "heading", text: "The Challenges of Manual Documentation" },
      {
        type: "paragraph",
        text: "Scattered files, duplicate records and inconsistent naming conventions can make it difficult to retrieve important information when required.",
      },
      { type: "heading", text: "Creating a Scalable System" },
      {
        type: "list",
        items: [
          "Create standard document categories.",
          "Use consistent naming conventions.",
          "Assign document ownership.",
          "Maintain year-wise records.",
          "Establish review and approval processes.",
          "Use centralised digital storage.",
        ],
      },
      { type: "heading", text: "The Role of Digital Tools" },
      {
        type: "paragraph",
        text: "Digital platforms can simplify document collection, storage, tracking and retrieval. They also help teams collaborate more effectively.",
      },
    ],
  },
  {
    slug: "understanding-seven-sqaaf-domains",
    title: "Understanding the Seven SQAAF Domains",
    tag: "NAAC",
    category: "Quality Framework",
    image: "/assets/blog-1.webp",
    author: "Luneblaze Team",
    date: "July 2026",
    readTime: "3 min read",
    excerpt:
      "A practical starting point for organising whole-school quality work.",
    content: [
      {
        type: "paragraph",
        text: "School quality is not defined by a single parameter. It is built through a combination of academic practices, leadership, infrastructure, student development and continuous improvement.",
      },
      { type: "heading", text: "What is SQAAF?" },
      {
        type: "paragraph",
        text: "The School Quality Assessment and Assurance Framework provides schools with a structured approach to evaluate their performance, identify gaps and work towards measurable improvement.",
      },
      { type: "heading", text: "Understanding the Seven Domains" },
      {
        type: "paragraph",
        text: "The seven domains help institutions review different aspects of school functioning. Each domain focuses on a specific area and contributes to the overall quality of education.",
      },
      {
        type: "list",
        items: [
          "Curriculum, pedagogy and assessment",
          "Infrastructure and learning resources",
          "Human resources and professional development",
          "Inclusive practices and student support",
          "School leadership and management",
          "Governance and community participation",
          "Student outcomes and holistic development",
        ],
      },
      { type: "heading", text: "Why Do These Domains Matter?" },
      {
        type: "paragraph",
        text: "A domain-based approach helps schools organise their evidence, evaluate existing practices and identify areas that require attention. It also makes quality improvement more systematic and measurable.",
      },
      {
        type: "quote",
        text: "Quality improvement begins with understanding where your institution stands today.",
      },
      { type: "heading", text: "How Schools Can Get Started" },
      {
        type: "paragraph",
        text: "Schools can begin by reviewing their existing practices, collecting relevant evidence, involving stakeholders and preparing an improvement plan based on identified gaps.",
      },
    ],
  },
  {
    slug: "building-evidence-that-holds-up-under-review",
    title: "Building Evidence That Holds Up Under Review",
    tag: "QUALITY",
    category: "Evidence Management",
    image: "/assets/blog-2.webp",
    author: "Luneblaze Team",
    date: "July 2026",
    readTime: "4 min read",
    excerpt: "Connect records to the practices they demonstrate.",
    content: [
      {
        type: "paragraph",
        text: "Evidence plays an important role in institutional assessment. It demonstrates how policies, processes and practices are implemented in an institution.",
      },
      { type: "heading", text: "Why Evidence Matters" },
      {
        type: "paragraph",
        text: "Well-organised evidence helps institutions support their claims, maintain transparency and respond confidently during internal and external reviews.",
      },
      { type: "heading", text: "Build a Structured Evidence System" },
      {
        type: "list",
        items: [
          "Identify the evidence required for each criterion.",
          "Assign responsibility for collecting documents.",
          "Maintain a consistent naming convention.",
          "Keep records organised by academic year.",
          "Review documents regularly for accuracy.",
        ],
      },
      { type: "heading", text: "Maintain Evidence Throughout the Year" },
      {
        type: "paragraph",
        text: "Instead of collecting documents at the last moment, institutions should maintain evidence continuously. This reduces pressure and improves the reliability of documentation.",
      },
    ],
  },
  {
    slug: "keeping-iqac-work-connected",
    title: "Keeping IQAC Work Connected",
    tag: "NABET",
    category: "Institutional Management",
    image: "/assets/blog-3.webp",
    author: "Luneblaze Team",
    date: "June 2026",
    readTime: "3 min read",
    excerpt:
      "Bring meetings, evidence and improvement into one working cycle.",
    content: [
      {
        type: "paragraph",
        text: "The Internal Quality Assurance Cell (IQAC) plays an important role in promoting continuous quality improvement within higher education institutions.",
      },
      { type: "heading", text: "Why Coordination Is Important" },
      {
        type: "paragraph",
        text: "IQAC activities often involve multiple departments, committees and stakeholders. Without coordination, important information can become scattered.",
      },
      { type: "heading", text: "Creating Connected Workflows" },
      {
        type: "list",
        items: [
          "Maintain a central activity calendar.",
          "Coordinate departmental responsibilities.",
          "Document meetings and action points.",
          "Track quality initiatives.",
          "Review progress periodically.",
        ],
      },
      { type: "heading", text: "Move Towards Continuous Improvement" },
      {
        type: "paragraph",
        text: "A connected workflow helps IQAC teams move beyond documentation and focus on meaningful institutional improvements.",
      },
    ],
  },
  {
    slug: "setting-up-your-clt-and-focus-groups",
    title: "Setting Up Your CLT and Focus Groups",
    tag: "SQAAF",
    category: "Team Management",
    image: "/assets/blog-in-3.webp",
    author: "Luneblaze Team",
    date: "July 6, 2026",
    readTime: "3 min read",
    excerpt:
      "Make quality work a shared responsibility.",
    content: [
      {
        type: "paragraph",
        text: "Quality work moves faster when it is shared. A clear CLT and focus-group structure gives every domain an owner.",
      },
      { type: "heading", text: "Start with leadership ownership" },
      {
        type: "paragraph",
        text: "A quality team needs a clear purpose and the support of institutional leadership. Agree what the team will coordinate and how progress will be reviewed.",
      },
      { type: "heading", text: "Assign domain responsibilities" },
      {
        type: "paragraph",
        text: "Build focus groups around relevant responsibilities. Give each group clear ownership of evidence, implementation activities and updates for its domain.",
      },
      {
        type: "quote",
        text: "Build focus groups around relevant responsibilities.",
      },
      { type: "heading", text: "Make meetings useful" },
      {
        type: "paragraph",
        text: "Use meetings to resolve gaps and agree actions. Record decisions, owners and review dates so follow-through can be checked at the next meeting.",
      },
      { type: "heading", text: "Build participation" },
      {
        type: "paragraph",
        text: "Provide orientation and practical training. Help staff understand how their existing work contributes to institutional quality, and use feedback to improve the workflow.",
      },
    ],
  },
  {
    slug: "connecting-outcomes-with-improvement",
    title: "Connecting Outcomes with Improvement",
    tag: "NBA",
    category: "Academic Quality",
    image: "/assets/blog-1.webp",
    author: "Luneblaze Team",
    date: "October 25, 2026",
    readTime: "4 min read",
    excerpt: "Use programme evidence to guide the next action.",
    content: [
      {
        type: "paragraph",
        text: "Assessment outcomes provide valuable information about institutional performance. However, their real value comes from using them to guide improvement.",
      },
      { type: "heading", text: "Understanding Outcome Analysis" },
      {
        type: "paragraph",
        text: "Outcome analysis helps institutions understand whether their academic and institutional objectives are being achieved.",
      },
      { type: "heading", text: "Turn Findings into Action" },
      {
        type: "list",
        items: [
          "Review the available assessment data.",
          "Identify gaps and improvement areas.",
          "Understand the possible reasons behind gaps.",
          "Define measurable improvement actions.",
          "Assign responsibility and timelines.",
          "Monitor progress and review outcomes.",
        ],
      },
      {
        type: "quote",
        text: "Assessment becomes meaningful when its findings lead to measurable action.",
      },
    ],
  },
  {
    slug: "collecting-ranking-data-all-year",
    title: "Collecting Ranking Data All Year",
    tag: "NIRF",
    category: "Data Management",
    image: "/assets/blog-4.png",
    author: "Luneblaze Team",
    date: "October 20, 2026",
    readTime: "5 min read",
    excerpt:
      "Make institutional reporting more coordinated and traceable.",
    content: [
      {
        type: "paragraph",
        text: "Ranking-related data is generated across different departments throughout the academic year. Collecting it continuously can make the reporting process more manageable.",
      },
      { type: "heading", text: "Why Year-Round Data Collection Matters" },
      {
        type: "paragraph",
        text: "Last-minute data collection can result in missing information, inconsistent records and unnecessary pressure on departments.",
      },
      { type: "heading", text: "Create a Data Collection Calendar" },
      {
        type: "list",
        items: [
          "Identify all required data points.",
          "Map each data point to its responsible department.",
          "Set collection deadlines.",
          "Validate data periodically.",
          "Maintain supporting documents.",
          "Review completeness before submission.",
        ],
      },
      { type: "heading", text: "Improve Data Accuracy" },
      {
        type: "paragraph",
        text: "Regular validation and clear ownership help institutions maintain reliable data throughout the year.",
      },
    ],
  },
  {
    slug: "building-quality-processes-that-last",
    title: "Building Quality Processes That Last",
    tag: "NABET",
    category: "Continuous Improvement",
    image: "/assets/blog-5.png",
    author: "Luneblaze Team",
    date: "October 15, 2026",
    readTime: "6 min read",
    excerpt: "Connect policies, daily practice and regular review.",
    content: [
      {
        type: "paragraph",
        text: "Quality assurance should not be treated as a one-time activity. Institutions need consistent processes that support continuous monitoring and improvement.",
      },
      { type: "heading", text: "Build Processes Around Clear Objectives" },
      {
        type: "paragraph",
        text: "Every quality initiative should have a defined objective, responsible team and measurable outcome.",
      },
      { type: "heading", text: "Elements of Sustainable Quality Processes" },
      {
        type: "list",
        items: [
          "Clearly documented procedures.",
          "Defined roles and responsibilities.",
          "Consistent monitoring mechanisms.",
          "Regular stakeholder participation.",
          "Evidence-based decision-making.",
          "Periodic evaluation and improvement.",
        ],
      },
      { type: "heading", text: "Make Improvement a Continuous Practice" },
      {
        type: "paragraph",
        text: "When quality processes become part of everyday institutional operations, improvement becomes more sustainable and effective.",
      },
    ],
  },
];

export default function BlogDetailPage({ params }) {
  const [slug, setSlug] = useState(null);
  const progressRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    // params may be a Promise (Next 15) or a plain object
    Promise.resolve(params).then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    const onScroll = () => {
      const fill = progressRef.current;
      const body = bodyRef.current;
      if (!fill || !body) return;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p =
        total > 0
          ? Math.min(1, Math.max(0, -r.top / total))
          : r.top < 0
          ? 1
          : 0;
      fill.style.width = (p * 100).toFixed(2) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!slug) return null;
  const blog = BLOGS.find((item) => item.slug === slug);
  if (!blog) notFound();

  const relatedBlogs = BLOGS.filter((item) => item.slug !== blog.slug).slice(0, 4);
  const shareUrl = `https://luneblaze.com/blog/${blog.slug}`;

  const renderContent = (block, index) => {
    switch (block.type) {
      case "heading":
        return (
          <h2
            key={index}
            className="mt-[clamp(28px,3.2vw,42px)] text-[clamp(21px,2.3vw,30px)] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#101E21]"
          >
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p
            key={index}
            className="mt-3.5 text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]"
          >
            {block.text}
          </p>
        );
      case "quote":
        return (
          <div
            key={index}
            className="mt-[clamp(24px,2.6vw,34px)] rounded-[10px] border border-[#DBEDEF] bg-[#EDF7F8] px-5 py-[18px]"
          >
            <p className="m-0 text-[14.5px] font-semibold leading-[1.68] text-[#0B3A40]">
              {block.text}
            </p>
          </div>
        );
      case "list":
        return (
          <ul
            key={index}
            className="mt-4 list-disc space-y-2.5 pl-[22px] text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]"
          >
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  const socialIconBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white transition-colors";

  return (
    <>
      {/* Read progress bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[96] h-[3px] bg-transparent"
      >
        <span
          ref={progressRef}
          className="block h-full w-0 rounded-r-[3px] bg-gradient-to-r from-[#17AEB9] to-[#5B5BD6] transition-[width] duration-100 ease-linear"
        />
      </div>

      <div className="relative max-w-full bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section
          id="hero"
          className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-[clamp(20px,4vw,52px)] pb-[clamp(20px,2.4vw,32px)] pt-[clamp(60px,4vw,120px)]"
        >
          <div className="relative mx-auto max-w-[840px]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] hover:text-[#0E8B95]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M9 5L4 12l5 7" />
                <path d="M4 12h16" />
              </svg>
              Back to Insights
            </Link>

            <h1 className="mt-6 text-[clamp(29px,3.8vw,50px)] font-extrabold leading-[1.08] tracking-[-0.036em] text-[#101E21]">
              {blog.title}
            </h1>

            <div className="mt-[clamp(22px,2.4vw,30px)] flex flex-wrap items-center gap-[clamp(18px,3vw,44px)] border-b border-[#E4EEEF] pb-[clamp(22px,2.4vw,30px)]">
              <span className="flex items-center gap-2.5">
                <span className="block h-[34px] w-[34px] shrink-0 rounded-full border border-[#DCEAEC] bg-[#EDF7F8]" />
                <span className="text-[13px] font-bold text-[#152A2E]">{blog.author}</span>
              </span>
              <span className="flex items-baseline gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#8A9B9E]">Category</span>
                <span className="text-[13px] font-bold text-[#152A2E]">{blog.category}</span>
              </span>
              <span className="flex items-baseline gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#8A9B9E]">Date</span>
                <span className="text-[13px] font-bold text-[#152A2E]">{blog.date}</span>
              </span>
              <span className="flex items-baseline gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#8A9B9E]">Read</span>
                <span className="text-[13px] font-bold text-[#152A2E]">{blog.readTime}</span>
              </span>
            </div>
          </div>
        </section>

        {/* ── Body ───────────────────────────────────────────── */}
        <section
          id="body"
          ref={bodyRef}
          className="relative overflow-hidden rounded-[10px] bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] pb-[clamp(40px,4.6vw,68px)]"
        >
          <div className="relative mx-auto max-w-[840px]">
            {/* Top share */}
            <div className="ml-auto mb-3.5 flex items-center justify-end gap-[7px]">
              <span className="mr-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9BABAE]">
                Share
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} — ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className={`${socialIconBtn} text-[#25936B] hover:bg-[#25936B] hover:text-white`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className={`${socialIconBtn} text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" />
                </svg>
              </a>
            </div>

            {/* Featured image */}
            <div className="relative mt-[clamp(26px,3vw,40px)] aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-[#EDF4F5]">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 840px"
                className="object-cover"
              />
            </div>

            {/* Prose */}
            <div className="mt-[clamp(28px,3.2vw,44px)]">
              {blog.content.map((block, i) => renderContent(block, i))}
            </div>

            {/* Bottom share */}
            <div className="mt-[clamp(30px,3.4vw,44px)] flex flex-wrap items-center gap-3 border-t border-[#E4EEEF] pt-[clamp(22px,2.4vw,30px)]">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A9B9E]">
                Share
              </span>
              <span className="flex items-center gap-[7px]">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} — ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white text-[#25936B] hover:bg-[#25936B] hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[4px] bg-white text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" />
                  </svg>
                </a>
              </span>
              <Link
                href="/newsletter"
                className="ml-auto inline-flex items-center gap-2 rounded-[4px] border border-[#DCEAEC] bg-white px-5 py-3 text-[13.5px] font-bold text-[#152A2E]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-[#0E8B95]"
                >
                  <path d="M3 7.5A2 2 0 0 1 5 5.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
                  <path d="M3.5 7l8.5 6 8.5-6" />
                </svg>
                Get new insights by email
              </Link>
            </div>
          </div>
        </section>

        {/* ── Other Blogs ────────────────────────────────────── */}
        <section
          id="more"
          className="relative mt-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[10px] border border-[#DBEDEF] bg-[#EDF7F8] px-[clamp(20px,4vw,52px)] py-[clamp(42px,4.8vw,70px)]"
        >
          <div className="relative mx-auto max-w-[1320px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-[560px]">
                <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#152A2E]">
                  Other Blogs
                </h2>
                <p className="mt-3 text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.62] text-[#5F7175]">
                  More writing from the Luneblaze quality team.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#DCEAEC] bg-white px-5 py-3 text-[13.5px] font-bold text-[#152A2E]"
              >
                View all
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h14" />
                  <path d="M12 6l6 6-6 6" />
                </svg>
              </Link>
            </div>

            <div className="mt-[clamp(24px,2.8vw,36px)] grid grid-cols-1 gap-[clamp(11px,1.3vw,16px)] sm:grid-cols-2 lg:grid-cols-4">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-white"
                >
                  <span className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#EDF4F5]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                    />
                    <span className="absolute left-[11px] top-[11px] inline-flex items-center rounded-[4px] bg-[#E4F5F6] px-[11px] py-[5px] text-[9.5px] font-extrabold tracking-[0.09em] text-[#0E8B95]">
                      {item.tag}
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col gap-[7px] px-4 pb-[17px] pt-[15px]">
                    <span className="text-[11px] font-bold text-[#8A9B9E]">{item.date}</span>
                    <span className="block text-[14.5px] font-extrabold leading-[1.3] tracking-[-0.018em] text-[#152A2E] group-hover:text-[#0E8B95]">
                      {item.title}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}