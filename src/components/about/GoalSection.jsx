// src/components/about/GoalSection.jsx
"use client";

function GoalIcon({ kind }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "target")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.4" />
      </svg>
    );
  if (kind === "building")
    return (
      <svg {...common}>
        <path d="M4 20h16" />
        <path d="M5.5 20V10l6.5-5 6.5 5v10" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  if (kind === "doc")
    return (
      <svg {...common}>
        <path d="M14 3v5h5" />
        <path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5Z" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    );
  if (kind === "people")
    return (
      <svg {...common}>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
        <path d="M16 6.8a3 3 0 0 1 0 5.9" />
        <path d="M18.5 19.5c0-2.4-1-4-3-4.6" />
      </svg>
    );
  if (kind === "refresh")
    return (
      <svg {...common}>
        <path d="M20 12a8 8 0 1 1-2.3-5.6" />
        <path d="M20 4v4.5h-4.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </svg>
  );
}

const GOALS = [
  {
    icon: "target",
    color: "#17AEB9",
    bg: "#E4F5F6",
    ring: "#E4F5F666",
    title: "Make quality measurable",
    desc: "Every institution should be able to state where it stands on quality with evidence, not adjectives — and know its next step without waiting for an assessor to tell it.",
  },
  {
    icon: "building",
    color: "#0E9F6E",
    bg: "#E8F7EF",
    ring: "#E8F7EF66",
    title: "Reach institutions of every size",
    desc: "Not just the well-resourced ones. A single rural school should have the same structured system available to it as a university group with a quality department.",
  },
  {
    icon: "doc",
    color: "#5B5BD6",
    bg: "#EEEFFB",
    ring: "#EEEFFB66",
    title: "End the paperwork scramble",
    desc: "Documentation should accumulate as a by-product of running the institution well, rather than being manufactured in the weeks before a review.",
  },
  {
    icon: "people",
    color: "#3B6FD4",
    bg: "#E9F1FD",
    ring: "#E9F1FD66",
    title: "Build capability, not dependency",
    desc: "Our training and advisory exist so institutional teams can eventually do this themselves. Success is a school that needs us less each cycle.",
  },
  {
    icon: "refresh",
    color: "#B98200",
    bg: "#FDF4DC",
    ring: "#FDF4DC66",
    title: "Make improvement continuous",
    desc: "A cycle should begin where the last one ended. We are building for compounding maturity rather than annual resets.",
  },
  {
    icon: "shield",
    color: "#0E8B95",
    bg: "#E4F5F6",
    ring: "#E4F5F666",
    title: "Raise the floor nationally",
    desc: "If enough institutions run real quality systems, accreditation stops being a badge some chase and becomes the baseline students can expect.",
  },
];

export default function GoalSection() {
  return (
    <section
      id="goal"
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
        <div
          style={{
            position: "absolute",
            top: "-22%",
            right: "-8%",
            width: "min(460px,48vw)",
            height: "min(460px,48vw)",
            animation: "lbSpin 122s linear infinite",
          }}
        >
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(23,174,185,.14)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "26%", border: "1px dashed rgba(23,174,185,.12)", borderRadius: "50%" }} />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto" }}>
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 740, margin: "0 auto" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(25px,3.2vw,42px)",
              lineHeight: 1.08,
              letterSpacing: "-.034em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            Our Goal Towards the Education Industry
          </h2>
          <p style={{ margin: "15px 0 0", fontSize: "clamp(14.5px,1.12vw,16.5px)", lineHeight: 1.68, color: "#5F7175" }}>
            Quality in Indian education is still measured too late and documented too
            thinly. We want to change where that work sits — from a scramble before an
            inspection to something an institution simply runs.
          </p>
        </div>

        <div
          data-goalgrid=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "clamp(11px,1.3vw,17px)",
            marginTop: "clamp(28px,3.2vw,44px)",
          }}
        >
          {GOALS.map((g, i) => (
            <div
              key={g.title}
              data-goalcard=""
              data-reveal=""
              data-delay={(i % 3) * 70}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 13,
                background: "#fff",
                border: "1px solid #DCEAEC",
                borderRadius: 10,
                padding: "clamp(19px,2.1vw,26px)",
                transition: "transform .32s cubic-bezier(.22,.8,.2,1),border-color .32s ease,box-shadow .32s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = g.color;
                e.currentTarget.style.boxShadow = "0 26px 52px -32px rgba(15,60,66,.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "#DCEAEC";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  flex: "none",
                  borderRadius: "50%",
                  boxShadow: `0 0 0 6px ${g.ring}`,
                  background: g.bg,
                  color: g.color,
                }}
              >
                <GoalIcon kind={g.icon} />
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "clamp(16px,1.6vw,19px)", fontWeight: 800, letterSpacing: "-.022em", color: "#152A2E" }}>
                  {g.title}
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.68, color: "#5F7175" }}>
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          data-reveal=""
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: "clamp(26px,3vw,40px)",
            padding: "18px 22px",
            background: "#fff",
            border: "1px solid #DCEAEC",
            borderRadius: 10,
            maxWidth: 820,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 1.62, fontWeight: 600, color: "#3E5257" }}>
            Quality Institutions. Quality Education. That is the whole of it — and it is
            why the platform exists.
          </span>
        </div>
      </div>
    </section>
  );
}