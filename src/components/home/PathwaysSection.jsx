import Link from "next/link";

const pathways = [
  {
    category: "SCHOOLS",
    title: "Strong foundations. Everyday quality.",
    description:
      "Build SQAAF and NABET implementation around evidence, team ownership, teaching quality and continuous improvement.",
    href: "/school-accreditations",
    image: "/assets/ic-path-schools.svg",
    cta: "Explore school accreditations",
  },
  {
    category: "HIGHER EDUCATION",
    title: "Evidence-led institutional excellence.",
    description:
      "Coordinate IQAC work, programme outcomes and reporting across NAAC, NBA and NIRF preparation.",
    href: "/heis-accreditations",
    image: "/assets/ic-path-hei.svg",
    cta: "Explore HEI accreditations",
  },
  {
    category: "GROUPS OF INSTITUTIONS",
    title: "One vision across every campus.",
    description:
      "Give leadership a shared view of quality, campus progress, common standards and improvement priorities.",
    href: "/group-of-institutions",
    image: "/assets/ic-path-groups.svg",
    cta: "Explore group governance",
  },
];

export default function PathwaysSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(32px, 3.6vw, 52px) clamp(16px, 3vw, 32px)",
        background: "#F4F8F8",
      }}
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.36,
            backgroundImage:
              "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-18%",
            right: "-8%",
            width: "min(460px, 48vw)",
            height: "min(460px, 48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(23,174,185,.14)" }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "26%",
              border: "1px dashed rgba(23,174,185,.12)",
            }}
          />
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
              Choose your pathway
            </span>
          </div>
          <h2
            className="mt-3 font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]"
            style={{
              fontSize: "clamp(28px, 3.4vw, 46px)",
              textWrap: "balance",
            }}
          >
            One quality ecosystem.{" "}
            <span className="text-[#17AEB9]">Built for your institution.</span>
          </h2>
        </div>

        {/* card grid */}
        <div
          className="mt-[clamp(24px,3vw,36px)] grid border border-[#C9D9DC] bg-white"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          }}
        >
          {pathways.map((item) => (
            <Link
              key={item.category}
              href={item.href}
              className="relative flex flex-col border-b border-r border-[#D6E3E5] text-[#152A2E] transition-colors duration-250 hover:bg-[#F4FAFA] hover:text-[#152A2E]"
              style={{ padding: "clamp(26px, 3vw, 38px)" }}
            >
              {/* image box — exact match to original markup */}
              <div
                style={{
                  height: "190px",
                  margin: "-6px -6px 22px",
                  border: "1px solid #E6EEEF",
                  background: `#fff url('${item.image}') center/contain no-repeat`,
                  backgroundOrigin: "content-box",
                  padding: "10px",
                }}
              />

              {/* category */}
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  color: "#0E8B95",
                }}
              >
                {item.category}
              </div>

              {/* title */}
              <h3
                style={{
                  margin: "10px 0 0",
                  fontWeight: 800,
                  fontSize: "clamp(21px, 2vw, 25px)",
                  lineHeight: 1.2,
                  letterSpacing: "-.02em",
                }}
              >
                {item.title}
              </h3>

              {/* description */}
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "#4C6165",
                  flex: 1,
                }}
              >
                {item.description}
              </p>

              {/* CTA */}
              <span
                style={{
                  marginTop: "22px",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#0E8B95",
                }}
              >
                {item.cta} ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}