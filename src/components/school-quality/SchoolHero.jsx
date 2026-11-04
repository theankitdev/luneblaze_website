import Link from "next/link";

export default function SchoolHero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      {/* ---------- background layers ---------- */}
      <div
        className="lf-herobg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "#EAF6F7 url('/assets/lb-SQAAF.webp') center/cover no-repeat",
            opacity: 0.28,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,#fff 0,#fff 38%,rgba(255,255,255,.72) 62%,rgba(255,255,255,.35))",
          }}
        />
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
            top: "-30%",
            right: "-10%",
            width: "min(900px,96vw)",
            height: "min(900px,96vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid rgba(23,174,185,.14)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "18%",
              border: "1px dashed rgba(23,174,185,.13)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "36%",
              border: "1px solid rgba(91,91,214,.1)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {/* ---------- content (single column, H1 full width) ---------- */}
      <div
        className="lf-herowrap"
        style={{
          position: "relative",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(52px,7vw,104px) clamp(16px,3vw,32px)",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: "clamp(36px,5vw,72px)",
          alignItems: "center",
        }}
      >
        <div>
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
              lineHeight: 1.4,
              fontWeight: 800,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#0E7A83",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                flex: "none",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#17AEB9",
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            For schools
          </span>

          <h1
            style={{
              margin: "20px 0 0",
              fontWeight: 800,
              fontSize: "clamp(36px,5vw,64px)",
              lineHeight: 1.05,
              letterSpacing: "-.035em",
              color: "#152A2E",
              textWrap: "balance",
            }}
          >
            Build quality into{" "}
            <span style={{ color: "#17AEB9" }}>every school day.</span>
          </h1>

          <p
            style={{
              margin: "22px 0 0",
              maxWidth: "580px",
              fontSize: "clamp(16px,1.35vw,18px)",
              lineHeight: 1.7,
              color: "#4C6165",
              textWrap: "pretty",
            }}
          >
            A connected system for SQAAF and NABET implementation: structured
            documentation, engaged teams, practical guidance and continuous
            readiness.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "30px",
            }}
          >
            <Link
              href="/book-a-demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                whiteSpace: "nowrap",
                padding: "16px 26px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "16px",
                background: "#17AEB9",
                color: "#fff",
                border: "1px solid #17AEB9",
                boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)",
              }}
            >
              Book a tailored demo ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}