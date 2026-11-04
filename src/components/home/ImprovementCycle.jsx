const CYCLE = [
  {
    number: "01",
    title: "Assess",
    description:
      "Understand your institution’s starting point through structured assessment and honest gap identification.",
  },
  {
    number: "02",
    title: "Document",
    description:
      "Build policies, SOPs and plans in a central workspace, with clear responsibilities for each record.",
  },
  {
    number: "03",
    title: "Evidence",
    description:
      "Link implementation records to the standards or metrics they support and identify missing evidence early.",
  },
  {
    number: "04",
    title: "Review",
    description:
      "Run internal reviews and mock audits, bringing findings into practical conversations with your teams.",
  },
  {
    number: "05",
    title: "Monitor",
    description:
      "Track tasks, participation and progress through dashboards and reports for leadership.",
  },
  {
    number: "06",
    title: "Improve",
    description:
      "Turn findings into owned actions, review their completion and carry learning into the next cycle.",
  },
];

// left column: 06, 05, 04  (bottom-to-top visually)
// right column: 01, 02, 03 (top-to-bottom visually)
const cycleL = [CYCLE[5], CYCLE[4], CYCLE[3]];
const cycleR = [CYCLE[0], CYCLE[1], CYCLE[2]];

function CycleCard({ step }) {
  return (
    <article
      className="rounded-none border border-[#C9D9DC] border-l-[3px] border-l-[#17AEB9] bg-white transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[#17AEB9]"
      style={{ padding: "16px 18px" }}
    >
      <div className="flex items-center gap-[10px]">
        <b
          style={{
            fontSize: "12.5px",
            fontWeight: 800,
            color: "#fff",
            background: "#17AEB9",
            padding: "4px 7px",
            borderRadius: "3px",
          }}
        >
          {step.number}
        </b>
        <h3
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "18px",
            color: "#152A2E",
          }}
        >
          {step.title}
        </h3>
      </div>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#4C6165",
        }}
      >
        {step.description}
      </p>
    </article>
  );
}

