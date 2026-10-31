// src/components/shared/GdashSection.jsx
"use client";

import { useState, useEffect, useRef } from "react";

const TABS = [
  {
    n: "01",
    t: "360° group visibility",
    d: "Monitor quality, compliance and readiness across every campus from a single view.",
  },
  {
    n: "02",
    t: "School benchmarking",
    d: "Compare performance and identify top performers and schools needing support.",
  },
  {
    n: "03",
    t: "Group documents overview",
    d: "Move from the group overview to individual school documents and supporting evidence.",
  },
  {
    n: "04",
    t: "AI-powered insights",
    d: "Identify quality gaps and improvement priorities to guide proactive interventions.",
  },
  {
    n: "05",
    t: "Board-ready reports",
    d: "Generate consolidated reports and dashboards for trustees and leadership teams.",
  },
];

const C = "#17AEB9";
const W = "#E8A33D";
const R = "#E06C5A";

const PANELS = [
  {
    t: "Group overview",
    k: [
      { v: "81%", l: "Avg readiness" },
      { v: "12", l: "Schools" },
      { v: "94%", l: "Compliance" },
    ],
    h: "Readiness by campus",
    rows: [
      { l: "GD Goenka, Sector 48", v: "92%", w: "92%", c: C },
      { l: "Gayatri, Agra", v: "86%", w: "86%", c: C },
      { l: "Holy Child, Faridabad", v: "79%", w: "79%", c: C },
      { l: "Edify, Pune", v: "68%", w: "68%", c: W },
      { l: "Agnel, Vashi", v: "61%", w: "61%", c: W },
    ],
    ins: "Edify and Agnel trail the group by 13+ points on documentation.",
  },
  {
    t: "School benchmarking",
    k: [
      { v: "#1", l: "GD Goenka" },
      { v: "31 pts", l: "Top–bottom gap" },
      { v: "3", l: "Need support" },
    ],
    h: "Ranked by readiness score",
    rows: [
      { l: "1 · GD Goenka", v: "92%", w: "92%", c: C },
      { l: "2 · Gayatri", v: "86%", w: "86%", c: C },
      { l: "3 · Holy Child", v: "79%", w: "79%", c: C },
      { l: "4 · Edify", v: "68%", w: "68%", c: W },
      { l: "5 · Agnel", v: "61%", w: "61%", c: R },
    ],
    ins: "Pairing Agnel with Gayatri for peer review could close the gap fastest.",
  },
  {
    t: "Group documents",
    k: [
      { v: "4,812", l: "Documents" },
      { v: "88%", l: "Finalised" },
      { v: "146", l: "Pending" },
    ],
    h: "Documents finalised by campus",
    rows: [
      { l: "GD Goenka", v: "96%", w: "96%", c: C },
      { l: "Gayatri", v: "91%", w: "91%", c: C },
      { l: "Holy Child", v: "84%", w: "84%", c: C },
      { l: "Edify", v: "72%", w: "72%", c: W },
      { l: "Agnel", v: "64%", w: "64%", c: W },
    ],
    ins: "146 pending documents — 61% sit in Domain 4 (Inclusive practices).",
  },
  {
    t: "AI-powered insights",
    k: [
      { v: "6", l: "Quality gaps" },
      { v: "2", l: "Risk alerts" },
      { v: "14", l: "Suggested actions" },
    ],
    h: "Gap severity by domain",
    rows: [
      { l: "Inclusive practices", v: "74%", w: "74%", c: R },
      { l: "Assessment", v: "58%", w: "58%", c: W },
      { l: "Infrastructure", v: "42%", w: "42%", c: W },
      { l: "Governance", v: "28%", w: "28%", c: C },
      { l: "Curriculum", v: "20%", w: "20%", c: C },
    ],
    ins: "Inclusive practices is the top group-wide gap — schedule a CLT review this month.",
  },
  {
    t: "Board-ready reports",
    k: [
      { v: "24", l: "Reports ready" },
      { v: "1-click", l: "Export" },
      { v: "Q2", l: "Board pack" },
    ],
    h: "Report pack completion",
    rows: [
      { l: "Quarterly board pack", v: "100%", w: "100%", c: C },
      { l: "SQAAF summary", v: "92%", w: "92%", c: C },
      { l: "NABET readiness", v: "84%", w: "84%", c: C },
      { l: "Campus scorecards", v: "76%", w: "76%", c: W },
      { l: "Action tracker", v: "70%", w: "70%", c: W },
    ],
    ins: "Q2 board pack is ready — 3 campus scorecards need sign-off.",
  },
];

