import Link from "next/link";

const pathways = [
  {
    category: "SCHOOLS",
    title: "Strong foundations. Everyday quality.",
    description:
      "Build SQAAF and NABET implementation around evidence, team ownership, teaching quality and continuous improvement.",
    href: "/school-accreditations",
    image: "/assets/lb-acchome.webp",
    cta: "Explore school accreditations",
  },
  {
    category: "HIGHER EDUCATION",
    title: "Evidence-led institutional excellence.",
    description:
      "Coordinate IQAC work, programme outcomes and reporting across NAAC, NBA and NIRF preparation.",
    href: "/heis-accreditations",
    image: "/assets/lb-image.webp",
    cta: "Explore HEI accreditations",
  },
  {
    category: "GROUPS OF INSTITUTIONS",
    title: "One vision across every campus.",
    description:
      "Give leadership a shared view of quality, campus progress, common standards and improvement priorities.",
    href: "/group-of-institutions",
    image: "/assets/lb-luneblaze.webp",
    cta: "Explore group governance",
  },
];

export default function PathwaysSection() {
  return (
    <section
      className="relative overflow-hidden px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]"
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.36]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
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
          <h2 className="mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            One quality ecosystem.{" "}
            <span className="text-[#17AEB9]">Built for your institution.</span>
          </h2>
        </div>

        {/* card grid */}
        <div
          className="mt-[clamp(24px,3vw,36px)] grid border border-[#C9D9DC] bg-white"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          }}
        >
          {pathways.map((item) => (
            <Link
              key={item.category}
              href={item.href}
              className="group relative flex flex-col border-b border-r border-[#D6E3E5] p-[clamp(26px,3vw,38px)] text-[#152A2E] transition-colors hover:bg-[#F4FAFA]"
            >
              <div
                className="mb-[22px] h-[190px] rounded-none border border-[#E6EEEF] bg-white bg-contain bg-center bg-no-repeat p-[10px]"
                style={{
                  marginLeft: "-6px",
                  marginRight: "-6px",
                  marginTop: "-6px",
                  backgroundImage: `url('${item.image}')`,
                  backgroundOrigin: "content-box",
                }}
              />

              <div className="text-[12px] font-extrabold tracking-[.08em] text-[#0E8B95]">
                {item.category}
              </div>

              <h3 className="mt-[10px] text-[clamp(21px,2vw,25px)] font-extrabold leading-[1.2] tracking-[-.02em]">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-[15px] leading-[1.65] text-[#4C6165]">
                {item.description}
              </p>

              <span className="mt-[22px] text-[15px] font-bold text-[#0E8B95]">
                {item.cta} ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}