function CycleDiagram() {
  const nodes = [
    { num: "01", label: "Assess", cx: 275, cy: 70.1, tx: 298, ty: 35.3, numColor: "#0E8B95" },
    { num: "02", label: "Document", cx: 350, cy: 200, tx: 396, ty: 205, numColor: "#0E8B95" },
    { num: "03", label: "Evidence", cx: 275, cy: 329.9, tx: 298, ty: 374.7, numColor: "#0E8B95" },
    { num: "04", label: "Review", cx: 125, cy: 329.9, tx: 102, ty: 374.7, numColor: "#0E8B95" },
    { num: "05", label: "Monitor", cx: 50, cy: 200, tx: 4, ty: 205, numColor: "#0E8B95" },
    { num: "06", label: "Improve", cx: 125, cy: 70.1, tx: 102, ty: 35.3, numColor: "#0E8B95" },
  ];

  return (
    <div
      className="relative mx-auto w-full max-w-[420px] aspect-square flex items-center justify-center my-6 lg:my-0 order-first lg:order-none"
    >
      {/* rotating dot layer — outer track */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "15.9%",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "lbSpin 12s linear infinite",
          zIndex: 2,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            marginLeft: "-10px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#17AEB9",
            boxShadow: "0 0 0 6px rgba(23,174,185,.22), 0 0 18px rgba(23,174,185,.7)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: "36%",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "rgba(23,174,185,.45)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "24%",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(23,174,185,.25)",
          }}
        />
      </div>

      {/* reverse-spinning dashed ring */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "6%",
          border: "1px dashed rgba(23,174,185,.35)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "lbSpinRev 40s linear infinite",
        }}
      />

      <svg
        viewBox="-20 -20 440 440"
        role="img"
        aria-label="Assess, Document, Evidence, Review, Monitor, Improve — and back to Assess"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <marker id="lfArr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#17AEB9" />
          </marker>
        </defs>

        <g style={{ transformOrigin: "200px 200px" }}>
          {/* track ring */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="#E3EEF0" strokeWidth="14" />

          {/* arc arrows between nodes */}
          <path d="M302.3 90.3 A150 150 0 0 1 346.2 166.3" fill="none" stroke="#17AEB9" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" />
          <path d="M346.2 233.7 A150 150 0 0 1 302.3 309.7" fill="none" stroke="#17AEB9" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" />
          <path d="M243.9 343.4 A150 150 0 0 1 156.1 343.4" fill="none" stroke="#17AEB9" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" />
          <path d="M97.7 309.7 A150 150 0 0 1 53.8 233.7" fill="none" stroke="#17AEB9" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" />
          <path d="M53.8 166.3 A150 150 0 0 1 97.7 90.3" fill="none" stroke="#17AEB9" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" />
          {/* final dashed arrow from Improve → Assess */}
          <path d="M156.1 56.6 A150 150 0 0 1 243.9 56.6" fill="none" stroke="#0E8B95" strokeWidth="4" strokeLinecap="round" markerEnd="url(#lfArr)" strokeDasharray="7 6" />

          {/* node circles + labels */}
          {nodes.map((n) => (
            <g key={n.num}>
              <circle cx={n.cx} cy={n.cy} r="24" fill="#fff" stroke="#17AEB9" strokeWidth="3" />
              <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontFamily="Manrope,Arial,sans-serif" fontSize="15" fontWeight="800" fill={n.numColor}>
                {n.num}
              </text>
              <text x={n.tx} y={n.ty} textAnchor="middle" fontFamily="Manrope,Arial,sans-serif" fontSize="15" fontWeight="800" fill="#152A2E">
                {n.label}
              </text>
            </g>
          ))}

          {/* center label */}
          <circle cx="200" cy="200" r="92" fill="#EDF7F8" />
          <text x="200" y="192" textAnchor="middle" fontFamily="Manrope,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#152A2E">
            Continuous
          </text>
          <text x="200" y="215" textAnchor="middle" fontFamily="Manrope,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#17AEB9">
            improvement
          </text>
          <text x="200" y="240" textAnchor="middle" fontFamily="Manrope,Arial,sans-serif" fontSize="11.5" fontWeight="700" fill="#6A7C80">
            Improve → Assess
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function ImprovementCycle() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(28px, 3.4vw, 48px) clamp(16px, 3vw, 32px) clamp(32px, 3.6vw, 52px)",
        background: "#fff",
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      {/* decorative bg */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.36,
            backgroundImage: "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-18%",
            right: "-8%",
            width: "min(460px, 48vw)",
            height: "min(460px, 48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(23,174,185,.14)" }} />
          <div
            className="absolute rounded-full"
            style={{ inset: "26%", border: "1px dashed rgba(23,174,185,.12)" }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        {/* heading */}
        <div className="text-center">
          <div>
            <span
              className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]"
              style={{ background: "rgba(223,241,243,.9)" }}
            >
              <span
                className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Assessment to improvement
            </span>
          </div>
          <h2
            className="mt-3 font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]"
            style={{
              fontSize: "clamp(28px, 3.4vw, 46px)",
              textWrap: "balance",
            }}
          >
            A continuous cycle. <span className="text-[#17AEB9]">A stronger institution every time.</span>
          </h2>
        </div>

        {/* cycle layout - Responsive Grid */}
        <div className="mt-[clamp(28px,4vw,48px)] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)_minmax(0,1fr)] items-center gap-[clamp(16px,2.4vw,32px)]">
          
          {/* left column — 06, 05, 04 (bottom to top) */}
          <div className="order-2 lg:order-1 grid gap-[14px]">
            {cycleL.map((step) => (
              <CycleCard key={step.number} step={step} />
            ))}
          </div>

          {/* center — SVG diagram */}
          <div className="order-1 lg:order-2 flex justify-center w-full">
            <CycleDiagram />
          </div>

          {/* right column — 01, 02, 03 (top to bottom) */}
          <div className="order-3 grid gap-[14px]">
            {cycleR.map((step) => (
              <CycleCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}