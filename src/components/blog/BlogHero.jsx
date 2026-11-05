// src/components/blog/BlogHero.jsx
"use client";

import Link from "next/link";

export default function BlogHero() {
  return (
    <section
      style={{
        position: "relative",
        padding:
          "clamp(50px,4vw,158px) clamp(20px,4vw,52px) clamp(34px,4vw,54px)",
        overflow: "hidden",
        background: "#fff",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.42,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-26%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(860px,94vw)",
            height: "min(860px,94vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(23,174,185,.14)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "18%", border: "1px dashed rgba(23,174,185,.13)", borderRadius: "50%" }} />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12, fontWeight: 600, color: "#5F7175" }}>
          <Link href="/" style={{ color: "#5F7175" }}>Home</Link>
          <span aria-hidden="true" style={{ color: "#B6CDD0" }}>/</span>
          <span style={{ color: "#0E8B95", fontWeight: 700 }}>Blogs</span>
        </div>
        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(32px,4.4vw,58px)",
            lineHeight: 1.05,
            letterSpacing: "-.036em",
            fontWeight: 800,
            color: "#152A2E",
          }}
        >
          Practical Knowledge.{" "}
          <span style={{ color: "#17AEB9" }}>Stronger Institutional Systems</span>
        </h1>
        <p
          style={{
            margin: "18px 0 0",
            maxWidth: "60ch",
            fontSize: "clamp(14.5px,1.15vw,17px)",
            lineHeight: 1.66,
            color: "#4C6165",
          }}
        >
          Explore guidance on assessment, evidence, team ownership and continuous
          improvement for schools and higher education.
        </p>
      </div>
    </section>
  );
}