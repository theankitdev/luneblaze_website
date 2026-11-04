import Link from "next/link";

const campuses = [
  { name: "Campus North",   score: 86, bar: "#17AEB9" },
  { name: "Campus Central", score: 78, bar: "#17AEB9" },
  { name: "Campus East",    score: 72, bar: "#17AEB9" },
  { name: "Campus West",    score: 69, bar: "#17AEB9" },
  { name: "Campus South",   score: 64, bar: "#E0A42B" },
];

export default function GroupsSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "0 clamp(16px, 3vw, 32px) clamp(36px, 4.4vw, 64px)",
        background: "#F4F8F8",
      }}
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.42,
            backgroundImage:
              "radial-gradient(circle, rgba(91,91,214,.18) 1.1px, transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 44s linear infinite reverse",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-24%",
            left: "2%",
            width: "min(440px, 46vw)",
            height: "min(440px, 46vw)",
            animation: "lbSpinRev 108s linear infinite",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(91,91,214,.16)" }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "26%",
              border: "1px dashed rgba(91,91,214,.14)",
            }}
          />
        </div>
      </div>

      {/* content panel */}
      <div
        className="relative mx-auto grid max-w-[1280px] border border-[#C9D9DC] bg-white"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
        }}
      >
        {/* LEFT panel */}
        <div
          className="flex flex-col border-b border-r border-[#D6E3E5]"
          style={{ padding: "clamp(28px, 4vw, 56px)" }}
        >
          <div>
            <span
              className="inline-flex items-center whitespace-nowrap rounded-full border border-[#BEE2E6] px-[14px] py-[6px] text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]"
              style={{ background: "rgba(223,241,243,.9)" }}
            >
              <span
                className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Built for groups of institutions
            </span>
          </div>

          <h2
            className="font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]"
            style={{
              margin: "12px 0 0",
              fontSize: "clamp(28px, 3.2vw, 42px)",
              textWrap: "balance",
            }}
          >
            One quality vision.{" "}
            <span className="text-[#17AEB9]">Every institution.</span>
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            Monitor quality across campuses, compare performance and coordinate
            improvement. Bring common standards and leadership reporting
            together while each institution owns its work.
          </p>

          <div
            role="img"
            aria-label="Campus illustration"
            style={{
              marginTop: "22px",
              aspectRatio: "2 / 1",
              border: "1px solid #E6EEEF",
              background:
                "#fff url('/assets/ill-groups-vision.svg') center 100%/cover no-repeat",
            }}
          />

          <Link
            href="/group-of-institutions"
            className="inline-flex items-center gap-2 self-start rounded-[10px] bg-[#17AEB9] px-[22px] py-[14px] text-[15px] font-bold text-white transition-colors hover:bg-[#0E8B95]"
            style={{
              marginTop: "24px",
              boxShadow: "0 12px 28px -12px rgba(23,174,185,.85)",
            }}
          >
            Discover the Group Dashboard ↗
          </Link>
        </div>

        {/* RIGHT panel */}
        <div
          className="flex flex-col border-b border-[#D6E3E5] bg-[#F7FAFA]"
          style={{ padding: "clamp(24px, 3.4vw, 48px)" }}
        >
          <div className="flex flex-1 flex-col rounded-[4px] border border-[#C9D9DC] bg-white">
            {/* header */}
            <div className="flex items-center justify-between gap-[10px] border-b border-[#D6E3E5] px-[18px] py-[14px]">
              <h3
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "#152A2E",
                }}
              >
                Group quality overview
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0E8B95",
                  border: "1px solid #B7E2E5",
                  background: "#EDF7F8",
                  padding: "3px 8px",
                  borderRadius: "3px",
                }}
              >
                Sample data
              </span>
            </div>

            {/* column headers */}
            <div
              className="grid gap-3 border-b border-[#E6EEEF] px-[18px] py-[10px] text-[11px] font-extrabold tracking-[.08em] text-[#6A7C80]"
              style={{
                gridTemplateColumns:
                  "minmax(0, 1.2fr) 90px minmax(0, 1fr)",
              }}
            >
              <span>CAMPUS</span>
              <span>READINESS</span>
              <span>PROGRESS</span>
            </div>

            {/* rows */}
            <div className="flex flex-1 flex-col">
              {campuses.map((campus) => (
                <div
                  key={campus.name}
                  className="grid flex-1 items-center gap-3 border-b border-[#EEF3F4] px-[18px] py-4"
                  style={{
                    gridTemplateColumns:
                      "minmax(0, 1.2fr) 90px minmax(0, 1fr)",
                    fontSize: "14.5px",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#152A2E" }}>
                    {campus.name}
                  </span>
                  <span style={{ fontWeight: 800, color: "#152A2E" }}>
                    {campus.score} / 100
                  </span>
                  <span style={{ height: "8px", background: "#E6EEEF" }}>
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${campus.score}%`,
                        background: campus.bar,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                margin: 0,
                padding: "12px 18px",
                fontSize: "13px",
                color: "#6A7C80",
              }}
            >
              Individual institution progress. A shared view for leadership.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}