// src/components/framework/FrameworkHero.jsx
"use client";

export default function FrameworkHero({
  eyebrow,
  heading,
  headingHighlight,
  description,
  image,
  ctas = [],
  stats = [],
  trust,
  ring,
  ringTitle = "Seven SQAAF domains",
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.26]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-30%",
            right: "-10%",
            width: "min(900px,96vw)",
            height: "min(900px,96vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(23,174,185,.13)]" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-9 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" style={{ animation: "lbPulse 2.4s ease-in-out infinite" }} />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-balance text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-.035em] text-[#152A2E]">
            {heading} <span className="text-[#17AEB9]">{headingHighlight}</span>
          </h1>
          <p className="mt-5 max-w-[580px] text-[clamp(16px,1.35vw,18px)] leading-[1.7] text-[#4C6165]">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[10px] px-6 py-4 text-[16px] font-bold"
                style={{
                  background: c.primary ? "#17AEB9" : "#fff",
                  color: c.primary ? "#fff" : "#152A2E",
                  border: `1px solid ${c.primary ? "#17AEB9" : "#C9D9DC"}`,
                  boxShadow: c.primary ? "0 12px 28px -12px rgba(23,174,185,.85)" : "none",
                }}
              >
                {c.label}
              </a>
            ))}
          </div>
          {stats.length > 0 && (
            <>
              <div className="mt-8 flex max-w-[560px] flex-wrap border border-[#C9D9DC] bg-white/90">
                {stats.map((s) => (
                  <div key={s.label} className="flex-1 basis-[140px] border-r border-[#E6EEEF] px-4 py-3.5">
                    <div className="text-2xl font-extrabold tracking-tight text-[#152A2E]">{s.value}</div>
                    <div className="mt-0.5 text-[12.5px] font-semibold text-[#4C6165]">{s.label}</div>
                  </div>
                ))}
              </div>
              {trust && <div className="mt-3 text-[13.5px] font-bold text-[#0E7A83]">{trust}</div>}
            </>
          )}
        </div>

        {ring ? (
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="relative w-full" style={{ aspectRatio: "1140/920" }}>
              <iframe
                src={ring}
                title={ringTitle}
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        ) : image ? (
          <div className="mx-auto w-full max-w-[560px]">
            <div
              role="img"
              aria-label={eyebrow}
              className="w-full bg-contain bg-center bg-no-repeat"
              style={{ aspectRatio: "1140/840", backgroundImage: `url('${image}')` }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}