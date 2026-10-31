// src/components/heis/OneInstitutionDifferentPurposes.jsx
"use client";

const items = [
  {
    title: "NAAC · Institutional quality",
    desc: "Coordinate institution-wide evidence, IQAC activities, departmental contributions and applicable reporting requirements.",
    logo: "/assets/fw-naac.png",
  },
  {
    title: "NBA · Programme quality",
    desc: "Organise outcome-based education, CO–PO mapping, attainment evidence and programme improvement.",
    logo: "/assets/fw-nba.png",
  },
  {
    title: "NIRF · Ranking preparation",
    desc: "Bring parameter-wise data, research records and graduate outcomes into a consistent submission workflow.",
    logo: "/assets/fw-nirf.png",
  },
];

export default function OneInstitutionDifferentPurposes() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background: "#F4F8F8",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      {/* d1 decorative bg — purple dots + reverse rotating ring bottom-left */}
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
            opacity: 0.42,
            backgroundImage:
              "radial-gradient(circle,rgba(91,91,214,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 44s linear infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-24%",
            left: "2%",
            width: "min(440px,46vw)",
            height: "min(440px,46vw)",
            animation: "lbSpinRev 108s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid rgba(91,91,214,.16)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "26%",
              border: "1px dashed rgba(91,91,214,.14)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Heading */}
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
                background: "#17AEB9",
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            One institution, different purposes
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
            Connect the evidence.{" "}
            <span style={{ color: "#17AEB9" }}>Respect each framework.</span>
          </h2>
        </div>

        {/* 3-column grid */}
        <div
          style={{
            marginTop: "clamp(32px,4.5vw,52px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
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
                  i === 0 ? "3px solid #17AEB9" : "3px solid transparent",
                transition: "background .25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F4FAFA")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    color: "#fff",
                    background: "#17AEB9",
                    padding: "5px 9px",
                    borderRadius: 3,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.logo && (
                  <div
                    role="img"
                    aria-label={item.title}
                    style={{
                      width: 56,
                      height: 56,
                      border: "1px solid #E6EEEF",
                      background: `#fff url('${item.logo}') center/72% no-repeat`,
                    }}
                  />
                )}
              </div>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}