// src/components/framework/FrameworkPillars.jsx
"use client";

export default function FrameworkPillars({
  eyebrow,
  heading,
  headingHighlight,
  description,
  film,
  pillars = [],
  minCol = "320px",
  background = "#F4F8F8",
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20" style={{ background }}>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading} <span className="text-[#17AEB9]">{headingHighlight}</span>
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">{description}</p>
          )}
        </div>

        {film && (
          <div className="relative mt-8 w-full overflow-hidden rounded-xl border border-[#C9D9DC] bg-[#FAF6EE] shadow-[0_24px_50px_-34px_rgba(21,42,46,.45)]" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={film}
              title={heading}
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        )}

        <div
          className="mt-12 grid border border-[#C9D9DC] bg-white"
          style={{ gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${minCol}),1fr))` }}
        >
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="flex flex-col border-b border-r border-[#D6E3E5] p-7 transition-colors hover:bg-[#F4FAFA] sm:p-9"
              style={{ borderTop: i === 0 ? "3px solid #17AEB9" : "3px solid transparent" }}
            >
              <span className="inline-flex w-fit rounded-sm bg-[#17AEB9] px-2 py-1 text-xs font-extrabold tracking-[.08em] text-white">
                {p.badge}
              </span>
              <h3 className="mt-4 text-[clamp(19px,1.7vw,22px)] font-extrabold leading-tight tracking-tight text-[#152A2E]">
                {p.title}
              </h3>
              {p.desc && <p className="mt-2.5 text-[15px] leading-6 text-[#4C6165]">{p.desc}</p>}
              {p.list && p.list.length > 0 && (
                <ul className="mt-[18px] border-t border-[#E6EEEF] p-0">
                  {p.list.map((li) => (
                    <li key={li} className="flex gap-2.5 border-b border-[#E6EEEF] py-[11px] text-[14.5px] font-semibold text-[#152A2E]">
                      <span className="font-extrabold text-[#17AEB9]">✓</span>
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        
      </div>
    </section>
  );
}