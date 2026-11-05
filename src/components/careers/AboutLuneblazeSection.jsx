// src/components/careers/AboutLuneblazeSection.jsx
"use client";

const POINTS = [
  {
    n: "01",
    title: "Small team, real ownership",
    desc: "You will own an area outright rather than a slice of someone else's backlog.",
  },
  {
    n: "02",
    title: "Close to institutions",
    desc: "Everyone here talks to schools and colleges. The feedback loop is days, not quarters.",
  },
  {
    n: "03",
    title: "Work that compounds",
    desc: "What we build stays in use through cycle after cycle at every institution we serve.",
  },
];

export default function AboutLuneblazeSection() {
  return (
    <section
      id="about-lb"
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
        {/* Centered heading + paragraphs */}
        <div data-reveal="" style={{ textAlign: "center",  margin: "0 auto" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(30px,3.6vw,48px)",
              lineHeight: 1.1,
              letterSpacing: "-.034em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            About Luneblaze
          </h2>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 820,
              fontSize: "clamp(16px,1.25vw,19px)",
              lineHeight: 1.72,
              color: "#5F7175",
            }}
          >
            Luneblaze is an AI-powered quality and accreditation management platform for
            schools, colleges and institution groups, built by Avadna Services Pvt Ltd in
            Faridabad. We have worked with educational institutions on quality and
            accreditation since 2017, and today support more than 100 institutions across
            India and internationally.
          </p>
          <p
            style={{
              margin: "16px auto 0",
              fontSize: "clamp(16px,1vw,19px)",
              lineHeight: 1.72,
              color: "#5F7175",
            }}
          >
            We built the platform because the work itself — assessment, documentation,
            evidence, audit, reporting — was being done in spreadsheets and email threads
            that could not survive a review. If you have lived inside accreditation, or you
            build software that has to be right, you will recognise the problem.
          </p>
        </div>

        <div
          data-solgrid=""
          data-cols="3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "clamp(14px,1.6vw,22px)",
            marginTop: "clamp(32px,3.6vw,48px)",
          }}
        >
          {POINTS.map((c, i) => (
            <div
              key={c.n}
              data-reveal=""
              data-delay={i * 60}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#fff",
                border: "1px solid #E4EEEF",
                borderRadius: 10,
                padding: "clamp(24px,2.4vw,32px)",
                transition: "transform .3s cubic-bezier(.22,.8,.2,1),border-color .3s ease,box-shadow .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#17AEB9";
                e.currentTarget.style.boxShadow = "0 22px 44px -28px rgba(15,60,66,.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "#E4EEEF";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 46,
                  flex: "none",
                  borderRadius: "50%",
                  boxShadow: "0 0 0 7px #E4F5F666",
                  background: "#E4F5F6",
                  color: "#0E8B95",
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                {c.n}
              </span>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "clamp(17px,1.5vw,20px)",
                    lineHeight: 1.25,
                    fontWeight: 800,
                    letterSpacing: "-.02em",
                    color: "#152A2E",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    margin: "9px 0 0",
                    fontSize: "clamp(14px,1.05vw,15.5px)",
                    lineHeight: 1.65,
                    color: "#5F7175",
                  }}
                >
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}