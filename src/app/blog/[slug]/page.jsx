"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import blogService from "@/services/blogService";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "https://api.luneblaze.com/";

const getImageUrl = (path) => {
  if (!path) return "/assets/blog-1.webp";

  const value = String(path).trim();

  if (/^https?:\/\//i.test(value)) return value;

  return `${IMAGE_BASE_URL.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
};

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getReadTime = (content) => {
  if (!content) return "1 min read";

  const plainText =
    typeof content === "string"
      ? content.replace(/<[^>]*>/g, " ")
      : JSON.stringify(content);

  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const parseTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags;

  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Tags may be stored as a comma-separated string.
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const parseContent = (content) => {
  if (!content) return null;

  if (Array.isArray(content)) return content;

  if (typeof content === "object") {
    if (Array.isArray(content.blocks)) return content.blocks;
    return content;
  }

  const value = String(content).trim();

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.blocks)) return parsed.blocks;
  } catch {
    // Content is likely HTML or plain text.
  }

  return value;
};

const renderContentBlock = (block, index) => {
  if (!block) return null;

  if (typeof block === "string") {
    return (
      <p
        key={index}
        className="mt-4 text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]"
      >
        {block}
      </p>
    );
  }

  const type = String(block.type || block.block_type || "").toLowerCase();
  const text = block.text || block.content || block.value || "";

  if (type === "heading" || type === "h2" || type === "h3") {
    return (
      <h2
        key={index}
        className="mt-[clamp(28px,3.2vw,42px)] text-[clamp(21px,2.3vw,30px)] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#101E21]"
      >
        {text}
      </h2>
    );
  }

  if (type === "quote" || type === "blockquote") {
    return (
      <div
        key={index}
        className="mt-[clamp(24px,2.6vw,34px)] rounded-[10px] border border-[#DBEDEF] bg-[#EDF7F8] px-5 py-[18px]"
      >
        <p className="m-0 text-[14.5px] font-semibold leading-[1.68] text-[#0B3A40]">
          {text}
        </p>
      </div>
    );
  }

  if (type === "list" || type === "ul" || type === "ol") {
    const items = block.items || block.list || [];

    return (
      <ul
        key={index}
        className="mt-4 list-disc space-y-2.5 pl-[22px] text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]"
      >
        {items.map((item, itemIndex) => (
          <li key={itemIndex}>
            {typeof item === "string" ? item : item.text || item.value || ""}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      key={index}
      className="mt-3.5 whitespace-pre-line text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]"
    >
      {text || JSON.stringify(block)}
    </p>
  );
};

export default function BlogDetailPage({ params }) {
  const [slug, setSlug] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const progressRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    let active = true;

    Promise.resolve(params).then((resolvedParams) => {
      if (active) setSlug(resolvedParams?.slug || "");
    });

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    let active = true;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await blogService.getBlogs(0, 500);

        if (response?.status !== "success" || !Array.isArray(response.data)) {
          throw new Error(response?.message || "Unable to fetch blogs.");
        }

        const allBlogs = response.data;
        const selectedBlog = allBlogs.find((item) => {
          // Listing URLs use: /blog/<title-slug>-<blog-id>.
          // Also support old title-only URLs and direct numeric ID URLs.
          const titleSlug = slugify(item.title);
          const subtitleSlug = slugify(item.subtitle);
          const titleWithId = `${titleSlug}-${item.id}`;
          const subtitleWithId = subtitleSlug
            ? `${subtitleSlug}-${item.id}`
            : "";

          return (
            titleWithId === slug ||
            subtitleWithId === slug ||
            titleSlug === slug ||
            subtitleSlug === slug ||
            String(item.id) === slug
          );
        });

        if (!active) return;

        setBlogs(allBlogs);
        setBlog(selectedBlog || null);

        if (!selectedBlog) {
          setError("The requested blog could not be found.");
        }
      } catch (err) {
        if (active) {
          setError(err?.message || "Something went wrong while loading the blog.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBlog();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const fill = progressRef.current;
      const body = bodyRef.current;

      if (!fill || !body) return;

      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0
          ? Math.min(1, Math.max(0, -rect.top / total))
          : rect.top < 0
            ? 1
            : 0;

      fill.style.width = `${(progress * 100).toFixed(2)}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [blog]);

  const tags = useMemo(() => parseTags(blog?.tags), [blog?.tags]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];

    return blogs
      .filter((item) => String(item.id) !== String(blog.id))
      .slice(0, 4);
  }, [blogs, blog]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#FBFCFC]">
        <p className="text-sm font-semibold text-[#5F7175]">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-[#FBFCFC] px-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#152A2E]">
          Blog not found
        </h1>
        <p className="text-sm text-[#5F7175]">
          {error || "The requested blog is not available."}
        </p>
        <Link
          href="/blog"
          className="rounded-md bg-[#17AEB9] px-5 py-3 text-sm font-bold text-white"
        >
          Back to blogs
        </Link>
      </div>
    );
  }

  const title = blog.title || "Untitled blog";
  const description = blog.subtitle || "";
  const category = blog.section || tags[0] || "BLOG";
  const image = getImageUrl(blog.cover_image || blog.image);
  const author = blog.organisation || "Luneblaze Team";
  const date = formatDate(blog.created_at);
  const readTime = getReadTime(blog.content);
  const content = parseContent(blog.content);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `https://luneblaze.com/blog/${slug}`;

  const socialIconBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white transition-colors";

  return (
    <>
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

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-[4px] bg-[#E4F5F6] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#0E8B95]">
                {category}
              </span>
              {tags
                .filter((tag) => String(tag).toLowerCase() !== String(category).toLowerCase())
                .map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-[4px] border border-[#DCEAEC] px-3 py-1.5 text-[10px] font-bold text-[#5F7175]"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <h1 className="mt-5 text-[clamp(29px,3.8vw,50px)] font-extrabold leading-[1.08] tracking-[-0.036em] text-[#101E21]">
              {title}
            </h1>

            {description && (
              <p className="mt-4 text-[clamp(15px,1.2vw,18px)] leading-[1.7] text-[#5F7175]">
                {description}
              </p>
            )}

            <div className="mt-[clamp(22px,2.4vw,30px)] flex flex-wrap items-center gap-[clamp(18px,3vw,44px)] border-b border-[#E4EEEF] pb-[clamp(22px,2.4vw,30px)]">
              <span className="flex items-center gap-2.5">
                <span className="block h-[34px] w-[34px] shrink-0 rounded-full border border-[#DCEAEC] bg-[#EDF7F8]" />
                <span className="text-[13px] font-bold text-[#152A2E]">
                  {author}
                </span>
              </span>

              {date && (
                <span className="flex items-baseline gap-2.5">
                  <span className="text-[11.5px] font-semibold text-[#8A9B9E]">
                    Date
                  </span>
                  <span className="text-[13px] font-bold text-[#152A2E]">
                    {date}
                  </span>
                </span>
              )}

              <span className="flex items-baseline gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#8A9B9E]">
                  Read
                </span>
                <span className="text-[13px] font-bold text-[#152A2E]">
                  {readTime}
                </span>
              </span>

              {blog.page && (
                <span className="flex items-baseline gap-2.5">
                  <span className="text-[11.5px] font-semibold text-[#8A9B9E]">
                    Page
                  </span>
                  <span className="text-[13px] font-bold text-[#152A2E]">
                    {blog.page}
                  </span>
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          id="body"
          ref={bodyRef}
          className="relative overflow-hidden rounded-[10px] bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] pb-[clamp(40px,4.6vw,68px)]"
        >
          <div className="relative mx-auto max-w-[840px]">
            <div className="ml-auto mb-3.5 flex items-center justify-end gap-[7px]">
              <span className="mr-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9BABAE]">
                Share
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className={`${socialIconBtn} text-[#25936B] hover:bg-[#25936B] hover:text-white`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.09 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
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

            <div className="relative mt-[clamp(26px,3vw,40px)] aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-[#EDF4F5]">
              <img
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/assets/blog-1.webp";
                }}
              />
            </div>

            <article className="mt-[clamp(28px,3.2vw,44px)]">
              {Array.isArray(content) ? (
                content.map((block, index) => renderContentBlock(block, index))
              ) : typeof content === "string" &&
                /<\/?[a-z][\s\S]*?>/i.test(content) ? (
                <div
                  className="blog-content text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257] [&_p]:mt-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#17AEB9] [&_blockquote]:pl-4 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="whitespace-pre-line text-[clamp(15px,1.18vw,17px)] leading-[1.78] text-[#3E5257]">
                  {content || "No blog content is available."}
                </p>
              )}
            </article>

            <div className="mt-[clamp(30px,3.4vw,44px)] flex flex-wrap items-center gap-3 border-t border-[#E4EEEF] pt-[clamp(22px,2.4vw,30px)]">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A9B9E]">
                Share
              </span>
              <span className="flex items-center gap-[7px]">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white text-[#25936B] hover:bg-[#25936B] hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.09 1.24.6 1.46.7.21.11.35.17.4.26.05.1-.18.55-.18 1.2Z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[4px] border border-[#DCEAEC] bg-white text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
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
                Get new insights by email
              </Link>
            </div>
          </div>
        </section>

        {relatedBlogs.length > 0 && (
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
                  href="/blogs"
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
                {relatedBlogs.map((item) => {
                  const relatedSlug = `${slugify(item.title)}-${item.id}`;

                  return (
                    <Link
                      key={item.id}
                      href={`/blog/${relatedSlug}`}
                      className="group flex flex-col overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-white"
                    >
                      <span className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#EDF4F5]">
                        <img
                          src={getImageUrl(item.cover_image || item.image)}
                          alt={item.title || "Blog image"}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/assets/blog-1.webp";
                          }}
                        />
                        <span className="absolute left-[11px] top-[11px] inline-flex items-center rounded-[4px] bg-[#E4F5F6] px-[11px] py-[5px] text-[9.5px] font-extrabold tracking-[0.09em] text-[#0E8B95]">
                          {item.section || parseTags(item.tags)[0] || "BLOG"}
                        </span>
                      </span>
                      <span className="flex flex-1 flex-col gap-[7px] px-4 pb-[17px] pt-[15px]">
                        <span className="text-[11px] font-bold text-[#8A9B9E]">
                          {formatDate(item.created_at)}
                        </span>
                        <span className="block text-[14.5px] font-extrabold leading-[1.3] tracking-[-0.018em] text-[#152A2E] group-hover:text-[#0E8B95]">
                          {item.title}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}