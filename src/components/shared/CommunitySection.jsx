// src/components/shared/CommunitySection.jsx
"use client";

const defaultItems = [
  {
    title: "SQAAF WhatsApp Group",
    desc: "Framework updates, templates and peer questions — the fastest way to stay current.",
    cta: "Join SQAAF Group ↗",
    href: "https://wa.me/918810418840",
    external: true,
  },
  {
    title: "LinkedIn Group",
    desc: "Discussion, announcements and peer questions from quality teams across India.",
    cta: "Follow us ↗",
    href: "https://www.linkedin.com/company/luneblaze",
    external: true,
  },
  {
    title: "Webinar Channel",
    desc: "Recorded sessions and walkthroughs you can share with your whole team.",
    cta: "Watch sessions ↗",
    href: "/webinars",
    external: false,
  },
  {
    title: "Monthly Newsletter",
    desc: "Framework updates, new templates and upcoming webinars, once a month.",
    cta: "View recent ↗",
    href: "https://www.linkedin.com/newsletters/7125753253224493056/",
    external: true,
  },
];

export default function CommunitySection({
  eyebrow = "School communities",
  heading = "Join Our School Communities",
  description = "A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes.",
  groupLabel = "SQAAF",
  items: itemsProp,
  bg = "#F4F8F8",
  accentColor = "#17AEB9",
}) {
  // Use provided items or the defaults (with first card's group label overridden)
  const baseItems = itemsProp || defaultItems;
  const items = baseItems.map((item, i) =>
    !itemsProp && i === 0
      ? {
          ...item,
          title: `${groupLabel} WhatsApp Group`,
          cta: `Join ${groupLabel} Group ↗`,
        }
      : item
  );

  return (
    <section
      className="relative overflow-hidden border-b border-[#D6E3E5] px-[clamp(16px,3vw,32px)] py-[clamp(44px,5vw,72px)]"
      style={{ backgroundColor: bg }}
    >
      {/* decorative bg — alternates between teal (left) and violet (right) */}
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

      <div className="relative mx-auto max-w-[1280px]">
        {/* heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{
                background: accentColor,
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 text-balance text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
            {description}
          </p>
        </div>

        {/* cards grid */}
        <div
          className="mt-[clamp(32px,4.5vw,52px)] grid border border-[#C9D9DC] bg-white"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,240px),1fr))",
          }}
        >
          {items.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="flex flex-col border-b border-r border-[#D6E3E5] p-[clamp(24px,2.8vw,34px)] text-[#152A2E] transition-colors hover:bg-[#F4FAFA]"
              style={{
                borderTop:
                  i === 0
                    ? `3px solid ${accentColor}`
                    : "3px solid transparent",
              }}
            >
              <span
                className="inline-flex w-fit rounded-[3px] px-[9px] py-[5px] text-[12px] font-extrabold tracking-[.08em] text-white"
                style={{ background: accentColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-[18px] text-[clamp(19px,1.7vw,22px)] font-extrabold leading-[1.25] tracking-[-.015em] text-[#152A2E]">
                {item.title}
              </h3>
              <p className="mt-[10px] flex-1 text-[15px] leading-[1.65] text-[#4C6165]">
                {item.desc}
              </p>
              <span className="mt-auto pt-5 text-[15px] font-bold text-[#0E8B95]">
                {item.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}