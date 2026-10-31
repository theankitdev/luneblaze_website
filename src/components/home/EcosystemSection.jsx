import Link from "next/link";

const features = [
  {
    number: "01",
    label: "BUILD THE FOUNDATION",
    title: "Quality Systems",
    description:
      "Give every quality process a structure, an owner and a place to live.",
    points: [
      "Policies, SOPs & document frameworks",
      "Evidence & compliance management",
      "Quality-team & committee workflows",
    ],
    href: "/school-accreditations",
    cta: "Explore quality systems",
    accent: "#17AEB9",
  },
  {
    number: "02",
    label: "STRENGTHEN PRACTICE",
    title: "Quality Excellence",
    description:
      "Turn everyday practice into a continuous cycle of learning and improvement.",
    points: [
      "Training & expert implementation support",
      "Classroom observations & surveys",
      "Mock audits & improvement plans",
    ],
    href: "/school-accreditations#implementation",
    cta: "Explore implementation support",
    accent: "#0E8B95",
  },
  {
    number: "03",
    label: "SEE THE BIGGER PICTURE",
    title: "Quality Governance",
    description:
      "Help leadership see progress, identify gaps and act with clarity.",
    points: [
      "Readiness Score™ & progress tracking",
      "Group dashboards & benchmarking",
      "Leadership insights & reports",
    ],
    href: "/group-of-institutions",
    cta: "Explore group visibility",
    accent: "#123F46",
  },
];

export default function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden border-y border-[#D6E3E5] bg-white px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]"
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 38s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(700px,80vw)",
            height: "min(700px,80vw)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ animation: "lbSpin 130s linear infinite" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(23,174,185,.14)" }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "24%",
                border: "1px dashed rgba(23,174,185,.12)",
              }}
            />
          </div>
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
              The Luneblaze quality ecosystem
            </span>
          </div>
          <h2 className="mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            Quality needs a system.{" "}
            <span className="text-[#17AEB9]">
              Excellence grows from it.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] text-[17px] leading-[1.7] text-[#4C6165]">
            Move beyond scattered files and last-minute preparation. Create a
            connected approach that supports your institution every day.
          </p>
        </div>

        {/* cards */}
        <div
          className="mt-[clamp(24px,3vw,36px)] grid border border-[#C9D9DC]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          }}
        >
          {features.map((feature) => (
            <article
              key={feature.number}
              className="flex flex-col border-b border-r border-[#D6E3E5] bg-white p-[clamp(26px,3vw,38px)]"
              style={{ borderTop: `3px solid ${feature.accent}` }}
            >
              <span className="text-[12px] font-extrabold tracking-[.08em] text-[#6A7C80]">
                {feature.number} / {feature.label}
              </span>
              <h3 className="mt-[14px] text-[26px] font-extrabold tracking-[-.02em] text-[#152A2E]">
                {feature.title}
              </h3>
              <p className="mt-[10px] text-[15px] leading-[1.65] text-[#4C6165]">
                {feature.description}
              </p>

              <ul className="mt-5 flex-1 list-none border-t border-[#E6EEEF] p-0">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-[10px] border-b border-[#E6EEEF] py-3 text-[15px] font-semibold text-[#152A2E]"
                  >
                    <span className="font-extrabold text-[#17AEB9]">✓</span>
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href={feature.href}
                className="mt-[22px] text-[15px] font-bold text-[#0E8B95] hover:text-[#17AEB9]"
              >
                {feature.cta} ↗
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}