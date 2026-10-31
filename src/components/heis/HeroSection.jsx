// src/components/heis/HeroSection.jsx
"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  // --- data, straight from the source (KEY = 'hei') ---
  const hero = {
    img: "/assets/group-colleges.png",
    e: "Colleges & universities",
    h: "Institutional quality.",
    hl: "Built around your priorities.",
    p: "Connect IQAC processes, programme evidence and institutional reporting with a structured quality management approach for higher education.",
    trust: "Trusted by Institutions across India",
    ctas: [
      { t: "Book a tailored demo ↗", h: "/book-a-demo.html", bg: "#17AEB9", fg: "#fff", bd: "#17AEB9", sh: "0 12px 28px -12px rgba(23,174,185,.85)" },
    ],
    panel: true,
    video: "",
    side: "",
    dash: false,
    hasLogos: false,
    logos: [],
  };
  const heiFw = [
    { n: "NAAC", s: "Binary accreditation · Level 4", v: "78%", logo: "/assets/fw-naac.png", href: "naac.html" },
    { n: "NBA",  s: "SAR · 3 programmes",           v: "64%", logo: "/assets/fw-nba.png",  href: "nba.html" },
    { n: "NIRF", s: "Data capture · 2026",          v: "86%", logo: "/assets/fw-nirf.png", href: "nirf.html" },
  ];
  const heiK = [
    { v: "1,248", l: "Evidence files" },
    { v: "7/7",   l: "Criteria mapped" },
    { v: "24",    l: "Open actions" },
  ];

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#fff", borderBottom: "1px solid #D6E3E5" }}>
      {/* ---------- BACKGROUND ---------- */}
      <div className="lf-herobg" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: `#EAF6F7 url('${hero.img}') center/cover no-repeat`, opacity: 0.28 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#fff 0,#fff 38%,rgba(255,255,255,.72) 62%,rgba(255,255,255,.35))" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.26, backgroundImage: "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)", backgroundSize: "30px 30px", animation: "lbGridPan 44s linear infinite" }} />
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "min(900px,96vw)", height: "min(900px,96vw)", animation: "lbSpin 150s linear infinite" }}>
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(23,174,185,.14)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "18%", border: "1px dashed rgba(23,174,185,.13)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "36%", border: "1px solid rgba(91,91,214,.1)", borderRadius: "50%" }} />
        </div>
      </div>

      {/* ---------- MAIN GRID ---------- */}
      <div
        className="lf-herowrap"
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(52px,7vw,104px) clamp(16px,3vw,32px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))",
          gap: "clamp(36px,5vw,72px)",
          alignItems: "center",
        }}
      >
        {/* ---------- TEXT ---------- */}
        <div data-rv="">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(223,241,243,.9)", border: "1px solid #BEE2E6", borderRadius: 999, fontSize: 10.5, lineHeight: 1.4, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#0E7A83", whiteSpace: "nowrap", maxWidth: "100%" }}>
            <span style={{ flex: "none", width: 6, height: 6, borderRadius: "50%", background: "#17AEB9", animation: "lbPulse 2.4s ease-in-out infinite" }} />
            {hero.e}
          </span>
          <h1 style={{ margin: "20px 0 0", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.05, letterSpacing: "-.035em", color: "#152A2E", textWrap: "balance" }}>
            {hero.h} <span style={{ color: "#17AEB9" }}>{hero.hl}</span>
          </h1>
          <p style={{ margin: "22px 0 0", maxWidth: 580, fontSize: "clamp(16px,1.35vw,18px)", lineHeight: 1.7, color: "#4C6165", textWrap: "pretty" }}>
            {hero.p}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            {hero.ctas.map((c, i) => (
              <a key={i} href={c.h} style={{ display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", padding: "16px 26px", borderRadius: 10, fontWeight: 700, fontSize: 16, background: c.bg, color: c.fg, border: `1px solid ${c.bd}`, boxShadow: c.sh, textDecoration: "none" }}>
                {c.t}
              </a>
            ))}
          </div>
          {hero.stats && (
            <>
              <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", border: "1px solid #C9D9DC", background: "rgba(255,255,255,.9)", maxWidth: 560 }}>
                {hero.stats.map((s, i) => (
                  <div key={i} style={{ flex: "1 1 140px", padding: "14px 18px", borderRight: "1px solid #E6EEEF" }}>
                    <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-.02em", color: "#152A2E" }}>{s.v}</div>
                    <div style={{ marginTop: 2, fontSize: 12.5, fontWeight: 600, color: "#4C6165" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: "#0E7A83" }}>{hero.trust}</div>
            </>
          )}
        </div>

        {/* ---------- IQAC PANEL ---------- */}
        {hero.panel && (
          <div className="lf-herovid" data-rv="" style={{ position: "relative", maxWidth: 560, width: "100%", justifySelf: "center", marginBottom: 74 }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: -40, pointerEvents: "none" }}>
              <div style={{ position: "absolute", inset: 0, border: "1px dashed rgba(23,174,185,.25)", borderRadius: "50%", animation: "lbSpin 90s linear infinite" }} />
            </div>
            <div style={{ position: "relative", background: "#fff", border: "1px solid #C9D9DC", boxShadow: "0 40px 80px -48px rgba(15,60,66,.55)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid #E1ECEE" }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#0E7A83" }}>IQAC Command Centre</div>
                  <div style={{ marginTop: 3, fontWeight: 800, fontSize: 16, color: "#152A2E" }}>Greenfield Institute of Science</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#0E9F6E" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0E9F6E", animation: "lbPulse 2.4s ease-in-out infinite" }} />
                  Live
                </span>
              </div>

              <div style={{ padding: "8px 20px 4px" }}>
                {heiFw.map((fw, i) => (
                  <a key={i} href={fw.href} style={{ display: "grid", gridTemplateColumns: "52px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #EEF3F4", color: "#152A2E", textDecoration: "none" }}>
                    <div style={{ width: 52, height: 52, border: "1px solid #E6EEEF", background: `#fff url('${fw.logo}') center/74% no-repeat` }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                        <span style={{ fontWeight: 800, fontSize: 16 }}>{fw.n}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4C6165", whiteSpace: "nowrap" }}>{fw.s}</span>
                      </div>
                      <div style={{ marginTop: 8, height: 7, background: "#EDF4F5", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: fw.v, background: "#17AEB9", transformOrigin: "left", animation: "lfGrow 1.4s cubic-bezier(.2,.7,.2,1) both" }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "#0E8B95", minWidth: 46, textAlign: "right" }}>{fw.v}</span>
                  </a>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", borderTop: "1px solid #E1ECEE", background: "#F5FAFB" }}>
                {heiK.map((k, i) => (
                  <div key={i} style={{ padding: "14px 12px", textAlign: "center", borderRight: "1px solid #E1ECEE" }}>
                    <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.02em", color: "#152A2E" }}>{k.v}</div>
                    <div style={{ marginTop: 3, fontSize: 11.5, fontWeight: 700, color: "#5F7175" }}>{k.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", left: -24, bottom: -66, display: "flex", alignItems: "center", gap: 10, background: "#152A2E", color: "#fff", padding: "12px 16px", boxShadow: "0 18px 36px -18px rgba(15,60,66,.7)", animation: "lbFloat 7s ease-in-out infinite" }}>
              <span style={{ width: 30, height: 30, display: "grid", placeItems: "center", background: "#17AEB9", fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: 13, lineHeight: 1.35 }}>
                <b style={{ display: "block" }}>AQAR 2025–26 compiled</b>
                <span style={{ color: "#A9C8CC" }}>Criterion III evidence verified</span>
              </span>
            </div>
          </div>
        )}

        {/* ---------- VIDEO ---------- */}
        {hero.video && (
          <div className="lf-herovid" data-rv="" style={{ position: "relative", background: "#fff", border: "1px solid #C9D9DC", boxShadow: "0 40px 80px -46px rgba(15,60,66,.55)", padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 10px" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F0676B" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F5CF68" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#7FD4A8" }} />
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: "#4C6165" }}>Luneblaze · Platform walkthrough</span>
            </div>
            <div style={{ position: "relative", aspectRatio: "16/9", background: "#0F2427", overflow: "hidden" }}>
              <video ref={videoRef} src={hero.video} autoPlay muted loop playsInline preload="auto" controls style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}