// src/components/about/MissionVisionSection.jsx
"use client";

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.4 2.4 14.6 0 17" />
    </svg>
  );
}

function Check({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const MISSION_POINTS = [
  "One ecosystem instead of scattered spreadsheets",
  "Evidence linked to the standard it answers",
  "Improvement that carries across cycles",
];

const VISION_POINTS = [
  "Quality culture, not compliance theatre",
  "Frameworks understood, not just filed",
  "Leadership decisions made on evidence",
];

export default function MissionVisionSection() {
  return (
    <section
      id="mission"
      style={{
        position: "relative",
        padding: "clamp(44px,5vw,74px) clamp(20px,4vw,52px)",
        background: "#EDF7F8",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.34,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
      </div>

      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto" }}>
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(24px,3.08vw,40px)",
              lineHeight: 1.09,
              letterSpacing: "-.032em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            Our Mission and Vision
          </h2>
          <p style={{ margin: "14px auto 0", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.66, color: "#5F7175" }}>
            Why Luneblaze exists, and what we are building towards.
          </p>
        </div>

        <div
          data-mvgrid=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: "clamp(14px,1.6vw,22px)",
            marginTop: "clamp(24px,2.8vw,36px)",
          }}
        >
          {/* Mission card */}
          <div
            data-mvcard=""
            data-reveal=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 15,
              background: "#fff",
              border: "1px solid #DCEAEC",
              borderRadius: 10,
              padding: "clamp(20px,2.2vw,30px)",
              boxShadow: "0 2px 4px rgba(23,35,38,.03),0 30px 60px -42px rgba(15,60,66,.45)",
              transition: "transform .32s cubic-bezier(.22,.8,.2,1),border-color .32s ease,box-shadow .32s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "#17AEB9";
              e.currentTarget.style.boxShadow = "0 34px 64px -34px rgba(15,60,66,.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderColor = "#DCEAEC";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(23,35,38,.03),0 30px 60px -42px rgba(15,60,66,.45)";
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                flex: "none",
                borderRadius: "50%",
                boxShadow: "0 0 0 7px #E4F5F666",
                background: "#E4F5F6",
                color: "#17AEB9",
              }}
            >
              <IconShield />
            </span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#17AEB9" }}>
                Mission
              </div>
              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(19px,2vw,25px)",
                  lineHeight: 1.18,
                  letterSpacing: "-.026em",
                  fontWeight: 800,
                  color: "#152A2E",
                }}
              >
                Make institutional quality measurable and manageable
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(13.5px,1.05vw,15px)",
                lineHeight: 1.7,
                color: "#5F7175",
                flex: 1,
              }}
            >
              To give every school and college a system that turns quality from an annual
              scramble into a continuous practice — where assessment, evidence, audit and
              improvement live in one place and survive the people who set them up.
            </p>
            <div style={{ display: "grid", gap: 9, paddingTop: 15, borderTop: "1px solid #EDF4F5" }}>
              {MISSION_POINTS.map((p) => (
                <span key={p} style={{ display: "flex", gap: 9, fontSize: 12.5, lineHeight: 1.55, fontWeight: 600, color: "#3E5257" }}>
                  <Check color="#17AEB9" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Vision card */}
          <div
            data-mvcard=""
            data-reveal=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 15,
              background: "#fff",
              border: "1px solid #DCEAEC",
              borderRadius: 10,
              padding: "clamp(20px,2.2vw,30px)",
              boxShadow: "0 2px 4px rgba(23,35,38,.03),0 30px 60px -42px rgba(15,60,66,.45)",
              transition: "transform .32s cubic-bezier(.22,.8,.2,1),border-color .32s ease,box-shadow .32s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "#5B5BD6";
              e.currentTarget.style.boxShadow = "0 34px 64px -34px rgba(15,60,66,.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderColor = "#DCEAEC";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(23,35,38,.03),0 30px 60px -42px rgba(15,60,66,.45)";
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                flex: "none",
                borderRadius: "50%",
                boxShadow: "0 0 0 7px #EEEFFB66",
                background: "#EEEFFB",
                color: "#5B5BD6",
              }}
            >
              <IconGlobe />
            </span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#5B5BD6" }}>
                Vision
              </div>
              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(19px,2vw,25px)",
                  lineHeight: 1.18,
                  letterSpacing: "-.026em",
                  fontWeight: 800,
                  color: "#152A2E",
                }}
              >
                Quality institutions, quality education — at scale
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(13.5px,1.05vw,15px)",
                lineHeight: 1.7,
                color: "#5F7175",
                flex: 1,
              }}
            >
              A country where every institution, from a single school to a network of
              universities, can see exactly where it stands on quality and knows its
              next step. Where accreditation is a by-product of good practice rather than
              the reason for it.
            </p>
            <div style={{ display: "grid", gap: 9, paddingTop: 15, borderTop: "1px solid #EDF4F5" }}>
              {VISION_POINTS.map((p) => (
                <span key={p} style={{ display: "flex", gap: 9, fontSize: 12.5, lineHeight: 1.55, fontWeight: 600, color: "#3E5257" }}>
                  <Check color="#5B5BD6" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}