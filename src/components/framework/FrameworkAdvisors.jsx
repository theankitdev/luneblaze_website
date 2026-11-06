// src/components/framework/FrameworkAdvisors.jsx
"use client";

export default function FrameworkAdvisors({
  eyebrow = "Guided by our advisors",
  heading = "Guided by Experience.",
  headingHighlight = "Strengthened by Expertise.",
  description = "A collective of 50+ education leaders, quality experts and practitioners across the globe.",
  items = [],
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
            {heading} <span className="text-[#0E8B95]">{headingHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">{description}</p>
        </div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1.5">
          {items.map((a) => (
            <div key={a.name} className="w-[clamp(210px,20vw,240px)] shrink-0 snap-start border border-[#C9D9DC] bg-white">
              <div className="aspect-square border-b-[3px] border-[#17AEB9] bg-[#EDF7F8] bg-cover bg-top" style={{ backgroundImage: `url('${a.img}')` }} />
              <div className="p-4">
                <div className="text-[15.5px] font-extrabold text-[#152A2E]">{a.name}</div>
                <div className="mt-1 text-[13px] leading-[1.45] text-[#4C6165]">{a.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/advisors" className="inline-block rounded border border-[#152A2E] px-6 py-3 text-[15px] font-bold text-[#152A2E] transition-colors hover:bg-[#152A2E] hover:text-white">
            Meet All Advisors ↗
          </a>
        </div>
      </div>
    </section>
  );
}