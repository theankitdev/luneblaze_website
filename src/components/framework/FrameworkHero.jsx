// src/components/framework/FrameworkHero.jsx
"use client";

const WHEEL_COLORS = ["#F4A97F", "#A9CFC0", "#F0676B", "#F5CF68", "#7FD4A8"];

function buildWheelSvg(name, labels) {
  const n = labels.length;
  const C = 400;
  const r0 = 124;
  const r1 = 252;
  const gap = 0.03;
  const rl = 302;

  const pt = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  let defs =
    '<filter id="sh" x="-20%" y="-20%" width="140%" height="140%">' +
    '<feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F3C42" flood-opacity=".18"/>' +
    "</filter>" +
    '<radialGradient id="cg" cx="50%" cy="38%" r="70%">' +
    '<stop offset="0" stop-color="#2F4B52"/>' +
    '<stop offset="1" stop-color="#14262B"/>' +
    "</radialGradient>";

  const style =
    "<style>" +
    ".sg{transform-origin:400px 400px;transform-box:view-box;animation:pop .8s cubic-bezier(.34,1.45,.5,1) both}" +
    ".sg path{transition:transform .3s}" +
    ".rg{transform-origin:400px 400px;transform-box:view-box;animation:spin 40s linear infinite}" +
    ".rg2{transform-origin:400px 400px;transform-box:view-box;animation:spin 26s linear infinite reverse}" +
    ".pl{transform-origin:400px 400px;transform-box:view-box;animation:pulse 2.8s ease-out infinite}" +
    ".lb{animation:fade .7s ease both}" +
    ".orb{transform-origin:400px 400px;transform-box:view-box;animation:spin 12s linear infinite}" +
    "@keyframes pop{0%{transform:scale(.3) rotate(-25deg);opacity:0}100%{transform:none;opacity:1}}" +
    "@keyframes spin{to{transform:rotate(360deg)}}" +
    "@keyframes pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.45);opacity:0}}" +
    "@keyframes fade{from{opacity:0}to{opacity:1}}" +
    "</style>";

  let g =
    '<g class="rg"><circle cx="400" cy="400" r="350" fill="none" stroke="#B9DFE3" stroke-width="2" stroke-dasharray="3 9"/></g>' +
    '<g class="rg2"><circle cx="400" cy="400" r="276" fill="none" stroke="#E2EEF0" stroke-width="1.5" stroke-dasharray="14 10"/></g>';

  let segs = "";
  labels.forEach((lb, k) => {
    const a0 = -Math.PI / 2 + (k * 2 * Math.PI) / n + gap;
    const a1 = -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / n - gap;
    const am = (a0 + a1) / 2;
    const big = a1 - a0 > Math.PI ? 1 : 0;

    const [x0, y0] = pt(r1, a0);
    const [x1, y1] = pt(r1, a1);
    const [x2, y2] = pt(r0, a1);
    const [x3, y3] = pt(r0, a0);

    const col = WHEEL_COLORS[k % WHEEL_COLORS.length];
    const dl = (0.15 + k * 0.12).toFixed(2) + "s";

    defs +=
      `<linearGradient id="g${k}" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${col}" stop-opacity=".78"/>` +
      `<stop offset="1" stop-color="${col}"/>` +
      `</linearGradient>`;

    const [bx, by] = pt(170, am);
    segs +=
      `<g class="sg" style="animation-delay:${dl}">` +
      `<path d="M${x0} ${y0} A${r1} ${r1} 0 ${big} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${big} 0 ${x3} ${y3} Z" fill="url(#g${k})" stroke="#fff" stroke-width="3"/>` +
      `<circle cx="${bx}" cy="${by}" r="21" fill="#fff"/>` +
      `<text x="${bx}" y="${by + 6}" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="18" font-weight="800" fill="${col}">${k + 1}</text>` +
      `</g>`;

    const [lx, ly] = pt(rl, am);
    const cs = Math.cos(am);
    const anc = Math.abs(cs) < 0.25 ? "middle" : cs > 0 ? "start" : "end";

    const [dx, dy] = pt(262, am);
    g += `<circle class="lb" style="animation-delay:${dl}" cx="${dx}" cy="${dy}" r="4" fill="${col}"/>`;

    const words = lb.split(" ");
    const lines = [];
    let cur = "";
    words.forEach((w) => {
      if ((cur + " " + w).trim().length > 14 && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = (cur + " " + w).trim();
      }
    });
    if (cur) lines.push(cur);

    const y0l = ly - (lines.length - 1) * 15.5 + 9;
    g +=
      `<text class="lb" style="animation-delay:${(0.5 + k * 0.12).toFixed(2)}s" text-anchor="${anc}" ` +
      `font-family="Manrope,Arial,sans-serif" font-size="27" font-weight="800" fill="#1E3237">` +
      lines.map((t, q) => `<tspan x="${lx}" y="${y0l + q * 31}">${esc(t)}</tspan>`).join("") +
      `</text>`;
  });

  g += `<g filter="url(#sh)">${segs}</g>`;

  const fs = name.length > 4 ? 50 : 66;
  g +=
    `<circle class="pl" cx="400" cy="400" r="112" fill="none" stroke="#17AEB9" stroke-width="3"/>` +
    `<circle cx="400" cy="400" r="112" fill="url(#cg)" stroke="#fff" stroke-width="6"/>` +
    `<g class="orb"><circle cx="400" cy="270" r="6" fill="#17AEB9"/></g>` +
    `<text x="400" y="${400 + fs * 0.35}" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="${fs}" font-weight="800" fill="#fff" letter-spacing="1">${name}</text>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-170 -20 1140 840">` +
    `<defs>${defs}</defs>${style}${g}</svg>`;

  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export { buildWheelSvg };

export default function FrameworkHero({
  eyebrow,
  heading,
  headingHighlight,
  description,
  image,
  ctas = [],
  stats = [],
  trust,
  ring,
  ringTitle = "Seven SQAAF domains",
  wheel,          // ← NEW: SVG data URI from buildWheelSvg()
  wheelTitle,     // ← NEW: aria-label
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.26]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.22) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 44s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-30%",
            right: "-10%",
            width: "min(900px,96vw)",
            height: "min(900px,96vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.14)]" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(23,174,185,.13)]" />
          <div className="absolute inset-[36%] rounded-full border border-[rgba(91,91,214,.1)]" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-9 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]" style={{ animation: "lbPulse 2.4s ease-in-out infinite" }} />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-balance text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-.035em] text-[#152A2E]">
            {heading} <span className="text-[#17AEB9]">{headingHighlight}</span>
          </h1>
          <p className="mt-5 max-w-[580px] text-[clamp(16px,1.35vw,18px)] leading-[1.7] text-[#4C6165]">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[10px] px-6 py-4 text-[16px] font-bold"
                style={{
                  background: c.primary ? "#17AEB9" : "#fff",
                  color: c.primary ? "#fff" : "#152A2E",
                  border: `1px solid ${c.primary ? "#17AEB9" : "#C9D9DC"}`,
                  boxShadow: c.primary ? "0 12px 28px -12px rgba(23,174,185,.85)" : "none",
                }}
              >
                {c.label}
              </a>
            ))}
          </div>
          {stats.length > 0 && (
            <>
              <div className="mt-8 flex max-w-[560px] flex-wrap border border-[#C9D9DC] bg-white/90">
                {stats.map((s) => (
                  <div key={s.label} className="flex-1 basis-[140px] border-r border-[#E6EEEF] px-4 py-3.5">
                    <div className="text-2xl font-extrabold tracking-tight text-[#152A2E]">{s.value}</div>
                    <div className="mt-0.5 text-[12.5px] font-semibold text-[#4C6165]">{s.label}</div>
                  </div>
                ))}
              </div>
              {trust && <div className="mt-3 text-[13.5px] font-bold text-[#0E7A83]">{trust}</div>}
            </>
          )}
        </div>

        {ring ? (
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="relative w-full" style={{ aspectRatio: "1140/920" }}>
              <iframe
                src={ring}
                title={ringTitle}
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        ) : wheel ? (
          <div className="mx-auto w-full max-w-[560px]">
            <div
              role="img"
              aria-label={wheelTitle || eyebrow}
              className="w-full"
              style={{
                aspectRatio: "1140/840",
                background: `url('${wheel}') center/contain no-repeat`,
                animation: "lbFloat 9s ease-in-out infinite",
              }}
            />
          </div>
        ) : image ? (
          <div className="mx-auto w-full max-w-[560px]">
            <div
              role="img"
              aria-label={eyebrow}
              className="w-full bg-contain bg-center bg-no-repeat"
              style={{ aspectRatio: "1140/840", backgroundImage: `url('${image}')` }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}