export default function GdashSection() {
  const [active, setActive] = useState(0);
  const [scrollyOn, setScrollyOn] = useState(false);
  const scrollyRef = useRef(null);

  /* Enable scroll-driven tab switching only on short viewports / wide screens */
  useEffect(() => {
    const check = () => {
      setScrollyOn(
        typeof window !== "undefined" &&
          window.innerHeight < 1600 &&
          window.innerWidth > 900
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Scroll-driven tab selection (sticky panel) */
  useEffect(() => {
    if (!scrollyOn) return;
    const onScroll = () => {
      const el = scrollyRef.current;
      if (!el) return;
      const extra = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      if (!extra) return;
      const p = (90 - el.getBoundingClientRect().top) / extra;
      const i = Math.max(0, Math.min(TABS.length - 1, Math.floor(p * TABS.length)));
      setActive(i);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollyOn]);

  const cur = PANELS[active];

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
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
          <span
            data-rv=""
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
                background: C,
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            The AI-powered Group Quality Dashboard
          </span>
          <h2
            data-rv=""
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
            data-rv=""
            style={{
              margin: "14px auto 0",
              maxWidth: 640,
              fontSize: 16.5,
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            A centralized, real-time view of quality, compliance and progress for
            trustees, directors and quality heads.
          </p>
        </div>

        {/* Scrolly wrapper */}
        <div
          ref={scrollyRef}
          data-scrolly="gd"
          style={{
            position: "relative",
            paddingBottom: scrollyOn ? "1400px" : "0px",
          }}
        >
          <div style={{ position: "sticky", top: 84, zIndex: 1 }}>
            <div
              className="lf-gd"
              style={{
                marginTop: "clamp(28px,4vw,48px)",
                display: "grid",
                gridTemplateColumns: "minmax(0,.9fr) minmax(0,1.3fr)",
                border: "1px solid #C9D9DC",
                background: "#fff",
              }}
            >
              {/* Left: tabs */}
              <div
                data-rv=""
                style={{
                  borderRight: "1px solid #D6E3E5",
                  background: "#F7FBFB",
                }}
              >
                {TABS.map((g, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={g.n}
                      type="button"
                      data-sy-item=""
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        font: "inherit",
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: "44px minmax(0,1fr)",
                        gap: 14,
                        alignItems: "start",
                        padding: "18px clamp(16px,2vw,26px)",
                        border: 0,
                        borderBottom: "1px solid #E1ECEE",
                        borderLeft: `3px solid ${on ? C : "transparent"}`,
                        background: on ? "#fff" : "transparent",
                        color: "#152A2E",
                        transition: "background .25s,border-color .25s",
                      }}
                    >
                      <span
                        style={{
                          width: 40,
                          height: 40,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 800,
                          fontSize: 13,
                          background: on ? C : "#fff",
                          color: on ? "#fff" : "#0E7A83",
                          border: `1px solid ${on ? C : "#C9E6E9"}`,
                          transition: "all .25s",
                        }}
                      >
                        {g.n}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontWeight: 800,
                            fontSize: 16.5,
                            letterSpacing: "-.01em",
                          }}
                        >
                          {g.t}
                        </span>
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 14,
                            lineHeight: 1.55,
                            color: "#5F7175",
                          }}
                        >
                          {g.d}
                        </span>
                      </span>
                    </button>
                  );
                })}
                <div style={{ padding: "20px clamp(16px,2vw,26px)" }}>
                  <a
                    href="/book-a-demo.html?interest=School%20Group"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C,
                      color: "#fff",
                      padding: "13px 20px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)",
                      transition: "background .25s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#0E8B95")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C)}
                  >
                    See the dashboard in action ↗
                  </a>
                </div>
              </div>

              {/* Right: live panel */}
              <div
                data-rv=""
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
                    border: "1px solid #C9D9DC",
                    background: "#fff",
                    boxShadow: "0 34px 70px -46px rgba(15,60,66,.55)",
                  }}
                >
                  {/* Panel header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "14px 18px",
                      borderBottom: "1px solid #E1ECEE",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                          color: "#0E7A83",
                        }}
                      >
                        Group Quality Dashboard
                      </div>
                      <div
                        style={{ marginTop: 3, fontWeight: 800, fontSize: 16 }}
                      >
                        {cur.t}
                      </div>
                    </div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0E9F6E",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#0E9F6E",
                          animation: "lbPulse 2.4s ease-in-out infinite",
                        }}
                      />
                      Live · 12 schools
                    </span>
                  </div>

                  {/* KPIs */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                      borderBottom: "1px solid #E1ECEE",
                    }}
                  >
                    {cur.k.map((k) => (
                      <div
                        key={k.l}
                        style={{
                          padding: "14px 16px",
                          borderRight: "1px solid #E1ECEE",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: "clamp(20px,2.2vw,26px)",
                            letterSpacing: "-.02em",
                          }}
                        >
                          {k.v}
                        </div>
                        <div
                          style={{
                            marginTop: 3,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#5F7175",
                          }}
                        >
                          {k.l}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress rows */}
                  <div
                    style={{
                      padding: "16px 18px",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: "#6A7C80",
                      }}
                    >
                      {cur.h}
                    </div>
                    {cur.rows.map((r) => (
                      <div
                        key={r.l}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(0,1.4fr) minmax(0,2fr) 54px",
                          gap: 12,
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.l}
                        </span>
                        <span
                          style={{
                            height: 8,
                            background: "#EDF4F5",
                            overflow: "hidden",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              height: "100%",
                              width: r.w,
                              background: r.c,
                              transition:
                                "width .7s cubic-bezier(.2,.7,.2,1)",
                            }}
                          />
                        </span>
                        <span
                          style={{
                            textAlign: "right",
                            fontWeight: 800,
                            color: "#152A2E",
                          }}
                        >
                          {r.v}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI insight */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "14px 18px",
                      borderTop: "1px solid #E1ECEE",
                      background: "#EDF7F8",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      color: "#244247",
                    }}
                  >
                    <span
                      style={{
                        flex: "none",
                        width: 22,
                        height: 22,
                        display: "grid",
                        placeItems: "center",
                        background: C,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      AI
                    </span>
                    <span>{cur.ins}</span>
                  </div>
                </div>
                <p
                  style={{
                    position: "relative",
                    margin: "12px 0 0",
                    fontSize: 12,
                    color: "#6A7C80",
                  }}
                >
                  Illustrative data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}