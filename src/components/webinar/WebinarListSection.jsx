
"use client";

import { useState } from "react";
import BlogFilters from "@/components/blog/BlogFilters";
import WebinarCard from "./WebinarCard";
import FeaturedWebinarCard from "./FeaturedWebinarCard";

const FILTERS = [
  ["all", "All webinars"],
  ["sqaaf", "SQAAF"],
  ["nabet", "NABET"],
  ["naac", "NAAC"],
  ["nba", "NBA"],
  ["nirf", "NIRF"],
  ["quality", "Quality"],
];

const PAGE_SIZE = 6;

export default function WebinarListSection({ items = [] }) {
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const matching =
    filter === "all"
      ? items
      : items.filter((item) => item.cat === filter);

  const hasFeatured = filter === "all" || filter === "sqaaf";

  // Prefer an SQAAF webinar for the featured section.
  const featuredItem = hasFeatured
    ? matching.find((item) => item.cat === "sqaaf") || matching[0]
    : null;

  // Remove featured webinar from the normal card list.
  const regularItems = featuredItem
    ? matching.filter((item) => item.id !== featuredItem.id)
    : matching;

  const shown = regularItems.slice(0, limit);
  const moreLeft = regularItems.length > shown.length;

  const allShown =
    regularItems.length > 0 && regularItems.length <= shown.length;

  const isEmpty = matching.length === 0;

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

  const plural = matching.length === 1 ? "webinar" : "webinars";

  const resultLabel =
    matching.length === 0
      ? `No webinars in ${activeLabel || "this category"}`
      : `${matching.length} ${plural}${
          activeLabel ? ` in ${activeLabel}` : ""
        }`;

  const clearFilter = () => {
    setFilter("all");
    setLimit(PAGE_SIZE);
  };

  return (
    <section className="relative mx-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[10px] border border-[#E4EEEF] bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] py-[clamp(38px,4.4vw,64px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.36] [background-image:radial-gradient(circle,rgba(23,174,185,0.18)_1.1px,transparent_1.1px)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto max-w-[1320px]">
        <BlogFilters
          filters={filters}
          resultLabel={resultLabel}
          filtered={filter !== "all"}
          onClear={clearFilter}
        />

        {/* Dynamic featured webinar */}
        {featuredItem && (
          <FeaturedWebinarCard item={featuredItem} />
        )}

        {isEmpty && (
          <div className="flex flex-col items-center gap-3.5 rounded-[10px] border border-dashed border-[#DCEAEC] bg-white px-5 py-[clamp(38px,5vw,64px)] text-center">
            <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[10px] bg-[#F2F9FA] text-[#0E8B95]">
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
              <div className="text-base font-extrabold tracking-[-0.018em] text-[#152A2E]">
                Nothing here yet
              </div>

              <p className="mt-[7px] max-w-[38ch] text-[13px] leading-[1.6] text-[#5F7175]">
                We are still publishing in this category. Clear the filter
                to see everything available.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilter}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#17AEB9] px-5 py-3 text-[13.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Show everything
            </button>
          </div>
        )}

        {!isEmpty && regularItems.length > 0 && (
          <div className="grid grid-cols-1 gap-[clamp(12px,1.4vw,18px)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((item) => (
              <WebinarCard
                key={item.id || item.slug || item.href}
                item={item}
              />
            ))}
          </div>
        )}

        {!isEmpty && regularItems.length > 0 && (
          <div className="mt-[clamp(26px,3vw,38px)] flex flex-col items-center gap-[13px]">
            {moreLeft && (
              <button
                type="button"
                onClick={() => setLimit((current) => current + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#17AEB9] px-[27px] py-3.5 text-[14.5px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5"
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
              <span className="text-[12.5px] font-semibold text-[#66787C]">
                That is everything published so far — more sessions are on
                the way.
              </span>
            )}

            <span className="text-[12px] font-semibold text-[#66787C]">
              Showing {shown.length} of {regularItems.length} regular webinars
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
