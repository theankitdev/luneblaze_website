export default function GdashSection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background: "#F4F8F8",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
          <span
            className="lf-gdpill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              maxWidth: "100%",
              padding: "6px 14px",
              background: "#fff",
              border: "1px solid #BEE2E6",
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#0E7A83",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#17AEB9",
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            The AI-powered Group Quality Dashboard
          </span>
          <h2
            style={{
              margin: "14px 0 0",
              fontWeight: 800,
              fontSize: "clamp(26px,3.2vw,44px)",
              lineHeight: 1.12,
              letterSpacing: "-.03em",
              color: "#152A2E",
            }}
          >
            One dashboard. Every school.{" "}
            <span style={{ color: "#0E8B95" }}>Smarter decisions.</span>
          </h2>
          <p
            style={{
              margin: "14px auto 0",
              maxWidth: 640,
              fontSize: 16.5,
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            A centralized, real-time view of quality, compliance and progress
            for trustees, directors and quality heads.
          </p>
        </div>

        <div
          style={{
            marginTop: "clamp(28px,4vw,48px)",
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr)",
            maxWidth: 1100,
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #C9D9DC",
            background: "#fff",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "clamp(18px,2.6vw,32px)",
              background: "linear-gradient(180deg,#fff,#F3FAFB)",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -120,
                top: -120,
                width: 340,
                height: 340,
                border: "1px dashed rgba(23,174,185,.25)",
                borderRadius: "50%",
                animation: "lbSpin 90s linear infinite",
              }}
            />

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                border: "1px solid #C9D9DC",
                borderRadius: 12,
                background: "#FAF6EE",
                boxShadow: "0 34px 70px -46px rgba(15,60,66,.55)",
              }}
            >
              <iframe
                src="/film/clip.html?s=Groups&d=14.4"
                title="Group quality dashboard"
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
          </div>
        </div>
      </div>
    </section>
  );
}