// src/components/legal/LegalHero.jsx
"use client";

export default function LegalHero({
  eyebrow = "Privacy",
  title = "Privacy Policy",
  intro = "Luneblaze's mission is to connect people through the network and allow them to organise sessions in real time, helping themselves and others leave a better world behind. Central to this mission is our commitment to be transparent with you about the data we collect and how it is used and shared. By using our Services, you consent to our use of your data under this Privacy Policy.",
  updated = "Last updated: August 2026 · Avadna Services Pvt Ltd, Faridabad, Haryana 121006, India",
}) {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        padding:
          "clamp(50px,5vw,138px) clamp(20px,4vw,52px) clamp(24px,2.8vw,38px)",
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
            opacity: 0.24,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
      </div>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
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
          {eyebrow}
        </span>
        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(29px,3.6vw,46px)",
            lineHeight: 1.08,
            letterSpacing: "-.034em",
            fontWeight: 800,
            color: "#152A2E",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            maxWidth: "70ch",
            fontSize: "clamp(14.5px,1.15vw,17px)",
            lineHeight: 1.66,
            color: "#4C6165",
          }}
        >
          {intro}
        </p>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 12,
            fontWeight: 700,
            color: "#8A9B9E",
          }}
        >
          {updated}
        </p>
      </div>
    </section>
  );
}