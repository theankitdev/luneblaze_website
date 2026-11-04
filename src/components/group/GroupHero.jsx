import Link from "next/link";

const bars = [
  { m: "APR", h: "38%", c: "#B7E2E5" },
  { m: "MAY", h: "47%", c: "#B7E2E5" },
  { m: "JUN", h: "55%", c: "#B7E2E5" },
  { m: "JUL", h: "63%", c: "#B7E2E5" },
  { m: "AUG", h: "70%", c: "#B7E2E5" },
  { m: "SEP", h: "78%", c: "#17AEB9" },
];

export default function GroupHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#fff",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      {/* Background layers */}
      <div
        aria-hidden="true"
        className="lf-herobg pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#EAF6F7",
            backgroundImage: "url('/assets/group-schools.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.28,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,#fff 0,#fff 38%,rgba(255,255,255,.72) 62%,rgba(255,255,255,.35))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.26,
            backgroundImage:
              "radial-gradient(circle, rgba(23,174,185,.22) 1.1px, transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-30%",
            right: "-10%",
            width: "min(900px, 96vw)",
            height: "min(900px, 96vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(23,174,185,.14)" }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "18%",
              border: "1px dashed rgba(23,174,185,.13)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "36%",
              border: "1px solid rgba(91,91,214,.10)",
            }}
          />
        </div>
      </div>

      {/* Main grid */}
      <div
        className="lf-herowrap relative mx-auto grid max-w-[1280px] items-center"
        style={{
          padding: "clamp(52px,7vw,104px) clamp(16px,3vw,32px)",
          gap: "clamp(36px,5vw,72px)",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
        }}
      >
        {/* LEFT — text + CTAs */}
        <div>
          <span
            className="inline-flex max-w-full items-center"
            style={{
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
            For groups of institutions
          </span>

          <h1
            className="font-extrabold"
            style={{
              margin: "20px 0 0",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-.035em",
              color: "#152A2E",
              textWrap: "balance",
            }}
          >
            One vision. One standard.{" "}
            <span style={{ color: "#17AEB9" }}>Every school.</span>
          </h1>

          <p
            style={{
              margin: "22px 0 0",
              maxWidth: "580px",
              fontSize: "clamp(16px, 1.35vw, 18px)",
              lineHeight: 1.7,
              color: "#4C6165",
              textWrap: "pretty",
            }}
          >
            Transform multi-school excellence through AI-powered quality
            management. Centralize quality, standardize operations and
            accelerate SQAAF readiness.
          </p>

          <div
            className="flex flex-wrap"
            style={{ marginTop: "30px", gap: "12px" }}
          >
            <Link
              href="/book-a-demo?interest=School%20Group"
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
                transition: "transform .2s",
              }}
            >
              Book a Group Demo ↗
            </Link>
            <a
              href="#group-ecosystem"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                whiteSpace: "nowrap",
                padding: "16px 26px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "16px",
                background: "#fff",
                color: "#152A2E",
                border: "1px solid #C9D9DC",
                transition: "transform .2s",
              }}
            >
              Explore group capabilities ↓
            </a>
          </div>
        </div>

        {/* RIGHT — Dashboard preview (NOT a video) */}
        <div
          style={{
            position: "relative",
            background: "#fff",
            border: "1px solid #C9D9DC",
            borderRadius: "6px",
            boxShadow: "0 40px 80px -48px rgba(15,60,66,.55)",
            overflow: "hidden",
          }}
        >
          {/* scan line */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "30%",
              background:
                "linear-gradient(180deg,transparent,rgba(23,174,185,.07),transparent)",
              animation: "lbScan 6s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* header bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              padding: "13px 16px",
              borderBottom: "1px solid #D6E3E5",
              background: "#F7FAFA",
              fontSize: "13px",
            }}
          >
            <b>
              ◈ Luneblaze{" "}
              <span style={{ fontWeight: 500, color: "#6A7C80" }}>
                / Quality workspace
              </span>
            </b>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#0E8B95",
                border: "1px solid #B7E2E5",
                background: "#EDF7F8",
                padding: "3px 8px",
                borderRadius: "999px",
              }}
            >
              Illustrative preview
            </span>
          </div>

          {/* body */}
          <div style={{ padding: "16px" }}>
            <div style={{ fontWeight: 800, fontSize: "15px" }}>
              Quality at a glance
            </div>
            <div
              style={{
                marginTop: "3px",
                fontSize: "12px",
                color: "#6A7C80",
              }}
            >
              Your school's continuous improvement journey
            </div>

            {/* KPI grid */}
            <div
              style={{
                marginTop: "14px",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                border: "1px solid #D6E3E5",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  borderRight: "1px solid #D6E3E5",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6A7C80",
                  }}
                >
                  Readiness Score™
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontWeight: 800,
                    fontSize: "28px",
                    lineHeight: 1,
                  }}
                >
                  78
                  <span style={{ fontSize: "13px", color: "#9AAAAD" }}>
                    {" "}
                    / 100
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "#6A7C80",
                  }}
                >
                  Documentation · Staff · Audits
                </div>
              </div>
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6A7C80",
                  }}
                >
                  Improvement actions
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontWeight: 800,
                    fontSize: "28px",
                    lineHeight: 1,
                  }}
                >
                  18
                  <span style={{ fontSize: "13px", color: "#9AAAAD" }}>
                    {" "}
                    / 24
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "#6A7C80",
                  }}
                >
                  Completed this cycle
                </div>
              </div>
            </div>

            {/* chart label */}
            <div
              style={{
                marginTop: "16px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: ".06em",
                color: "#6A7C80",
              }}
            >
              READINESS OVER TIME
            </div>

            {/* bar chart */}
            <div
              style={{
                marginTop: "10px",
                height: "90px",
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                borderBottom: "1px solid #D6E3E5",
              }}
            >
              {bars.map((b, i) => (
                <i
                  key={i}
                  style={{
                    flex: 1,
                    height: b.h,
                    background: b.c,
                  }}
                />
              ))}
            </div>

            {/* month labels */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "6px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#9AAAAD",
              }}
            >
              {bars.map((b, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center" }}>
                  {b.m}
                </span>
              ))}
            </div>

            {/* footnote */}
            <div
              style={{
                marginTop: "14px",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                borderLeft: "3px solid #17AEB9",
                background: "#F4FAFA",
                padding: "10px 12px",
                fontSize: "12.5px",
                color: "#4C6165",
              }}
            >
              <b style={{ color: "#152A2E" }}>
                ✓ Small actions. Lasting improvement.
              </b>{" "}
              Every task connected to a bigger quality goal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}