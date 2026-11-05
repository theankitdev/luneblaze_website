// src/components/about/AboutHero.jsx
"use client";

export default function AboutHero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        padding: "clamp(112px,12vw,150px) clamp(20px,4vw,52px) clamp(40px,4.6vw,64px)",
        overflow: "hidden",
        background: "#fff",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.26,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(880px,94vw)",
            height: "min(880px,94vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(23,174,185,.14)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "18%", border: "1px dashed rgba(23,174,185,.13)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "36%", border: "1px solid rgba(91,91,214,.1)", borderRadius: "50%" }} />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            background: "#DFF1F3",
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
          About Us
        </span>
        <h1
          style={{
            margin: "20px 0 0",
            fontSize: "clamp(32px,4.4vw,58px)",
            lineHeight: 1.05,
            letterSpacing: "-.036em",
            fontWeight: 800,
            color: "#152A2E",
          }}
        >
          Quality Institutions.{" "}
          <span style={{ color: "#17AEB9" }}>Quality Education.</span>
        </h1>
        <p
          style={{
            margin: "19px auto 0",
            maxWidth: "62ch",
            fontSize: "clamp(14.5px,1.15vw,17.5px)",
            lineHeight: 1.66,
            color: "#4C6165",
          }}
        >
          AI-powered quality systems for schools, colleges, universities and groups of
          institutions — combining technology with implementation expertise.
        </p>
      </div>
    </section>
  );
}