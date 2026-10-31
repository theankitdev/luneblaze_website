import Link from "next/link";

const avatars = [
  "/assets/advisor-1.png",
  "/assets/advisor-2.png",
  "/assets/advisor-3.png",
  "/assets/advisor-4.png",
  "/assets/advisor-5.png",
];

const chips = [
  "Implementation guidance",
  "Capacity building",
  "Quality reviews",
];

export default function AdvisorsBand() {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-[#F4F8F8] px-5 py-16 sm:px-8 lg:py-20">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative grid overflow-hidden border border-[#C9D9DC] bg-[linear-gradient(120deg,#F3FAFB,#E4F4F5)] md:grid-cols-2">
          {/* orbit decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[120px] -top-[120px] h-[340px] w-[340px]"
          >
            <div
              className="absolute inset-0 rounded-full border border-[rgba(23,174,185,.18)]"
              style={{ animation: "lbSpin 90s linear infinite" }}
            />
          </div>

          {/* LEFT — avatars + 50+ */}
          <div className="relative flex flex-col justify-center gap-[18px] border-b border-[#C9D9DC] bg-white p-7 sm:p-10 md:border-b-0 md:border-r">
            <div className="flex items-center">
              {avatars.map((src, i) => (
                <div
                  key={src}
                  role="img"
                  aria-label="Advisor"
                  className="h-[clamp(54px,5.4vw,72px)] w-[clamp(54px,5.4vw,72px)] rounded-full border-[3px] border-white bg-[#DDEFF1] bg-cover bg-top shadow-[0_8px_18px_-10px_rgba(15,60,66,.5)]"
                  style={{
                    backgroundImage: `url('${src}')`,
                    marginLeft: i === 0 ? 0 : "-16px",
                  }}
                />
              ))}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[clamp(38px,4vw,52px)] font-extrabold leading-none tracking-[-.04em] text-[#17AEB9]">
                50+
              </span>
              <span className="text-[14.5px] leading-[1.45] text-[#4C6165]">
                <b className="text-[#152A2E]">
                  Education leaders &amp; quality experts
                </b>
                <br />
                guiding institutions across India and abroad
              </span>
            </div>
          </div>

          {/* RIGHT — heading + chips + CTA */}
          <div className="relative flex min-w-0 flex-col justify-center p-7 sm:p-10">
            <span className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-white px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]"
                style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
              />
              Connected quality
            </span>

            <h2 className="mt-3.5 text-[clamp(24px,2.6vw,34px)] font-extrabold leading-[1.15] tracking-[-.025em] text-[#152A2E]">
              Expertise alongside{" "}
              <span className="text-[#0E8B95]">your team.</span>
            </h2>

            <p className="mt-3 text-[15.5px] leading-[1.7] text-[#4C6165]">
              Luneblaze combines digital systems with implementation guidance,
              capacity building and quality reviews. Explore the people and
              experience behind our work.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-block whitespace-nowrap rounded-[3px] border border-[#BEE2E6] bg-white px-3 py-1.5 text-[13px] font-bold text-[#0E7A83]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <Link
              href="/advisors"
              className="mt-5 inline-flex items-center gap-2 self-start rounded-[4px] bg-[#17AEB9] px-[22px] py-[13px] text-[15px] font-bold text-white transition-colors hover:bg-[#0E8B95]"
              style={{ boxShadow: "0 12px 24px -12px rgba(23,174,185,.85)" }}
            >
              Meet our advisors ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}