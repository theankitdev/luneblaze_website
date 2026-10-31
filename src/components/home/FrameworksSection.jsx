import Link from "next/link";

const frameworks = [
  {
    name: "SQAAF",
    category: "SCHOOLS",
    description: "Build structured self-assessment and improvement systems.",
    href: "/sqaaf",
    logo: "/assets/fw-sqaaf.png",
  },
  {
    name: "NABET",
    category: "SCHOOLS",
    description: "Strengthen processes, evidence and inspection readiness.",
    href: "/nabet",
    logo: "/assets/fw-nabet.png",
  },
  {
    name: "NAAC",
    category: "HIGHER EDUCATION",
    description: "Organise IQAC processes and institutional evidence.",
    href: "/naac",
    logo: "/assets/fw-naac.png",
  },
];

const support = [
  ["01", "Platform", "Documents, evidence, workflow and dashboards in one place."],
  ["02", "Training", "Faculty and IQAC / CLT sessions that build capability."],
  ["03", "Advisory", "Quality experts guiding every stage of the cycle."],
  ["04", "Support",  "24×7 help from people who know the frameworks."],
];

export default function FrameworksSection() {
  return (
    <section className="relative overflow-hidden border-y border-[#D6E3E5] bg-white px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]">
      {/* decorative bg */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.36]"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
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
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(23,174,185,.14)" }} />
          <div className="absolute rounded-full" style={{ inset: "26%", border: "1px dashed rgba(23,174,185,.12)" }} />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        {/* heading */}
        <div className="text-center">
          <div>
            <span
              className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]"
              style={{ background: "rgba(223,241,243,.9)" }}
            >
              <span
                className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Framework-aligned. Institution-focused.
            </span>
          </div>
          <h2 className="mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            Quality is the journey. <span className="text-[#17AEB9]">Accreditation is a milestone.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.7] text-[#4C6165]">
            Choose the pathway that fits your institution, with processes and
            evidence aligned to your framework.
          </p>
        </div>

        {/* framework rail — 3 items only, matching prototype's fws3 */}
        <div
          className="lf-rail mt-[clamp(28px,4vw,44px)] grid overflow-x-auto border border-[#C9D9DC]"
          style={{ gridAutoFlow: "column", gridAutoColumns: "minmax(240px,1fr)" }}
        >
          {frameworks.map((framework) => (
            <Link
              key={framework.name}
              href={framework.href}
              className="grid border-r border-[#D6E3E5] px-[22px] py-[18px] text-[#152A2E] transition-colors hover:bg-[#F4FAFA]"
              style={{ gridTemplateColumns: "52px minmax(0,1fr) auto", columnGap: "16px", alignItems: "start" }}
            >
              <div
                className="grid place-items-center rounded-[4px] border border-[#E6EEEF] bg-white p-[6px]"
                style={{ width: "52px", height: "52px" }}
              >
                <div
                  role="img"
                  aria-label={framework.name}
                  className="bg-contain bg-center bg-no-repeat"
                  style={{ width: "40px", height: "40px", backgroundImage: `url('${framework.logo}')` }}
                />
              </div>

              <div className="min-w-0">
                <span className="block text-[11px] font-extrabold tracking-[.08em] text-[#6A7C80]">
                  {framework.category}
                </span>
                <h3 className="mt-[3px] text-[22px] font-extrabold tracking-[-.02em] text-[#152A2E]">
                  {framework.name}
                </h3>
                <p className="mt-[5px] text-[14px] leading-[1.55] text-[#4C6165]">
                  {framework.description}
                </p>
              </div>

              <span className="text-[18px] text-[#17AEB9]">↗</span>
            </Link>
          ))}
        </div>

        {/* gradient panel */}
        <div
          className="lf-mtp relative mt-5 grid overflow-hidden border border-[#C9D9DC]"
          style={{
            gridTemplateColumns: "minmax(0,1fr)",
            background: "linear-gradient(120deg,#F3FAFB 0%,#E4F4F5 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute"
            style={{
              right: "-90px",
              top: "-90px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              border: "1px solid rgba(23,174,185,.18)",
              animation: "lbSpin 110s linear infinite",
            }}
          >
            <div className="absolute rounded-full" style={{ inset: "22%", border: "1px dashed rgba(23,174,185,.16)" }} />
          </div>

          <div className="relative p-[clamp(24px,3vw,40px)] text-center">
            <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] bg-white px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
              <span
                className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Technology meets implementation
            </span>

            <h3 className="mt-[14px] text-balance text-[clamp(22px,2.2vw,30px)] font-extrabold leading-[1.2] tracking-[-.02em] text-[#152A2E]">
              More than a platform. <span className="text-[#17AEB9]">A partner in building quality.</span>
            </h3>

            <p className="mx-auto mt-[10px] max-w-[720px] text-[15.5px] leading-[1.7] text-[#4C6165]">
              Luneblaze combines digital tools with training, practical guidance
              and implementation support to help institutions make quality part
              of how they work.
            </p>

            <div
              className="lf-mtp4 mt-[22px] grid gap-3 text-left"
              style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}
            >
              {support.map(([number, title, description]) => (
                <div key={number} className="flex items-start gap-3 border border-[#D6E3E5] bg-white px-[14px] py-3">
                  <b className="shrink-0 rounded-[3px] bg-[#17AEB9] px-[7px] py-1 text-[11.5px] font-extrabold text-white">
                    {number}
                  </b>
                  <span>
                    <span className="block text-[15px] font-extrabold text-[#152A2E]">{title}</span>
                    <span className="mt-[2px] block text-[13px] leading-[1.5] text-[#4C6165]">{description}</span>
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about-us"
              className="mt-[20px] inline-flex items-center gap-2 rounded-[10px] bg-[#17AEB9] px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-[#0E8B95]"
              style={{ boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)" }}
            >
              Get to know Luneblaze ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}