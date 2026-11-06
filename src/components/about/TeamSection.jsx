// src/components/about/TeamSection.jsx
"use client";

const TEAM = [
  {
    name: "Mahendra Manral",
    role: "Founder",
    bio: "Leads Luneblaze's work with institutions on quality and accreditation, and sets the direction of the platform.",
    slotId: "team-mahendra",
    placeholder: "Mahendra Manral — portrait",
  },
  {
    name: "Simriti Khatri",
    role: "Quality & Accreditation",
    bio: "Works with schools and colleges through their assessment, documentation and audit cycles end to end.",
    slotId: "team-simriti",
    placeholder: "Simriti Khatri — portrait",
  },
  {
    name: "Kalyani Dixit",
    role: "Institutional Partnerships",
    bio: "Supports institutions and groups from onboarding through to accreditation readiness.",
    slotId: "team-kalyani",
    placeholder: "Kalyani Dixit — portrait",
  },
];

export default function TeamSection() {
  return (
    <section
      id="team"
      style={{
        position: "relative",
        padding: "clamp(44px,5vw,74px) clamp(20px,4vw,52px)",
        background: "#FCFDFD",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 44s linear infinite reverse",
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
            The Team
          </h2>
          <p style={{ margin: "14px auto 0", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.66, color: "#5F7175" }}>
            A small team working directly with institutions on the quality work itself.
          </p>
        </div>

        <div
          data-teamgrid=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "clamp(13px,1.5vw,20px)",
            marginTop: "clamp(24px,2.8vw,36px)",
          }}
        >
          {TEAM.map((m, i) => (
            <div
              key={m.name}
              data-teamcard=""
              data-reveal=""
              data-delay={i * 80}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: "1px solid #DCEAEC",
                borderRadius: 10,
                overflow: "hidden",
                transition: "transform .34s cubic-bezier(.22,.8,.2,1),border-color .34s ease,box-shadow .34s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.borderColor = "#17AEB9";
                e.currentTarget.style.boxShadow = "0 32px 60px -34px rgba(15,60,66,.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "#DCEAEC";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                data-teamphoto=""
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  background: "#EDF4F5",
                  flex: "none",
                  overflow: "hidden",
                }}
              >
                <image-slot
                  id={m.slotId}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                  shape="rect"
                  placeholder={m.placeholder}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "clamp(17px,1.9vw,23px)", flex: 1 }}>
                <span style={{ display: "block", fontSize: "clamp(17px,1.7vw,20px)", fontWeight: 800, letterSpacing: "-.022em", color: "#152A2E" }}>
                  {m.name}
                </span>
                <span style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#0E8B95" }}>
                  {m.role}
                </span>
                <p style={{ margin: "5px 0 0", fontSize: 13, lineHeight: 1.66, color: "#5F7175", flex: 1 }}>
                  {m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}