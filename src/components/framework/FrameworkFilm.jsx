// src/components/framework/FrameworkFilm.jsx
"use client";

export default function FrameworkFilm({
  eyebrow,
  heading,
  headingHighlight,
  description,
  note,
  film,
  background = "#FFFFFF",
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

        {note && (
          <p className="mx-auto mt-4 max-w-[720px] text-center text-sm leading-[1.6] text-[#6A7C80]">{note}</p>
        )}
      </div>
    </section>
  );
}