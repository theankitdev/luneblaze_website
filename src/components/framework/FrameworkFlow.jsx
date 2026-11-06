// src/components/framework/FrameworkFlow.jsx
"use client";

export default function FrameworkFlow({
  eyebrow,
  heading,
  headingHighlight,
  steps = [],
  background = "#fff",
  accentColor = "#17AEB9",
}) {
  const n = steps.length;
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20" style={{ background }}>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading} <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-[560px]" style={{ aspectRatio: "1/1" }}>
            <div className="absolute rounded-full border-2 border-dashed border-[#9FD8DD]" style={{ inset: "13%", animation: "lbSpin 60s linear infinite" }} />
            <div className="absolute grid place-items-center rounded-full text-center font-extrabold text-white" style={{ inset: "35%", background: accentColor, fontSize: "clamp(13px,1.6vw,18px)", lineHeight: 1.25, padding: 8, boxShadow: "0 20px 40px -20px rgba(23,174,185,.8)" }}>
              Continuous<br />Improvement
            </div>
            {steps.map((step, i) => {
              const angle = (-90 + i * 360 / n) * Math.PI / 180;
              return (
                <div
                  key={step}
                  className="absolute w-[clamp(92px,24%,132px)] -translate-x-1/2 -translate-y-1/2 border border-[#C9D9DC] border-t-[3px] bg-white p-2.5 text-center shadow-[0_16px_30px_-22px_rgba(15,60,66,.55)]"
                  style={{ left: `${50 + 43 * Math.cos(angle)}%`, top: `${50 + 43 * Math.sin(angle)}%`, borderTopColor: accentColor }}
                >
                  <div className="text-[11px] font-extrabold tracking-[.08em] text-[#0E8B95]">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1 text-[clamp(13px,1.4vw,15.5px)] font-extrabold text-[#152A2E]">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}