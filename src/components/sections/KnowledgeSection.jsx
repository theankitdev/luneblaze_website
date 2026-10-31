import Link from "next/link";

const resources = [
  {
    category: "WEBINARS",
    title: "Working sessions",
    description:
      "Explore webinar topics and enquire about training for your team.",
    href: "/webinars",
    bg: "#EEF8F9",
  },
  {
    category: "BLOGS",
    title: "Practical insights",
    description:
      "Guidance on evidence, teamwork, governance and continuous improvement.",
    href: "/blogs",
    bg: "#fff",
  },
  {
    category: "NEWS",
    title: "Platform updates",
    description:
      "Explore the capabilities supporting your quality journey.",
    href: "/news",
    bg: "#F2F7F8",
  },
];

export default function KnowledgeSection() {
  return (
    <section className="relative overflow-hidden border-y border-[#D6E3E5] bg-white px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]">
      {/* decorative bg */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
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
          <div className="absolute inset-0" style={{ animation: "lbSpin 130s linear infinite" }}>
            <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(23,174,185,.14)" }} />
            <div className="absolute rounded-full" style={{ inset: "24%", border: "1px dashed rgba(23,174,185,.12)" }} />
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
              Insights &amp; resources
            </span>
          </div>
          <h2 className="mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            Keep your quality team{" "}
            <span className="text-[#17AEB9]">moving.</span>
          </h2>
        </div>

        {/* cards */}
        <div
          className="lf-kq3 mt-8 grid gap-[clamp(14px,2.2vw,32px)]"
          style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}
        >
          {resources.map((resource) => (
            <Link
              key={resource.category}
              href={resource.href}
              className="flex min-h-[220px] flex-col rounded-[10px] border border-[#C9D9DC] p-[clamp(24px,3vw,40px)] text-[#152A2E] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#17AEB9] hover:shadow-[0_22px_44px_-28px_rgba(15,90,98,.45)]"
              style={{ background: resource.bg }}
            >
              <span className="inline-flex items-center gap-[10px] text-[12px] font-extrabold uppercase tracking-[.18em] text-[#0E7A83]">
                <span className="h-2 w-2 rounded-full bg-[#17AEB9]" />
                {resource.category}
              </span>
              <span className="mt-[22px] text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.2] tracking-[-.01em]">
                {resource.title} <span className="text-[#17AEB9]">↗</span>
              </span>
              <span className="mt-4 flex-1 text-[16px] leading-[1.7] text-[#4C6165]">
                {resource.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}