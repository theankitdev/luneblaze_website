const items = [
  {
    title: "Onboard & organise",
    desc: "Bring your school onto the platform and establish CLT and focus-group ownership.",
  },
  {
    title: "Orient & build",
    desc: "Train the team, organise documents and map evidence to the relevant requirements.",
  },
  {
    title: "Monitor & strengthen",
    desc: "Track progress, review participation and receive continuous implementation guidance.",
  },
  {
    title: "Review & improve",
    desc: "Use mock audits, filing assistance and improvement plans to build continuous readiness.",
  },
];

export default function ImplementationJourney() {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-5 py-16 sm:px-8 lg:py-20">
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
          <div className="absolute inset-0 rounded-full border border-[rgba(91,91,214,.16)]" />
          <div className="absolute inset-[26%] rounded-full border border-dashed border-[rgba(91,91,214,.14)]" />
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
            The implementation journey
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            Build a system that{" "}
            <span className="text-[#17AEB9]">keeps moving.</span>
          </h2>
        </div>

        {/* grid */}
        <div className="mt-10 grid border border-[#C9D9DC] bg-white sm:mt-12 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="flex flex-col border-b border-r border-[#D6E3E5] p-6 transition-colors hover:bg-[#F4FAFA] sm:p-8"
              style={{
                borderTop: i === 0 ? "3px solid #17AEB9" : "3px solid transparent",
              }}
            >
              <span className="inline-flex w-fit rounded-sm bg-[#17AEB9] px-2 py-1 text-xs font-extrabold tracking-[.08em] text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[clamp(19px,1.7vw,22px)] font-extrabold leading-tight tracking-tight text-[#152A2E]">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-6 text-[#4C6165]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}