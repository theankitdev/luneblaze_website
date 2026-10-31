// src/components/shared/BeyondSqaafSection.jsx
"use client";

export default function BeyondSqaafSection({
  eyebrow = "Beyond SQAAF",
  heading = "NABET accreditation excellence,",
  headingHighlight = "across campuses.",
  description = "Support quality process mapping, documentation, quality manuals, gap assessment, corrective and preventive action tracking, mock audits and continuous compliance monitoring.",
  ctaLabel = "Explore NABET support ↗",
  ctaHref = "/nabet.html",
  items = DEFAULT_ITEMS,
  background = "#ffffff",
  accentColor = "#17AEB9",
}) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background,
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
            border: "1px solid #C9D9DC",
            background: "#fff",
          }}
        >
          {/* Left: eyebrow + heading + copy + primary CTA */}
          <div
            data-rv=""
            style={{
              padding: "clamp(28px,4vw,56px)",
              borderRight: "1px solid #D6E3E5",
              borderBottom: "1px solid #D6E3E5",
              background: "#EDF7F8",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "#fff",
                border: "1px solid #BEE2E6",
                borderRadius: 999,
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#0E7A83",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accentColor,
                  animation: "lbPulse 2.4s ease-in-out infinite",
                }}
              />
              {eyebrow}
            </span>
            <h2
              style={{
                margin: "14px 0 0",
                fontWeight: 800,
                fontSize: "clamp(26px,3vw,40px)",
                lineHeight: 1.12,
                letterSpacing: "-.03em",
                color: "#152A2E",
              }}
            >
              {heading}{" "}
              <span style={{ color: "#0E8B95" }}>{headingHighlight}</span>
            </h2>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#4C6165",
              }}
            >
              {description}
            </p>
            {ctaLabel && (
              <a
                href={ctaHref}
                style={{
                  marginTop: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: accentColor,
                  color: "#fff",
                  padding: "14px 22px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)",
                  transition: "background .25s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0E8B95")}
                onMouseLeave={(e) => (e.currentTarget.style.background = accentColor)}
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* Right: numbered/checked item list */}
          <div
            data-rv=""
            style={{
              padding: "clamp(20px,3vw,40px)",
              borderBottom: "1px solid #D6E3E5",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ borderTop: "1px solid #E6EEEF" }}>
              {items.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: 14,
                    padding: "18px 0",
                    borderBottom: "1px solid #E6EEEF",
                  }}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      border: "1px solid #B7E2E5",
                      background: "#EDF7F8",
                      color: "#0E8B95",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 13,
                      borderRadius: 3,
                    }}
                  >
                    {item.badge || String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span
                      style={{
                        display: "block",
                        fontWeight: 800,
                        fontSize: 17,
                        color: "#152A2E",
                      }}
                    >
                      {item.title}
                    </span>
                    {item.desc && (
                      <span
                        style={{
                          display: "block",
                          marginTop: 4,
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: "#4C6165",
                        }}
                      >
                        {item.desc}
                      </span>
                    )}
                    {item.ctaLabel && (
                      <a
                        href={item.ctaHref}
                        style={{
                          display: "inline-block",
                          marginTop: 10,
                          fontWeight: 700,
                          fontSize: 14.5,
                          color: "#0E8B95",
                        }}
                      >
                        {item.ctaLabel}
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_ITEMS = [
  {
    badge: "✓",
    title: "A shared standard. Local accountability.",
    desc: "Each school owns its implementation and evidence. Group leadership gets consistent frameworks, consolidated reporting and a clear picture of where support is needed.",
    ctaLabel: "Visit platform / Sign up ↗",
    ctaHref: "https://www.luneblaze.com",
  },
];