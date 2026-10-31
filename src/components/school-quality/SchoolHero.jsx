import Link from "next/link";

const logos = [
  {
    name: "SQAAF",
    full: "School Quality Assessment & Assurance Framework",
    logo: "/assets/fw-sqaaf.png",
    href: "/sqaaf",
  },
  {
    name: "NABET",
    full: "National Accreditation Board for Education & Training",
    logo: "/assets/fw-nabet.png",
    href: "/nabet",
  },
];

export default function SchoolHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white">
      {/* ---------- background layers ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* faded photo */}
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundColor: "#EAF6F7",
            backgroundImage: "url('/assets/lb-SQAAF.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* horizontal white gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,#fff 0,#fff 38%,rgba(255,255,255,.72) 62%,rgba(255,255,255,.35))",
          }}
        />

        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.26]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />

        {/* rotating orbit rings */}
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
          <div
            className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]"
          />
          <div
            className="absolute rounded-full border border-dashed border-[rgba(23,174,185,.13)]"
            style={{ inset: "18%" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(91,91,214,.1)]"
            style={{ inset: "36%" }}
          />
        </div>
      </div>

      {/* ---------- content ---------- */}
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-[clamp(36px,5vw,72px)] px-[clamp(16px,3vw,32px)] py-[clamp(52px,7vw,104px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr))]">
        {/* LEFT */}
        <div>
          <span
            className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase leading-[1.4] tracking-[.16em] text-[#0E7A83]"
            style={{ background: "rgba(223,241,243,.9)" }}
          >
            <span
              className="h-1.5 w-1.5 flex-none rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            For schools
          </span>

          <h1 className="mt-5 text-balance text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-.035em] text-[#152A2E]">
            Build quality into{" "}
            <span className="text-[#17AEB9]">every school day.</span>
          </h1>

          <p className="mt-[22px] max-w-[580px] text-pretty text-[clamp(16px,1.35vw,18px)] leading-[1.7] text-[#4C6165]">
            A connected system for SQAAF and NABET implementation: structured
            documentation, engaged teams, practical guidance and continuous
            readiness.
          </p>

          <div className="mt-[30px] flex flex-wrap gap-3">
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-[10px] whitespace-nowrap rounded-[10px] border border-[#17AEB9] bg-[#17AEB9] px-[26px] py-4 text-[16px] font-bold text-white transition-transform hover:-translate-y-[2px] hover:bg-[#0E8B95]"
              style={{
                boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)",
              }}
            >
              Book a tailored demo ↗
            </Link>
          </div>
        </div>

        {/* RIGHT — framework logos */}
        <div className="grid gap-3">
          {logos.map((logo) => (
            <Link
              key={logo.name}
              href={logo.href}
              className="grid items-center gap-[18px] border border-[#C9D9DC] px-5 py-[18px] text-[#152A2E] transition-[border-color,transform] hover:border-[#17AEB9]"
              style={{
                gridTemplateColumns: "80px 1fr auto",
                background: "rgba(255,255,255,.94)",
                boxShadow: "0 22px 44px -34px rgba(15,60,66,.55)",
                animation: "lbFloat 7s ease-in-out infinite",
              }}
            >
              <div className="grid h-20 w-20 place-items-center border border-[#E6EEEF] bg-white p-[10px]">
                <div
                  role="img"
                  aria-label={logo.name}
                  className="h-[58px] w-[58px] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${logo.logo}')` }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-[22px] font-extrabold tracking-[-.02em]">
                  {logo.name}
                </div>
                <div className="mt-1 text-[13.5px] leading-[1.45] text-[#4C6165]">
                  {logo.full}
                </div>
              </div>
              <span className="text-[18px] text-[#17AEB9]">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}