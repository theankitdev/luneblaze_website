
const WHEEL_COLORS = [
  "#F4A97F",
  "#A9CFC0",
  "#F0676B",
  "#F5CF68",
  "#7FD4A8",
];

export function buildWheelSvg(name, labels) {
  const n = labels.length;

  if (!n) return "";

  const C = 400;
  const r0 = 124;
  const r1 = 252;
  const gap = 0.03;
  const rl = 302;

  const pt = (r, a) => [
    C + r * Math.cos(a),
    C + r * Math.sin(a),
  ];

  const esc = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  let defs = `
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="0"
        dy="10"
        stdDeviation="12"
        flood-color="#0F3C42"
        flood-opacity=".18"
      />
    </filter>

    <radialGradient id="cg" cx="50%" cy="38%" r="70%">
      <stop offset="0" stop-color="#2F4B52"/>
      <stop offset="1" stop-color="#14262B"/>
    </radialGradient>
  `;

  const style = `
    <style>
      .sg {
        transform-origin: 400px 400px;
        transform-box: view-box;
        animation: pop .8s cubic-bezier(.34,1.45,.5,1) both;
      }

      .rg {
        transform-origin: 400px 400px;
        transform-box: view-box;
        animation: spin 40s linear infinite;
      }

      .rg2 {
        transform-origin: 400px 400px;
        transform-box: view-box;
        animation: spin 26s linear infinite reverse;
      }

      .pl {
        transform-origin: 400px 400px;
        transform-box: view-box;
        animation: pulse 2.8s ease-out infinite;
      }

      .lb {
        animation: fade .7s ease both;
      }

      .orb {
        transform-origin: 400px 400px;
        transform-box: view-box;
        animation: spin 12s linear infinite;
      }

      @keyframes pop {
        0% {
          transform: scale(.3) rotate(-25deg);
          opacity: 0;
        }
        100% {
          transform: none;
          opacity: 1;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: .55;
        }
        100% {
          transform: scale(1.45);
          opacity: 0;
        }
      }

      @keyframes fade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
  `;

  let g = `
    <g class="rg">
      <circle
        cx="400" cy="400" r="350"
        fill="none"
        stroke="#B9DFE3"
        stroke-width="2"
        stroke-dasharray="3 9"
      />
    </g>

    <g class="rg2">
      <circle
        cx="400" cy="400" r="276"
        fill="none"
        stroke="#E2EEF0"
        stroke-width="1.5"
        stroke-dasharray="14 10"
      />
    </g>
  `;

  let segs = "";

  labels.forEach((lb, k) => {
    const a0 =
      -Math.PI / 2 + (k * 2 * Math.PI) / n + gap;

    const a1 =
      -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / n - gap;

    const am = (a0 + a1) / 2;
    const big = a1 - a0 > Math.PI ? 1 : 0;

    const [x0, y0] = pt(r1, a0);
    const [x1, y1] = pt(r1, a1);
    const [x2, y2] = pt(r0, a1);
    const [x3, y3] = pt(r0, a0);

    const col = WHEEL_COLORS[k % WHEEL_COLORS.length];
    const dl = (0.15 + k * 0.12).toFixed(2) + "s";

    defs += `
      <linearGradient
        id="g${k}"
        x1="0" y1="0"
        x2="1" y2="1"
      >
        <stop offset="0" stop-color="${col}" stop-opacity=".78"/>
        <stop offset="1" stop-color="${col}"/>
      </linearGradient>
    `;

    const [bx, by] = pt(170, am);

    segs += `
      <g class="sg" style="animation-delay:${dl}">
        <path
          d="
            M${x0} ${y0}
            A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}
            L${x2} ${y2}
            A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}
            Z
          "
          fill="url(#g${k})"
          stroke="#fff"
          stroke-width="3"
        />

        <circle cx="${bx}" cy="${by}" r="21" fill="#fff"/>

        <text
          x="${bx}"
          y="${by + 6}"
          text-anchor="middle"
          font-family="Manrope,Arial,sans-serif"
          font-size="18"
          font-weight="800"
          fill="${col}"
        >${k + 1}</text>
      </g>
    `;

    const [lx, ly] = pt(rl, am);

    const cs = Math.cos(am);

    const anc =
      Math.abs(cs) < 0.25
        ? "middle"
        : cs > 0
          ? "start"
          : "end";

    const [dx, dy] = pt(262, am);

    g += `
      <circle
        class="lb"
        style="animation-delay:${dl}"
        cx="${dx}"
        cy="${dy}"
        r="4"
        fill="${col}"
      />
    `;

    // Improved wrapping for longer NBA labels
    const words = String(lb).split(/\s+/);
    const lines = [];
    let cur = "";

    words.forEach((word) => {
      const test = cur
        ? `${cur} ${word}`
        : word;

      if (test.length > 16 && cur) {
        lines.push(cur);
        cur = word;
      } else {
        cur = test;
      }
    });

    if (cur) lines.push(cur);

    const fontSize = 24;
    const lineHeight = 27;

    const y0l =
      ly - ((lines.length - 1) * lineHeight) / 2 + 7;

    g += `
      <text
        class="lb"
        style="animation-delay:${(0.5 + k * 0.12).toFixed(2)}s"
        text-anchor="${anc}"
        font-family="Manrope,Arial,sans-serif"
        font-size="${fontSize}"
        font-weight="800"
        fill="#1E3237"
      >
        ${lines
          .map(
            (t, q) =>
              `<tspan x="${lx}" y="${y0l + q * lineHeight}">${esc(t)}</tspan>`
          )
          .join("")}
      </text>
    `;
  });

  g += `<g filter="url(#sh)">${segs}</g>`;

  const fs = name.length > 4 ? 50 : 66;

  g += `
    <circle
      class="pl"
      cx="400" cy="400" r="112"
      fill="none"
      stroke="#17AEB9"
      stroke-width="3"
    />

    <circle
      cx="400" cy="400" r="112"
      fill="url(#cg)"
      stroke="#fff"
      stroke-width="6"
    />

    <g class="orb">
      <circle cx="400" cy="270" r="6" fill="#17AEB9"/>
    </g>

    <text
      x="400"
      y="${400 + fs * 0.35}"
      text-anchor="middle"
      font-family="Manrope,Arial,sans-serif"
      font-size="${fs}"
      font-weight="800"
      fill="#fff"
      letter-spacing="1"
    >${esc(name)}</text>
  `;

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-170 -20 1140 840"
    >
      <defs>${defs}</defs>
      ${style}
      ${g}
    </svg>
  `;

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg)
  );
}
