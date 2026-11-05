// src/components/careers/RolesSection.jsx
"use client";

const ROLES = [
  {
    slug: "quality-consultant",
    dept: "Consulting",
    type: "Full-time",
    title: "Quality & Accreditation Consultant",
    location: "Faridabad / Remote",
    desc: "Guide institutions through SQAAF, NABET or NAAC cycles end to end — assessment, documentation, evidence and audit readiness.",
  },
  {
    slug: "iqac-specialist",
    dept: "Consulting",
    type: "Full-time",
    title: "IQAC Implementation Specialist",
    location: "Remote",
    desc: "Work with college IQAC teams on criteria mapping, SSR preparation and DVV response.",
  },
  {
    slug: "frontend-engineer",
    dept: "Engineering",
    type: "Full-time",
    title: "Frontend Engineer",
    location: "Faridabad / Remote",
    desc: "Build the dashboards institutions run their quality cycle on. Careful, accessible, fast interfaces.",
  },
  {
    slug: "customer-success",
    dept: "Customer",
    type: "Full-time",
    title: "Customer Success Manager",
    location: "Faridabad",
    desc: "Own the relationship with a portfolio of institutions from onboarding through to accreditation.",
  },
  {
    slug: "content-training",
    dept: "Content",
    type: "Full-time",
    title: "Content & Training Associate",
    location: "Remote",
    desc: "Produce the guides, webinars and training that help quality teams do the work themselves.",
  },
  {
    slug: "business-development",
    dept: "Growth",
    type: "Full-time",
    title: "Business Development — Institutions",
    location: "Faridabad / Field",
    desc: "Work with school groups and universities to scope how Luneblaze fits their quality journey.",
  },
];

export default function RolesSection() {
  return (
    <section
      id="roles"
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
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 960, margin: "0 auto" }}>
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
            Current Openings
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
            Roles are listed as they open. If nothing matches but you think you belong
            here, write to us anyway — we read everything.
          </p>
        </div>

        <div
          data-solgrid=""
          data-twoup-phone=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "clamp(14px,1.6vw,22px)",
            marginTop: "clamp(32px,3.6vw,48px)",
          }}
        >
          {ROLES.map((r, i) => (
            <a
              key={r.slug}
              data-rolecard=""
              data-reveal=""
              data-delay={(i % 3) * 60}
              href={`/job-detail.html#role=${r.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#fff",
                border: "1px solid #E4EEEF",
                borderRadius: 10,
                padding: "clamp(24px,2.4vw,32px)",
                textDecoration: "none",
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
              <span style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    padding: "6px 13px",
                    background: "#E4F5F6",
                    borderRadius: 4,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: "#0E8B95",
                  }}
                >
                  {r.dept}
                </span>
                <span
                  style={{
                    padding: "6px 13px",
                    background: "#EEEFFB",
                    borderRadius: 4,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: "#5B5BD6",
                  }}
                >
                  {r.type}
                </span>
              </span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(17px,1.5vw,20px)",
                    fontWeight: 800,
                    letterSpacing: "-.02em",
                    lineHeight: 1.25,
                    color: "#152A2E",
                  }}
                >
                  {r.title}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(12.5px,1.05vw,14px)",
                    fontWeight: 700,
                    color: "#8A9B9E",
                    marginTop: 7,
                  }}
                >
                  {r.location}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(14px,1.05vw,15.5px)",
                    lineHeight: 1.65,
                    color: "#5F7175",
                    marginTop: 11,
                  }}
                >
                  {r.desc}
                </span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "clamp(13px,1vw,14.5px)",
                  fontWeight: 700,
                  color: "#0E8B95",
                }}
              >
                View role
                <span
                  data-arrow=""
                  style={{ display: "inline-flex", transition: "transform .28s cubic-bezier(.22,.8,.2,1)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h14" />
                    <path d="M12 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}