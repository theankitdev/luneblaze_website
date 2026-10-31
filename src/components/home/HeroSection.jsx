import Link from "next/link";

const NAV_SIDE = [
  { t: "◫ Overview", active: true },
  { t: "▤ Documents" },
  { t: "▧ Evidence" },
  { t: "◎ Assessments" },
  { t: "✓ Audits" },
  { t: "↗ Reports" },
];

const BARS = [
  { m: "APR", h: "38%" },
  { m: "MAY", h: "47%" },
  { m: "JUN", h: "55%" },
  { m: "JUL", h: "63%" },
  { m: "AUG", h: "70%" },
  { m: "SEP", h: "78%", last: true },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-white">
      {/* bg image, faded */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/assets/lb-acchome.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* horizontal fade */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg,#fff 0,#fff 42%,rgba(255,255,255,.7) 62%,rgba(255,255,255,.2))",
        }}
      />

      {/* decorative layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(248,253,253,.6) 0%,rgba(241,250,251,.75) 46%,rgba(233,246,248,.9) 100%)",
          }}
        />
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
            width: "min(940px,96vw)",
            height: "min(940px,96vw)",
            animation: "lbSpin 150s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.13)]" />
          <div
            className="absolute rounded-full border border-dashed border-[rgba(23,174,185,.12)]"
            style={{ inset: "18%" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(91,91,214,.09)]"
            style={{ inset: "36%" }}
          />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-[clamp(36px,5vw,72px)] px-[clamp(16px,3vw,32px)] py-[clamp(40px,5vw,76px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr))]">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            AI-powered quality systems for education
          </span>

          <h1 className="mt-5 text-balance font-extrabold leading-[1.04] tracking-[-.035em] text-[#152A2E] [font-size:clamp(38px,5.2vw,68px)]">
            Drive institutional quality.{" "}
            <span className="text-[#17AEB9]">Inspire excellence.</span>
          </h1>

          <p className="mt-[22px] max-w-[560px] text-pretty text-[clamp(16px,1.35vw,18px)] leading-[1.7] text-[#4C6165]">
            Implement, measure and enhance institutional quality. Bring people,
            processes, evidence and improvement together with Luneblaze’s
            AI-powered quality ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-[10px] whitespace-nowrap rounded-[10px] bg-[#17AEB9] px-[26px] py-4 text-[16px] font-bold text-white shadow-[0_10px_24px_-14px_rgba(23,174,185,.9)] transition-colors hover:bg-[#0E8B95]"
            >
              Book a Demo <span>↗</span>
            </Link>
            <Link
              href="#ecosystem"
              className="inline-flex items-center whitespace-nowrap rounded-[10px] border border-[#C9D9DC] bg-white px-[26px] py-4 text-[16px] font-bold text-[#152A2E] transition-colors hover:border-[#17AEB9]"
            >
              Explore the Ecosystem
            </Link>
          </div>

          <div className="mt-[22px] text-[14px] font-semibold text-[#6A7C80]">
            For schools, colleges, universities &amp; groups of institutions
          </div>
        </div>

        {/* RIGHT — dashboard preview */}
        <div className="relative pb-[88px]">
          <div className="relative overflow-hidden rounded-[6px] border border-[#C9D9DC] bg-white shadow-[0_40px_80px_-48px_rgba(15,60,66,.55)]">
            {/* scan line */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-[30%]"
              style={{
                background:
                  "linear-gradient(180deg,transparent,rgba(23,174,185,.07),transparent)",
                animation: "lbScan 6s linear infinite",
              }}
            />

            {/* header */}
            <div className="flex items-center justify-between gap-[10px] border-b border-[#D6E3E5] bg-[#F7FAFA] px-4 py-[13px] text-[13px]">
              <b className="text-[#152A2E]">
                ◈ Luneblaze{" "}
                <span className="font-medium text-[#6A7C80]">
                  / Quality workspace
                </span>
              </b>
              <span className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border border-[#B7E2E5] bg-[#EDF7F8] px-2 py-[3px] text-[11px] font-bold text-[#0E8B95]">
                <span className="relative block h-[7px] w-[7px]">
                  <span className="absolute inset-0 rounded-full bg-[#17AEB9]" />
                  <span
                    className="absolute rounded-full border border-[#17AEB9]"
                    style={{
                      inset: "-5px",
                      animation: "lbRadar 2s ease-out infinite",
                    }}
                  />
                </span>
                Illustrative preview
              </span>
            </div>

            {/* body */}
            <div className="grid [grid-template-columns:minmax(0,150px)_minmax(0,1fr)]">
              {/* sidebar */}
              <aside className="border-r border-[#D6E3E5] py-[10px] text-[13px] font-semibold text-[#4C6165]">
                {NAV_SIDE.map((item) => (
                  <div
                    key={item.t}
                    className={`whitespace-nowrap overflow-hidden text-ellipsis px-4 py-[10px] ${
                      item.active
                        ? "border-l-[3px] border-[#17AEB9] bg-[#EDF7F8] text-[#0E8B95]"
                        : "border-l-[3px] border-transparent"
                    }`}
                  >
                    {item.t}
                  </div>
                ))}
              </aside>

              {/* main */}
              <div className="p-4">
                <div className="flex justify-between text-[15px] font-extrabold">
                  <span className="text-[#152A2E]">Quality at a glance</span>
                  <span className="text-[#17AEB9]">↗</span>
                </div>
                <div className="mt-[3px] text-[12px] text-[#6A7C80]">
                  Your institution’s continuous improvement journey
                </div>

                {/* stat grid */}
                <div className="mt-[14px] grid grid-cols-2 border border-[#D6E3E5]">
                  <div className="border-r border-[#D6E3E5] p-3">
                    <div className="text-[11px] font-bold text-[#6A7C80]">
                      Readiness Score™
                    </div>
                    <div className="mt-1 text-[28px] font-extrabold leading-none">
                      78
                      <span className="text-[13px] text-[#9AAAAD]"> / 100</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#6A7C80]">
                      Documentation · Staff · Audits
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[11px] font-bold text-[#6A7C80]">
                      Improvement actions
                    </div>
                    <div className="mt-1 text-[28px] font-extrabold leading-none">
                      18
                      <span className="text-[13px] text-[#9AAAAD]"> / 24</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#6A7C80]">
                      Completed this cycle
                    </div>
                  </div>
                </div>

                {/* bars */}
                <div className="mt-4 text-[11px] font-extrabold tracking-[.06em] text-[#6A7C80]">
                  READINESS OVER TIME
                </div>
                <div className="mt-[10px] flex h-24 items-end gap-2 border-b border-[#D6E3E5]">
                  {BARS.map((b, i) => (
                    <i
                      key={b.m}
                      className={`flex-1 origin-bottom ${
                        b.last ? "bg-[#17AEB9]" : "bg-[#B7E2E5]"
                      }`}
                      style={{
                        height: b.h,
                        animation:
                          "lfRise .9s cubic-bezier(.2,.7,.2,1) both",
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-[6px] flex justify-between gap-2 text-[10px] font-bold text-[#9AAAAD]">
                  {BARS.map((b) => (
                    <span key={b.m} className="flex-1 text-center">
                      {b.m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* floating card */}
          <div
            className="absolute bottom-0 flex max-w-[300px] items-start gap-3 rounded-[4px] border border-[#C9D9DC] border-l-[3px] border-l-[#17AEB9] bg-white px-4 py-[14px] shadow-[0_20px_40px_-26px_rgba(15,60,66,.5)]"
            style={{
              left: "clamp(-20px,-2vw,0px)",
              animation: "lfFloat 6s ease-in-out infinite",
            }}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#17AEB9] text-[14px] font-extrabold text-white">
              ✓
            </span>
            <div className="text-[13px] leading-[1.45] text-[#4C6165]">
              <b className="mb-[2px] block text-[14px] text-[#152A2E]">
                Small actions. Lasting improvement.
              </b>
              Every task connected to a bigger quality goal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}