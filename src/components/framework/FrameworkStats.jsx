// src/components/framework/FrameworkStats.jsx
"use client";

export default function FrameworkStats({
  eyebrow,
  heading,
  headingHighlight,
  description,
  stats = [],
  wheelRing,
  wheelTitle,
  wheelLegend = [],
  background = "#F4F8F8",
  accentColor = "#17AEB9",
}) {
  const wheelColors = ["#F4A97F", "#A9CFC0", "#F0676B", "#F5CF68", "#7FD4A8"];
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
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">{description}</p>
          )}
        </div>

        {/* Stat strip */}
        <div className="mt-10 grid border border-[#C9D9DC] bg-white md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-b border-r border-[#D6E3E5] p-6 text-center lg:p-8">
              <div className="text-[clamp(28px,3vw,40px)] font-extrabold leading-none tracking-tight" style={{ color: accentColor }}>{s.value}</div>
              <div className="mt-3 text-base font-extrabold text-[#152A2E]">{s.label}</div>
              <div className="mt-1.5 text-sm leading-[1.55] text-[#4C6165]">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Wheel + legend */}
        {wheelRing && (
          <div className="mt-5 grid items-center gap-6 border border-[#C9D9DC] bg-[#F4F8F8] p-6 lg:grid-cols-[1.5fr_1fr] lg:gap-11 lg:p-10">
            <div className="relative mx-auto w-full max-w-[640px]">
              <div className="relative w-full" style={{ aspectRatio: "1140/920" }}>
                <iframe
                  src={wheelRing}
                  title={wheelTitle}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
            <div>
              <div className="text-base font-extrabold text-[#152A2E]">{wheelTitle}</div>
              <div className="mt-3.5 border-t border-[#D6E3E5]">
                {wheelLegend.map((lg, i) => (
                  <div key={lg.label} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-[#D6E3E5] py-[11px]">
                    <span className="grid h-[30px] w-[30px] place-items-center rounded-full text-xs font-extrabold text-white" style={{ background: wheelColors[i % wheelColors.length] }}>
                      {i + 1}
                    </span>
                    <span className="text-[15px] font-bold text-[#152A2E]">{lg.label}</span>
                    <span className="text-sm font-extrabold text-[#0E8B95]">{lg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}