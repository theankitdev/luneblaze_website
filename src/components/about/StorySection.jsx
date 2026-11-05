// src/components/about/StorySection.jsx
"use client";

export default function StorySection() {
  return (
    <section
      id="story"
      style={{
        position: "relative",
        margin: "clamp(10px,1.5vw,20px)",
        padding: "clamp(46px,5vw,76px) clamp(20px,4vw,52px)",
        background: "#FCFDFD",
        border: "1px solid #E4EEEF",
        borderRadius: 10,
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
        <div data-reveal="">
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(24px,3vw,40px)",
              lineHeight: 1.09,
              letterSpacing: "-.032em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            Who We Are
          </h2>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(14px,1.08vw,16px)",
              lineHeight: 1.66,
              color: "#5F7175",
            }}
          >
            Luneblaze is built by Avadna Services Pvt Ltd, working with educational
            institutions on quality and accreditation since 2017. The platform exists
            because the work itself — assessment, documentation, evidence, audit,
            reporting — was being done in spreadsheets and email threads that could
            not survive a review.
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
          {[
            {
              n: "01",
              title: "Since 2017",
              desc: "Working with institutions on quality, accreditation and improvement.",
            },
            {
              n: "02",
              title: "100+ institutions",
              desc: "Schools and colleges across India and internationally.",
            },
            {
              n: "03",
              title: "Faridabad, Haryana",
              desc: "Avadna Services Pvt Ltd, Haryana 121006, India.",
            },
          ].map((c, i) => (
            <div
              key={c.n}
              data-reveal=""
              data-delay={i * 60}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "#fff",
                border: "1px solid #E4EEEF",
                borderRadius: 10,
                padding: "19px 18px",
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  flex: "none",
                  borderRadius: 10,
                  background: "#E4F5F6",
                  color: "#17AEB9",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {c.n}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, letterSpacing: "-.015em", color: "#152A2E" }}>
                  {c.title}
                </h3>
                <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.6, color: "#5F7175" }}>
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