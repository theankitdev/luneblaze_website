// src/components/shared/PillarGridSection.jsx
"use client";

export default function PillarGridSection({
  id = "group-ecosystem",
  eyebrow = "Monitor every school. Measure every standard.",
  heading = "The quality ecosystem,",
  headingHighlight = "working across your group.",
  description = "Systems create consistency. Expertise strengthens practice. Governance turns visibility into informed action.",
  items = DEFAULT_ITEMS,
  background = "#ffffff",
  accentColor = "#17AEB9",
  minCol = "320px",
}) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background,
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.36,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-18%",
            right: "-8%",
            width: "min(460px,48vw)",
            height: "min(460px,48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid rgba(23,174,185,.14)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "26%",
              border: "1px dashed rgba(23,174,185,.12)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div data-rv="" style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(223,241,243,.9)",
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
              fontSize: "clamp(28px,3.4vw,46px)",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              color: "#152A2E",
            }}
          >
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
          {description && (
            <p
              style={{
                margin: "16px auto 0",
                maxWidth: 700,
                fontSize: 17,
                lineHeight: 1.7,
                color: "#4C6165",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Pillar grid */}
        <div
          style={{
            marginTop: "clamp(32px,4.5vw,52px)",
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${minCol}),1fr))`,
            border: "1px solid #C9D9DC",
            background: "#fff",
          }}
        >
          {items.map((item, i) => (
            <article
              key={item.title}
              data-rv=""
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "clamp(24px,2.8vw,34px)",
                borderRight: "1px solid #D6E3E5",
                borderBottom: "1px solid #D6E3E5",
                borderTop:
                  i === 0 ? `3px solid ${accentColor}` : "3px solid transparent",
                transition: "background .25s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4FAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  borderRadius: 3,
                  background: accentColor,
                  padding: "5px 9px",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  color: "#fff",
                }}
              >
                {item.badge || String(i + 1).padStart(2, "0")}
              </span>
              <h3
                style={{
                  margin: "18px 0 0",
                  fontWeight: 800,
                  fontSize: "clamp(19px,1.7vw,22px)",
                  lineHeight: 1.25,
                  letterSpacing: "-.015em",
                  color: "#152A2E",
                }}
              >
                {item.title}
              </h3>
              {item.desc && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "#4C6165",
                  }}
                >
                  {item.desc}
                </p>
              )}
              {item.list && item.list.length > 0 && (
                <ul
                  style={{
                    listStyle: "none",
                    margin: "18px 0 0",
                    padding: 0,
                    borderTop: "1px solid #E6EEEF",
                  }}
                >
                  {item.list.map((li) => (
                    <li
                      key={li}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "11px 0",
                        borderBottom: "1px solid #E6EEEF",
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "#152A2E",
                      }}
                    >
                      <span
                        style={{ color: accentColor, fontWeight: 800, flex: "none" }}
                      >
                        ✓
                      </span>
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_ITEMS = [
  {
    badge: "01 / BUILD",
    title: "Quality Systems",
    desc: "The infrastructure for consistent implementation at every campus.",
    list: [
      "Centralized document & evidence management",
      "Domain-wise workflows, teams & task ownership",
      "SQAAF implementation & portal filing support",
      "Standardized policies, SOPs & quality frameworks",
    ],
  },
  {
    badge: "02 / STRENGTHEN",
    title: "Quality Excellence",
    desc: "Practical expertise that helps schools improve everyday quality.",
    list: [
      "Expert implementation & documentation assistance",
      "Mock audits & readiness assessments",
      "Classroom observations & teaching assessments",
      "Training, capacity building & stakeholder feedback",
    ],
  },
  {
    badge: "03 / LEAD",
    title: "Quality Governance",
    desc: "The visibility leadership needs to make better decisions.",
    list: [
      "AI-powered group quality dashboard",
      "Continuous monitoring with Readiness Score™",
      "School rankings & group benchmarking",
      "Performance analytics & executive reports",
    ],
  },
];