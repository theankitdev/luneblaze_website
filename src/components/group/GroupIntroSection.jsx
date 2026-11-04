export default function GroupIntroSection() {
  return (
    <section
      id="group-intro"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background: "#fff",
      }}
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.36,
            backgroundImage:
              "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-18%",
            right: "-8%",
            width: "min(460px, 48vw)",
            height: "min(460px, 48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(23,174,185,.14)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "26%",
              borderRadius: "50%",
              border: "1px dashed rgba(23,174,185,.12)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* heading */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(223,241,243,.9)",
              border: "1px solid #BEE2E6",
              borderRadius: "999px",
              fontSize: "10.5px",
              fontWeight: 800,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#0E7A83",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#17AEB9",
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            Running a group of schools
          </span>
          <h2
            style={{
              margin: "14px 0 0",
              fontWeight: 800,
              fontSize: "clamp(28px,3.4vw,46px)",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              color: "#152A2E",
            }}
          >
            Many schools.{" "}
            <span style={{ color: "#17AEB9" }}>One connected system.</span>
          </h2>
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "700px",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            Different standards, no shared view, scattered evidence and
            readiness that changes from campus to campus — Luneblaze connects
            them all.
          </p>
        </div>

        {/* film clip */}
        <div
          style={{
            marginTop: "clamp(24px, 3.4vw, 40px)",
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            border: "1px solid #C9D9DC",
            borderRadius: "12px",
            background: "#FAF6EE",
            boxShadow: "0 24px 50px -34px rgba(21,42,46,.45)",
          }}
        >
          <iframe
            src="/film/clip.html?s=GroupIntro&d=15.2&hold=2.5"
            title="Running a group of schools"
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
            }}
          />
        </div>

        {/* divider — inside the container, not full-bleed */}
        <hr
          style={{
            margin: "clamp(32px,4vw,48px) 0 0",
            border: 0,
            borderTop: "1px solid #D6E3E5",
          }}
        />
      </div>
    </section>
  );
}