"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  {
    label: "Documents & Evidence",
    title: "A home for every policy. Evidence for every process.",
    description:
      "Organise policies, SOPs, plans and evidence in a structured repository. Start with document frameworks, connect records to requirements and make review easier.",
    features: [
      "Academic policies & plans",
      "Domain-wise evidence",
      "Certificate expiry tracking",
    ],
  },
  {
    label: "People & Implementation",
    title: "Make quality a shared responsibility.",
    description:
      "Bring your institutional quality teams and committees into one implementation journey, supported by orientation, training and expert guidance.",
    features: [
      "Quality-team & committee setup",
      "Staff participation & progress",
      "Training & implementation support",
    ],
  },
  {
    label: "Audits & Improvement",
    title: "Close the loop on improvement.",
    description:
      "Use periodic mock audits to identify gaps, assign improvement actions and strengthen readiness. Keep progress visible through reviews and reporting.",
    features: [
      "Mock audit & review",
      "Improvement action tracking",
      "Leadership progress reports",
    ],
  },
];

export default function WorkspaceSection() {
  const [activeTab, setActiveTab] = useState(0);
  const active = tabs[activeTab];

  return (
    <section
      className="relative overflow-hidden px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]"
    >
      {/* decorative bg */}
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
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(91,91,214,.16)" }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "26%",
              border: "1px dashed rgba(91,91,214,.14)",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        {/* heading */}
        <div className="text-center">
          <div>
            <span
              className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]"
              style={{ background: "rgba(223,241,243,.9)" }}
            >
              <span
                className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Inside your quality workspace
            </span>
          </div>
          <h2 className="mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            One platform.{" "}
            <span className="text-[#17AEB9]">
              The entire quality cycle.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.7] text-[#4C6165]">
            From the first policy to the next improvement plan, keep your team
            working towards the same goals.
          </p>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Platform capabilities"
          className="lf-rail mt-9 flex gap-1 overflow-x-auto border-b border-[#C9D9DC]"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab, index) => {
            const selected = activeTab === index;
            return (
              <button
                key={tab.label}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(index)}
                className={`-mb-px shrink-0 whitespace-nowrap border-0 border-b-[3px] bg-transparent px-[22px] py-4 text-[16px] font-semibold transition-colors ${
                  selected
                    ? "border-[#0E8B95] text-[#0E8B95]"
                    : "border-transparent text-[#5E7074] hover:text-[#0E8B95]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div
          className="mt-[22px] grid items-center gap-[clamp(24px,4vw,56px)] rounded-[14px] border border-[#D2EBED] bg-[#EAF6F7] p-[clamp(26px,4.4vw,64px)]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,420px),1fr))",
          }}
        >
          {/* left */}
          <div>
            <div className="inline-flex items-center whitespace-nowrap text-[12px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
              <span
                className="mr-[10px] inline-block h-2 w-2 rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Connected quality processes
            </div>

            <h3
              className="mt-[18px] text-[clamp(28px,3vw,42px)] font-normal leading-[1.18] text-[#152A2E]"
              style={{ fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              {active.title}
            </h3>

            <p className="mt-[18px] text-[17px] leading-[1.75] text-[#4C6165]">
              {active.description}
            </p>

            <Link
              href="/book-a-demo"
              className="mt-[26px] inline-flex items-center gap-2 border-b-2 border-[#8FB9A8] pb-[6px] text-[16px] font-extrabold text-[#152A2E] transition-colors hover:border-[#17AEB9] hover:text-[#0E8B95]"
            >
              See it in a demo ↗
            </Link>
          </div>

          {/* right — feature rows */}
          <div className="grid gap-[14px]">
            {active.features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center justify-between gap-[14px] rounded-[6px] border border-[#D6E3E5] bg-white px-6 py-5 transition-[transform,border-color] duration-200 hover:translate-x-1 hover:border-[#17AEB9]"
              >
                <b className="min-w-0 flex-1 text-[16px] font-extrabold text-[#152A2E]">
                  0{index + 1}
                  &nbsp;&nbsp;&nbsp; {feature}
                </b>
                <span className="shrink-0 font-bold text-[#3E8A6E]">✓</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[13px] text-[#6A7C80]">
          Platform concepts shown for illustration. Request a demo to see the
          live product.
        </p>
      </div>
    </section>
  );
}