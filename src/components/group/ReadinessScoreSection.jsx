// src/components/shared/ReadinessScoreSection.jsx
"use client";

const DEFAULT_ROWS = [
  { school: "Campus North", score: 86, focus: "Review cycle", color: "#17AEB9" },
  { school: "Campus Central", score: 78, focus: "Staff participation", color: "#17AEB9" },
  { school: "Campus South", score: 64, focus: "Documentation", color: "#E0A42B" },
];

export default function ReadinessScoreSection({
  eyebrow = "Readiness Score™ across your group",
  heading = "See each school’s readiness.",
  headingHighlight = "Focus the next intervention.",
  description = "View individual school scores based on Documentation Status, Staff Inclusivity and Audit Frequency. Use them alongside domain-level progress, evidence and review findings.",
  note = "Readiness Score™ is an internal indicator. It does not predict an official SQAAF grade or accreditation outcome.",
  tableTitle = "Campus readiness",
  rows = DEFAULT_ROWS,
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
          {/* LEFT — eyebrow + heading + copy + note */}
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
            {note && (
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "#6A7C80",
                  borderLeft: `3px solid ${accentColor}`,
                  paddingLeft: 12,
                }}
              >
                {note}
              </p>
            )}
          </div>

          {/* RIGHT — campus readiness table */}
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
            <div style={{ border: "1px solid #C9D9DC" }}>
              {/* header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 18px",
                  borderBottom: "1px solid #D6E3E5",
                  background: "#F7FAFA",
                }}
              >
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>
                  {tableTitle}
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0E8B95",
                    border: "1px solid #B7E2E5",
                    background: "#EDF7F8",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  Illustrative data
                </span>
              </div>

              {/* column headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.2fr) 80px minmax(0,1.2fr)",
                  gap: 12,
                  padding: "10px 18px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  color: "#6A7C80",
                  borderBottom: "1px solid #E6EEEF",
                }}
              >
                <span>SCHOOL</span>
                <span>SCORE</span>
                <span>FOCUS AREA</span>
              </div>

              {/* rows */}
              {rows.map((r) => (
                <div
                  key={r.school}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0,1.2fr) 80px minmax(0,1.2fr)",
                    gap: 12,
                    alignItems: "center",
                    padding: "15px 18px",
                    borderBottom: "1px solid #EEF3F4",
                    fontSize: 14.5,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{r.school}</span>
                  <span>
                    <b>{r.score}/100</b>
                    <span
                      style={{
                        display: "block",
                        marginTop: 5,
                        height: 5,
                        background: "#E6EEEF",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          height: "100%",
                          width: `${r.score}%`,
                          background: r.color,
                        }}
                      />
                    </span>
                  </span>
                  <span style={{ color: "#4C6165" }}>{r.focus}</span>
                </div>
              ))}

              {/* footnote */}
              <p
                style={{
                  margin: 0,
                  padding: "12px 18px",
                  fontSize: 12.5,
                  color: "#6A7C80",
                }}
              >
                Sample schools and values for illustration only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}