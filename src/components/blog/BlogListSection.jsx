
"use client";

import { useEffect, useState } from "react";

import BlogFilters from "./BlogFilters";
import FeaturedBlogCard from "./FeaturedBlogCard";
import BlogCard from "./BlogCard";

import blogService from "@/services/blogService";

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

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "https://api.luneblaze.com/";

// Convert API response into frontend card structure
const mapBlog = (blog) => {
  const tags = String(blog.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const category = String(blog.section || tags[0] || "")
    .trim()
    .toLowerCase();

  const plainContent = String(blog.content || "").replace(
    /<[^>]*>/g,
    " "
  );

  const wordCount = plainContent
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const slug = String(blog.title || "blog")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: blog.id,
    slug: `${slug}-${blog.id}`,

    img: blog.image || "",
    coverImage: blog.cover_image || "",

    title: blog.title || "",
    desc: blog.subtitle || "",

    tag: blog.section || tags[0] || "BLOG",
    cat: category,

    meta: `${readingTime} min read`,

    content: blog.content || "",
    organisation: blog.organisation || "",
    tags,

    date: blog.created_at || "",
    page: blog.page,
    section: blog.section,
  };
};

export default function BlogListSection() {
  const [items, setItems] = useState([]);
  const [host, setHost] = useState(IMAGE_BASE_URL);

  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch blogs from CakePHP API
  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await blogService.getBlogs(0, 500);

        if (!isMounted) return;

        if (response.status === "success") {
          const formattedBlogs = (response.data || []).map(mapBlog);

          setItems(formattedBlogs);
          setHost(response.host || IMAGE_BASE_URL);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Blog fetching error:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load blogs. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter blogs by category
  const matching =
    filter === "all"
      ? items
      : items.filter((item) => item.cat === filter);

  // Show limited blogs
  const shown = matching.slice(0, limit);

  const moreLeft = matching.length > shown.length;

  const allShown =
    matching.length > 0 && matching.length <= shown.length;

  const isEmpty = matching.length === 0;

  const hasFeatured = filter === "all" || filter === "sqaaf";

  // Dynamic category counts
  const filters = FILTERS.map(([key, label]) => ({
    key,
    label,

    count:
      key === "all"
        ? items.length
        : items.filter((item) => item.cat === key).length,

    on: key === filter,

    pick: () => {
      setFilter(key);
      setLimit(PAGE_SIZE);
    },
  }));

  const activeLabel =
    filter === "all"
      ? null
      : FILTERS.find(([key]) => key === filter)?.[1];

  const resultLabel =
    matching.length === 0
      ? `No posts in ${activeLabel || "this category"}`
      : `${matching.length} ${
          matching.length === 1 ? "post" : "posts"
        }${activeLabel ? ` in ${activeLabel}` : ""}`;

  // Clear category filter
  const clearFilter = () => {
    setFilter("all");
    setLimit(PAGE_SIZE);
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(38px,4.4vw,64px) clamp(20px,4vw,52px)",
        background: "#F9FCFD",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
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

      <div
        style={{
          position: "relative",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Loading state */}
        {loading && (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#5F7175",
              fontSize: 14,
            }}
          >
            Loading blogs...
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#D14343",
              fontSize: 14,
            }}
          >
            {error}

            <button
              onClick={() => window.location.reload()}
              style={{
                display: "block",
                margin: "15px auto 0",
                padding: "10px 20px",
                background: "#17AEB9",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Category filters */}
            <BlogFilters
              filters={filters}
              resultLabel={resultLabel}
              filtered={filter !== "all"}
              onClear={clearFilter}
            />

            {/* Featured blog */}
            {hasFeatured && items.length > 0 && (
              <FeaturedBlogCard
    image={items[0].coverImage || items[0].img}
    title={items[0].title}
    description={items[0].desc}
    href={`/blog/${items[0].slug}`}
  />
            )}

            {/* Empty state */}
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
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M16.5 16.5L21 21" />
                  </svg>
                </span>

                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: "-.018em",
                      color: "#152A2E",
                    }}
                  >
                    Nothing here yet
                  </div>

                  <p
                    style={{
                      margin: "7px 0 0",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#5F7175",
                      maxWidth: "38ch",
                    }}
                  >
                    We are still publishing in this category. Clear the filter
                    to see everything available.
                  </p>
                </div>

                <button
                  onClick={clearFilter}
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
                    transition:
                      "transform .28s cubic-bezier(.22,.8,.2,1)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "none")
                  }
                >
                  Show everything
                </button>
              </div>
            )}

            {/* Blog cards */}
            {!isEmpty && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                  gap: "clamp(11px,1.3vw,16px)",
                }}
              >
                {shown.map((item) => (
                  <BlogCard key={item.id} item={item} host={host} />
                ))}
              </div>
            )}

            {/* View More */}
            {!isEmpty && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 13,
                  marginTop: "clamp(26px,3vw,38px)",
                }}
              >
                {moreLeft && (
                  <button
                    onClick={() =>
                      setLimit((current) => current + PAGE_SIZE)
                    }
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
                      boxShadow:
                        "0 12px 28px -10px rgba(23,174,185,.85)",
                      transition:
                        "transform .28s cubic-bezier(.22,.8,.2,1),box-shadow .28s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 40px -14px rgba(23,174,185,.95)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px -10px rgba(23,174,185,.85)";
                    }}
                  >
                    View More

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M6 13l6 6 6-6" />
                    </svg>
                  </button>
                )}

                {allShown && (
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#66787C",
                    }}
                  >
                    That is everything published so far — more sessions are
                    on the way.
                  </span>
                )}

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#66787C",
                  }}
                >
                  Showing {shown.length} of {matching.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
