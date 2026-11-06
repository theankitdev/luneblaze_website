// src/components/blog/BlogListSection.jsx
"use client";

import { useState } from "react";
import BlogFilters from "./BlogFilters";
import FeaturedBlogCard from "./FeaturedBlogCard";
import BlogCard from "./BlogCard";

const ALL_POSTS = [
  { img: "/assets/blog-in-1.webp", title: "Understanding the Seven SQAAF Domains", desc: "A practical starting point for organising whole-school quality work.", tag: "SQAAF", cat: "sqaaf", meta: "3 min read", href: "/blog-domains.html" },
  { img: "/assets/blog-in-2.webp", title: "Building Evidence That Holds Up Under Review", desc: "Connect records to the practices they demonstrate.", tag: "QUALITY", cat: "quality", meta: "4 min read", href: "/blog-evidence.html" },
  { img: "/assets/blog-in-3.webp", title: "Setting Up Your CLT and Focus Groups", desc: "Make quality work a shared responsibility.", tag: "SQAAF", cat: "sqaaf", meta: "5 min read", href: "/blog-teams.html" },
  { img: "/assets/blog-2.webp", title: "Documentation Systems That Scale", desc: "A central repository that keeps working as your institution grows.", tag: "QUALITY", cat: "quality", meta: "6 min read", href: "/blog-documentation.html" },
  { img: "/assets/blog-3.webp", title: "Keeping IQAC Work Connected", desc: "Bring meetings, evidence and improvement into one working cycle.", tag: "NAAC", cat: "naac", meta: "3 min read", href: "/blog-iqac.html" },
  { img: "/assets/blog-1.webp", title: "Connecting Outcomes with Improvement", desc: "Use programme evidence to guide the next action.", tag: "NBA", cat: "nba", meta: "4 min read", href: "/blog-outcomes.html" },
  { img: "/assets/blog-4.png", title: "Collecting Ranking Data All Year", desc: "Make institutional reporting more coordinated and traceable.", tag: "NIRF", cat: "nirf", meta: "5 min read", href: "/blog-ranking-data.html" },
  { img: "/assets/blog-5.png", title: "Building Quality Processes That Last", desc: "Connect policies, daily practice and regular review.", tag: "NABET", cat: "nabet", meta: "6 min read", href: "/blog-processes.html" },
];

const FILTERS = [
  ["all", "All posts"],
  ["sqaaf", "SQAAF"],
  ["nabet", "NABET"],
  ["naac", "NAAC"],
  ["nba", "NBA"],
  ["nirf", "NIRF"],
  ["quality", "Quality"],
];

const PAGE_SIZE = 6;

export default function BlogListSection({items = ALL_POSTS}) {
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const matching = filter === "all" ? items : items.filter((x) => x.cat === filter);
  const shown = matching.slice(0, limit);
  const moreLeft = matching.length > shown.length;
  const allShown = matching.length > 0 && matching.length <= shown.length;
  const isEmpty = matching.length === 0;
  const hasFeatured = filter === "all" || filter === "sqaaf";

  const filters = FILTERS.map(([key, label]) => ({
    key,
    label,
    count: key === "all" ? items.length : items.filter((x) => x.cat === key).length,
    on: key === filter,
    pick: () => {
      setFilter(key);
      setLimit(PAGE_SIZE);
    },
  }));

  const activeLabel = filter === "all" ? null : FILTERS.find(([k]) => k === filter)?.[1];
  const resultLabel = matching.length === 0
    ? `No posts in ${activeLabel || "this category"}`
    : `${matching.length} ${matching.length === 1 ? "post" : "posts"}${activeLabel ? ` in ${activeLabel}` : ""}`;

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(38px,4.4vw,64px) clamp(20px,4vw,52px)",
        background: "#F9FCFD",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.36,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 40s linear infinite",
          }}
        />
      </div>

      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto" }}>
        <BlogFilters
          filters={filters}
          resultLabel={resultLabel}
          filtered={filter !== "all"}
          onClear={() => {
            setFilter("all");
            setLimit(PAGE_SIZE);
          }}
        />

        {hasFeatured && <FeaturedBlogCard />}

        {isEmpty && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: "clamp(38px,5vw,64px) 20px",
              background: "#fff",
              border: "1px dashed #DCEAEC",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 10,
                background: "#F2F9FA",
                color: "#0E8B95",
              }}
            >
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.018em", color: "#152A2E" }}>
                Nothing here yet
              </div>
              <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.6, color: "#5F7175", maxWidth: "38ch" }}>
                We are still publishing in this category. Clear the filter to see everything available.
              </p>
            </div>
            <button
              onClick={() => { setFilter("all"); setLimit(PAGE_SIZE); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#17AEB9",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontFamily: "inherit",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Show everything
            </button>
          </div>
        )}

        {!isEmpty && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,minmax(0,1fr))",
              gap: "clamp(11px,1.3vw,16px)",
            }}
          >
            {shown.map((it) => (
              <BlogCard key={it.href} item={it} />
            ))}
          </div>
        )}

        {!isEmpty && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 13, marginTop: "clamp(26px,3vw,38px)" }}>
            {moreLeft && (
              <button
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: "#17AEB9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 27px",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 12px 28px -10px rgba(23,174,185,.85)",
                  transition: "transform .28s cubic-bezier(.22,.8,.2,1),box-shadow .28s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px -14px rgba(23,174,185,.95)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 12px 28px -10px rgba(23,174,185,.85)";
                }}
              >
                View More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M6 13l6 6 6-6" />
                </svg>
              </button>
            )}
            {allShown && (
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#66787C" }}>
                That is everything published so far — more sessions are on the way.
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 600, color: "#66787C" }}>
              Showing {shown.length} of {matching.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}