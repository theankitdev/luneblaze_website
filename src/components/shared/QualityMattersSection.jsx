// src/components/shared/QualityMattersSection.jsx
"use client";

export default function QualityMattersSection({
  eyebrow = "Why school quality matters",
  heading = "Quality that lasts",
  headingHighlight = "beyond an assessment.",
  items = [],
  background = "#F4F8F8",
  accentColor = "#17AEB9",
  showDecorativeBg = true,
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20"
      style={{ background }}
    >
      {/* decorative bg */}
      {showDecorativeBg && (
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
      )}

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: accentColor,
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
        </div>

        {/* grid */}
        <div className="mt-10 grid border border-[#C9D9DC] bg-white sm:mt-12 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="flex flex-col border-b border-r border-[#D6E3E5] p-7 transition-colors hover:bg-[#F4FAFA] sm:p-9"
              style={{
                borderTop:
                  i === 0
                    ? `3px solid ${accentColor}`
                    : "3px solid transparent",
              }}
            >
              <span
                className="inline-flex w-fit rounded-sm px-2 py-1 text-xs font-extrabold tracking-[.08em] text-white"
                style={{ background: accentColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-extrabold leading-tight tracking-tight text-[#152A2E]">
                {item.title}
              </h3>
              {item.desc && (
                <p className="mt-2.5 text-[15px] leading-6 text-[#4C6165]">
                  {item.desc}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}