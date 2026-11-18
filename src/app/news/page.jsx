"use client";

import { useEffect, useState } from "react";

import BlogHero from "@/components/blog/BlogHero";
import NewsListSection from "@/components/news/NewsListSection";
import BlogJoinSection from "@/components/blog/BlogJoinSection";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";

import newsService from "@/services/newsService";

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

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const extractNews = (response) => {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.data,
    response?.news,
    response?.result,
    response?.data?.news,
    response?.data?.data,
    response?.result?.news,
  ];

  return candidates.find(Array.isArray) || [];
};

const formatNews = (news) => {
  return news.map((item) => {
    const title = item.title || item.subtitle || "Untitled News";

    const section = (
      item.section ||
      item.category ||
      "platform"
    ).toLowerCase();

    const tag = section.toUpperCase();

    return {
      id: item.news_id || item.id,
      img: newsService.getNewsImageUrl(
        item.source_img ||
        item.sourceImage ||
        item.image ||
        item.image_url
      ),
      title,
      desc:
        item.subtitle ||
        item.description ||
        item.details ||
        "",
      tag,
      cat: section,
      meta: item.date || item.created_at || "Recently published",
      href: `/news/${item.slug || slugify(title)}`,
    };
  });
};

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await newsService.getNews(0, 100);

      const newsData = extractNews(response);

      setNews(formatNews(newsData));
    } catch (err) {
      console.error("News Fetch Error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load news. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const featuredNews = news[0];

  return (
    <>
      <BlogHero
        breadcrumb="News"
        title="What's Happening in the"
        highlight="Quality Ecosystem"
        subtitle="Explore Luneblaze's capabilities and the work supporting institutional improvement."
      />

      {loading ? (
        <section className="py-20 text-center">
          <p className="text-gray-500">
            Loading latest news...
          </p>
        </section>
      ) : error ? (
        <section className="py-20 text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={fetchNews}
            className="mt-4 rounded-lg bg-black px-6 py-3 text-white"
          >
            Try Again
          </button>
        </section>
      ) : (
        <>
          <NewsListSection
            items={news}
            filters={FILTERS}
            resultNoun="update"
            featured={
              featuredNews ? (
                <FeaturedBlogCard
                  image={featuredNews.img}
                  title={featuredNews.title}
                  description={featuredNews.desc}
                  href={featuredNews.href}
                  badge={featuredNews.tag}
                  eyebrow="LATEST"
                  ctaLabel="Read update"
                  meta={[
                    {
                      label: featuredNews.meta,
                      icon: "cal",
                    },
                    {
                      label: "Latest news and updates",
                      icon: "clock",
                    },
                    {
                      label: featuredNews.tag,
                      icon: "user",
                    },
                  ]}
                />
              ) : null
            }
          />

          {news.length === 0 && (
            <section className="py-12 text-center">
              <p className="text-gray-500">
                No news available currently.
              </p>
            </section>
          )}
        </>
      )}

      <BlogJoinSection
        title="Get Updates on WhatsApp"
        description="Join the Luneblaze quality group and get framework revisions, submission-window notices and platform releases the moment they are published."
        whatsappLabel="Join the WhatsApp Group"
      />
    </>
  );
}
