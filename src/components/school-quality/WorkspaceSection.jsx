"use client";

import { useState } from "react";

const items = [
  { n: "01", title: "Readiness Score™", desc: "Monitor Documentation Status, Staff Inclusivity and Audit Frequency as an internal readiness indicator." },
  { n: "02", title: "Policies, SOPs & plans", desc: "Access 1,500+ document frameworks for policies, SOPs and plans, with sample evidence and a structured starting point for your school." },
  { n: "03", title: "Evidence management", desc: "Upload, organise and link records to the standards they support, with evidence gaps identified early." },
  { n: "04", title: "Evidence & compliance", desc: "Organise domain-wise evidence in a central repository. Keep track of certificates and supporting records with expiry alerts." },
  { n: "05", title: "Shared responsibility", desc: "Set up your Core Leadership Team (CLT) and focus groups. Assign roles and track implementation progress across stakeholders." },
  { n: "06", title: "Team meetings", desc: "Organise CLT and focus-group meetings with attendance, minutes and follow-up actions." },
  { n: "07", title: "Stakeholder surveys", desc: "Collect feedback from students, parents and staff and bring that evidence into quality improvement." },
  { n: "08", title: "Observation & feedback", desc: "Bring classroom observations and stakeholder surveys into your quality improvement conversations." },
  { n: "09", title: "Tracking & reports", desc: "Review progress by domain, period or team, and provide clear summaries for school leadership." },
  { n: "10", title: "Audits & improvement", desc: "Prepare through periodic mock audits, identify gaps and turn findings into school improvement actions." },
  { n: "11", title: "Improvement plans", desc: "Turn review findings into owned actions, set review dates and track them through to closure." },
  { n: "12", title: "Training & expert support", desc: "Support your staff through monthly SQAAF sessions, faculty orientation, implementation guidance and query resolution." },
];

export default function WorkspaceSection() {
  const [active, setActive] = useState(0);
  const total = items.length;
  const current = items[active];

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-5 py-16 sm:px-8 lg:py-20">
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.36]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-18%",
            right: "-8%",
            width: "min(460px,48vw)",
            height: "min(460px,48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
          <div className="absolute inset-[26%] rounded-full border border-dashed border-[rgba(23,174,185,.12)]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            Inside the platform
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            A workspace that{" "}
            <span className="text-[#17AEB9]">supports the work.</span>
          </h2>
        </div>

        {/* picker */}
        <div className="mt-10 grid overflow-hidden border border-[#C9D9DC] bg-white sm:mt-12 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — item list */}
          <div className="grid grid-cols-1 gap-2 border-b border-[#D6E3E5] p-4 sm:grid-cols-2 sm:gap-2 sm:p-5 lg:border-b-0 lg:border-r">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 border px-3.5 py-3 text-left text-[#152A2E] transition-colors ${
                    isActive
                      ? "border-[#17AEB9] bg-[#EDF7F8]"
                      : "border-[#E1ECEE] bg-white"
                  }`}
                >
                  <span
                    className={`grid h-[34px] w-[34px] flex-none place-items-center text-xs font-extrabold tracking-[.06em] transition-colors ${
                      isActive
                        ? "bg-[#17AEB9] text-white"
                        : "bg-[#EDF4F5] text-[#0E7A83]"
                    }`}
                  >
                    {item.n}
                  </span>
                  <span className="text-[14.5px] font-bold leading-[1.3]">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT — preview panel */}
          <div className="relative flex min-h-[360px] flex-col justify-center overflow-hidden bg-[linear-gradient(160deg,#F3FAFB,#E2F3F5)] p-7 sm:p-10 lg:p-12">
            {/* dot grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
                backgroundSize: "26px 26px",
              }}
            />
            {/* orbit */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{
                right: "-90px",
                bottom: "-90px",
                width: "300px",
                height: "300px",
                animation: "lbSpin 70s linear infinite",
              }}
            >
              <div className="absolute inset-0 rounded-full border border-dashed border-[rgba(23,174,185,.3)]" />
            </div>
            {/* big outlined number */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute font-extrabold leading-none text-transparent"
              style={{
                right: "clamp(16px,3vw,40px)",
                top: "clamp(4px,1vw,14px)",
                fontSize: "clamp(90px,11vw,150px)",
                letterSpacing: "-.05em",
                WebkitTextStroke: "1.5px rgba(23,174,185,.35)",
              }}
            >
              {current.n}
            </div>

            {/* content */}
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BEE2E6] bg-white px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.14em] text-[#0E7A83]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]"
                  style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
                />
                Capability {current.n} of {String(total).padStart(2, "0")}
              </span>

              <h3 className="mt-[18px] max-w-[16ch] text-[clamp(26px,2.8vw,38px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
                {current.title}
              </h3>

              <p className="mt-3.5 max-w-[46ch] text-[16px] leading-[1.7] text-[#3E5458]">
                {current.desc}
              </p>

              {/* progress + prev/next */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-1.5 max-w-[260px] flex-1 overflow-hidden border border-[#CFE6E9] bg-white">
                  <div
                    className="h-full bg-[#17AEB9] transition-[width] duration-500"
                    style={{ width: `${((active + 1) / total) * 100}%` }}
                  />
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={prev}
                    className="grid h-10 w-10 place-items-center border border-[#BEE2E6] bg-white text-base text-[#0E7A83] transition-colors hover:bg-[#EDF7F8]"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={next}
                    className="grid h-10 w-10 place-items-center border border-[#17AEB9] bg-[#17AEB9] text-base text-white transition-colors hover:bg-[#0E8B95]"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}