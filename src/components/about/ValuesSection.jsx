// src/components/about/ValuesSection.jsx
"use client";

const VALUES = [
  {
    n: "01",
    title: "Built on framework reality",
    desc: "Every module maps to how assessors, IQAC teams and leadership actually work through a cycle.",
  },
  {
    n: "02",
    title: "Practitioner-led",
    desc: "An advisory panel of quality professionals shapes the frameworks and review logic in the product.",
  },
  {
    n: "03",
    title: "Evidence first",
    desc: "If a claim cannot be evidenced, the platform surfaces it rather than hiding it.",
  },
  {
    n: "04",
    title: "Systems over paperwork",
    desc: "We optimise for what survives staff changes, not for what fills a submission.",
  },
  {
    n: "05",
    title: "Continuous, not episodic",
    desc: "What an institution learns in one cycle feeds the next.",
  },
  {
    n: "06",
    title: "Support that answers",
    desc: "Dedicated expert guidance per institution, not a ticket queue.",
  },
];

export default function ValuesSection() {
  return (
    <section
      id="values"
      style={{
        position: "relative",
        padding: "clamp(46px,5vw,76px) clamp(20px,4vw,52px)",
        background: "#FCFDFD",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
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
      </div>

      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto" }}>
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
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
            How We Work
          </h2>
          <p
            style={{
              margin: "14px auto 0",
              fontSize: "clamp(14px,2vw,16px)",
              lineHeight: 1.66,
              color: "#5F7175",
            }}
          >
            We are not a document vendor. Our aim is that an institution finishes a
            cycle with systems it keeps, not a folder it files.
          </p>
        </div>

        <div
          data-solgrid=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "clamp(10px,1.2vw,15px)",
            marginTop: "clamp(26px,3vw,40px)",
          }}
        >
          {VALUES.map((c, i) => (
            <div
              key={c.n}
              data-reveal=""
              data-delay={(i % 3) * 60}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 13,
                background: "#fff",
                border: "1px solid #E4EEEF",
                borderRadius: 10,
                padding: "20px 19px",
                transition: "transform .3s cubic-bezier(.22,.8,.2,1),border-color .3s ease,box-shadow .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#0E8B95";
                e.currentTarget.style.boxShadow = "0 22px 44px -28px rgba(15,60,66,.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "#E4EEEF";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 37,
                  height: 37,
                  flex: "none",
                  borderRadius: 10,
                  background: "#E4F5F6",
                  color: "#0E8B95",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {c.n}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: "-.015em", color: "#152A2E" }}>
                  {c.title}
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "#5F7175" }}>
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