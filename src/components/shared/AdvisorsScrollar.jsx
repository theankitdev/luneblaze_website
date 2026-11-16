
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTeachers } from "@/services/teacherService";

export default function AdvisorsScroller() {
  const [advisors, setAdvisors] = useState([]);
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch advisors from API
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllTeachers(1, 100);

        if (response.status === "success") {
          setAdvisors(response.data || []);
          setHost(response.host || "");
        } else {
          setError(response.message || "Unable to load advisors");
        }
      } catch (err) {
        console.error("Advisor API Error:", err);
        setError("Something went wrong while loading advisors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  // Generate complete profile image URL
  const getImageUrl = (image) => {
    if (!image) return "/assets/advisor-placeholder.png";

    if (image.startsWith("http")) {
      return image;
    }

    return `${host.replace(/\/+$/, "")}/${image.replace(/^\/+/, "")}`;
  };

  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-[#F4F8F8] px-5 py-16 sm:px-8 lg:py-20">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(91,91,214,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 44s linear infinite reverse",
          }}
        />

        <div
          className="absolute"
          style={{
            bottom: "-24%",
            left: "2%",
            width: "min(440px,46vw)",
            height: "min(440px,46vw)",
            animation: "lbSpinRev 108s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(91,91,214,.16)]" />
          <div className="absolute inset-[26%] rounded-full border border-dashed border-[rgba(91,91,214,.14)]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            Guided by our advisors
          </span>

          <h2 className="mx-auto mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            Guided by Experience.{" "}
            <span className="text-[#17AEB9]">
              Strengthened by Expertise.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
            A collective of 50+ education leaders, quality experts and
            practitioners across the globe.
          </p>
        </div>

        {/* Horizontal rail */}
        <div
          className="lf-rail mt-10 grid gap-4 overflow-x-auto pb-1.5 sm:mt-12"
          style={{
            gridAutoFlow: "column",
            gridAutoColumns: "clamp(210px,20vw,240px)",
            scrollSnapType: "x mandatory",
          }}
        >
          {/* Loading */}
          {loading && (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border border-[#C9D9DC] bg-white"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="space-y-2 px-4 pb-[18px] pt-3.5">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))
          )}

          {/* API Error */}
          {!loading && error && (
            <div className="col-span-full py-8 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && advisors.length === 0 && (
            <div className="col-span-full py-8 text-center text-[#4C6165]">
              No advisors found.
            </div>
          )}

          {/* Advisor cards */}
          {!loading &&
            !error &&
            advisors.map((advisor) => (
              <div
                key={advisor.teacher_id}
                className="border border-[#C9D9DC] bg-white"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  role="img"
                  aria-label={advisor.teacher_name}
                  className="border-b-[3px] border-[#17AEB9] bg-[#EDF7F8] bg-cover bg-top"
                  style={{
                    aspectRatio: "1",
                    backgroundImage: `url("${getImageUrl(
                      advisor.teacher_profile_picture
                    )}")`,
                  }}
                />

                <div className="px-4 pb-[18px] pt-3.5">
                  <div className="text-[15.5px] font-extrabold text-[#152A2E]">
                    {advisor.teacher_name}
                  </div>

                  <div className="mt-1 text-[13px] leading-[1.45] text-[#4C6165]">
                    {advisor.teacher_designation}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* CTA */}
        <div className="mt-5 text-center sm:mt-6">
          <Link
            href="/advisors"
            className="inline-block rounded-[10px] border border-[#152A2E] px-6 py-[13px] text-[15px] font-bold text-[#152A2E] transition-colors hover:bg-[#152A2E] hover:text-white"
          >
            Meet All Advisors ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
