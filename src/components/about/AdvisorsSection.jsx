// src/components/about/AdvisorsSection.jsx
"use client";

const ADVISOR_IMAGES = [
  { src: "/assets/advisor-1.png", alt: "Ms. Kalyani Dixit" },
  { src: "/assets/advisor-2.png", alt: "Ms. Mini Johny" },
  { src: "/assets/advisor-3.png", alt: "Dr. Kshma Swarnkar" },
  { src: "/assets/advisor-8.png", alt: "Dr. Rakhee Chaudhary" },
  { src: "/assets/advisor-12.png", alt: "Dr. Manjari Tejpal" },
  { src: "/assets/advisor-6.png", alt: "Mr. Naresh Sharma" },
  { src: "/assets/advisor-16.png", alt: "Dr. Bani Godara" },
];

const EXPERTISE = [
  "Accreditation & quality assurance",
  "Teacher training & capacity building",
  "School leadership & governance",
  "SQAAF, NAAC & CBSE practice",
];

const STATS = [
  { value: "50+", label: "Education leaders & quality experts", color: "#0E8B95" },
  { value: "5", label: "Frameworks supported", color: "#152A2E" },
  { value: "India", label: "and institutions abroad", color: "#152A2E" },
];

export default function AdvisorsSection() {
  return (
    <section
      id="advisors"
      style={{
        position: "relative",
        margin: "clamp(10px,1.5vw,20px) clamp(10px,1.5vw,20px) 0",
        background: "#FCFDFD",
        border: "1px solid #DCEAEC",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap" }}>
        {/* Left: photos + stats */}
        <div
          style={{
            position: "relative",
            flex: "1 1 420px",
            minWidth: 0,
            padding: "clamp(40px,4.6vw,68px) clamp(22px,4vw,56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
            background: "#EDF7F8",
            borderRight: "1px solid #DBEDEF",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.42,
              backgroundImage:
                "radial-gradient(circle,rgba(23,174,185,.2) 1.1px,transparent 1.1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-38%",
              left: "-18%",
              width: 440,
              height: 440,
              pointerEvents: "none",
              animation: "lbSpin 130s linear infinite",
            }}
          >
            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(23,174,185,.16)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: "16%", border: "1px dashed rgba(23,174,185,.16)", borderRadius: "50%" }} />
          </div>

          <div
            data-reveal=""
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(4,minmax(0,1fr))",
              gap: "clamp(10px,1.2vw,16px)",
              maxWidth: 440,
            }}
          >
            {ADVISOR_IMAGES.map((a) => (
              <img
                key={a.src}
                src={a.src}
                alt={a.alt}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "3px solid #fff",
                  boxShadow: "0 14px 28px -16px rgba(15,60,66,.55)",
                }}
              />
            ))}
            <a
              href="/advisors.html"
              aria-label="See all advisors"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: "#0E7A83",
                border: "3px solid #fff",
                color: "#fff",
                fontSize: "clamp(14px,1.4vw,18px)",
                fontWeight: 800,
                letterSpacing: "-.02em",
                textDecoration: "none",
                boxShadow: "0 14px 28px -16px rgba(15,60,66,.55)",
              }}
            >
              +40
            </a>
          </div>

          <div
            data-reveal=""
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              border: "1px solid #BEE2E6",
              background: "#fff",
              maxWidth: 440,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: "1 1 120px",
                  padding: "16px 18px",
                  borderRight: i < STATS.length - 1 ? "1px solid #DBEDEF" : "none",
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(28px,3vw,40px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-.04em", color: s.color }}>
                  {s.value}
                </span>
                <span style={{ display: "block", marginTop: 6, fontSize: 12, lineHeight: 1.45, fontWeight: 700, color: "#4C6165" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: copy + expertise + CTAs */}
        <div
          data-reveal=""
          style={{
            position: "relative",
            flex: "1 1 460px",
            minWidth: 0,
            padding: "clamp(40px,4.6vw,68px) clamp(22px,4vw,56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 18,
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
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#0E7A83",
              whiteSpace: "nowrap",
            }}
          >
            <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: "#17AEB9", animation: "lbPulse 2.4s ease-in-out infinite" }} />
            Our advisors
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(26px,3.2vw,44px)",
              lineHeight: 1.08,
              letterSpacing: "-.032em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            Guided by experience.{" "}
            <span style={{ display: "block", color: "#17AEB9" }}>Strengthened by expertise.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: "56ch", fontSize: "clamp(14px,1.1vw,16.5px)", lineHeight: 1.68, color: "#5F7175" }}>
            Behind the platform is a network of principals, CBSE resource persons, master
            trainers and accreditation specialists. They work alongside your team on
            implementation, training and quality reviews.
          </p>
          <ul
            style={{
              listStyle: "none",
              margin: "4px 0 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: "10px 22px",
              width: "100%",
              maxWidth: 540,
            }}
          >
            {EXPERTISE.map((x) => (
              <li key={x} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5, fontWeight: 700, color: "#152A2E" }}>
                <span aria-hidden="true" style={{ color: "#17AEB9" }}>✓</span>
                {x}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
            <a
              href="/advisors.html"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#17AEB9",
                color: "#fff",
                padding: "15px 24px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 16px 32px -14px rgba(23,174,185,.85)",
              }}
            >
              Meet our advisors <span>↗</span>
            </a>
            <a
              href="/advisor-apply.html"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: "#152A2E",
                border: "1px solid #B2D6DB",
                padding: "14px 22px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Join the advisory network
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}