
// src/app/news/page.jsx

import BlogHero from "@/components/blog/BlogHero";
import NewsListSection from "@/components/news/NewsListSection";
import BlogJoinSection from "@/components/blog/BlogJoinSection";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";

const ALL_NEWS = [
  {
    img: "/assets/group-schools.png",
    title: "Group quality visibility",
    desc: "Monitor institutions through a shared leadership dashboard.",
    tag: "PLATFORM",
    cat: "platform",
    meta: "Oct 6, 2026",
    href: "/news/group-quality-visibility",
  },
  {
    img: "/assets/blog-in-3.webp",
    title: "Classroom observations & teaching assessments",
    desc: "Bring teaching practice into the quality conversation.",
    tag: "PLATFORM",
    cat: "platform",
    meta: "Sep 24, 2026",
    href: "/news/classroom-observations-teaching-assessments",
  },
  {
    img: "/assets/blog-in-2.webp",
    title: "Readiness Score™ explained",
    desc: "Three practical parameters for continuous readiness monitoring.",
    tag: "PLATFORM",
    cat: "platform",
    meta: "Sep 12, 2026",
    href: "/news/readiness-score-explained",
  },
  {
    img: "/assets/blog-4.png",
    title: "SQAAF cycle announcements and framework revisions",
    desc: "A plain-language summary whenever the framework or submission timeline changes.",
    tag: "SQAAF",
    cat: "sqaaf",
    meta: "Coming soon",
    href: "/news/sqaaf-cycle-announcements",
  },
  {
    img: "/assets/blog-6.png",
    title: "NAAC grading and assessment process updates",
    desc: "Changes to criteria weightage, DVV rules and the peer team process, as they land.",
    tag: "NAAC",
    cat: "naac",
    meta: "Coming soon",
    href: "/news/naac-grading-assessment-updates",
  },
  {
    img: "/assets/blog-5.png",
    title: "New features in the Luneblaze dashboard",
    desc: "Release notes covering analytics, reporting and evidence workflow improvements.",
    tag: "PLATFORM",
    cat: "platform",
    meta: "Coming soon",
    href: "/news/luneblaze-dashboard-features",
  },
  {
    img: "/assets/blog-1.webp",
    title: "NBA accreditation cycle notices",
    desc: "Tier changes, SAR revisions and submission window announcements.",
    tag: "NBA",
    cat: "nba",
    meta: "Coming soon",
    href: "/news/nba-accreditation-cycle-notices",
  },
  {
    img: "/assets/blog-3.webp",
    title: "NIRF submission window and parameter changes",
    desc: "What moved in the ranking methodology, and what it means for your data.",
    tag: "NIRF",
    cat: "nirf",
    meta: "Coming soon",
    href: "/news/nirf-submission-window-updates",
  },
  {
    img: "/assets/blog-2.webp",
    title: "Institution milestones and accreditation results",
    desc: "Celebrating schools and colleges in our community as they reach the next level.",
    tag: "COMMUNITY",
    cat: "community",
    meta: "Coming soon",
    href: "/news/institution-milestones-accreditation-results",
  },
  {
    img: "/assets/blog-in-2.webp",
    title: "NABET standard revisions",
    desc: "Updates to the school accreditation standard and assessment process.",
    tag: "NABET",
    cat: "nabet",
    meta: "Coming soon",
    href: "/news/nabet-standard-revisions",
  },
  {
    img: "/assets/blog-in-3.webp",
    title: "Policy notes on educational quality",
    desc: "How national policy shifts affect quality assurance work on the ground.",
    tag: "POLICY",
    cat: "policy",
    meta: "Coming soon",
    href: "/news/policy-notes-educational-quality",
  },
  {
    img: "/assets/blog-in-5.webp",
    title: "Luneblaze in the press",
    desc: "Coverage, interviews and speaking appearances from the team.",
    tag: "COMMUNITY",
    cat: "community",
    meta: "Coming soon",
    href: "/news/luneblaze-in-the-press",
  },
  {
    img: "/assets/blog-in-1.webp",
    title: "Quarterly quality digest",
    desc: "Everything that changed across all five frameworks, in one read.",
    tag: "PLATFORM",
    cat: "platform",
    meta: "Coming soon",
    href: "/news/quarterly-quality-digest",
  },
];

const FILTERS = [
  ["all", "All updates"],
  ["sqaaf", "SQAAF"],
  ["nabet", "NABET"],
  ["naac", "NAAC"],
  ["nba", "NBA"],
  ["nirf", "NIRF"],
  ["platform", "Platform"],
  ["policy", "Policy"],
  ["community", "Community"],
];

export default function NewsPage() {
  return (
    <>
      <BlogHero
        breadcrumb="News"
        title="What's Happening in the"
        highlight="Quality Ecosystem"
        subtitle="Explore Luneblaze's capabilities and the work supporting institutional improvement."
      />

      <NewsListSection
        items={ALL_NEWS}
        filters={FILTERS}
        resultNoun="update"
        featured={
          <FeaturedBlogCard
            image="/assets/group-schools.png"
            title="SQAAF cycle announcements and framework revisions"
            description="Whenever CBSE revises the framework or shifts a submission timeline, we publish a plain-language summary of exactly what changed, which domains it touches and what your team needs to do differently."
            href="/news/sqaaf-cycle-announcements"
            badge="FRAMEWORK"
            eyebrow="LATEST"
            ctaLabel="Read update"
            meta={[
              { label: "Published as it happens", icon: "cal" },
              { label: "Plain-language summary", icon: "clock" },
              { label: "All five frameworks", icon: "user" },
            ]}
          />
        }
      />

      <BlogJoinSection
        title="Get Updates on WhatsApp"
        description="Join the Luneblaze quality group and get framework revisions, submission-window notices and platform releases the moment they are published."
        whatsappLabel="Join the WhatsApp Group"
      />
    </>
  );
}
