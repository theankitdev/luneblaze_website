const metrics = [
  {
    number: "01",
    title: "Documentation Status",
    description: "Required documents and supporting evidence.",
    value: "84%",
  },
  {
    number: "02",
    title: "Staff Inclusivity",
    description: "Staff participation in quality initiatives.",
    value: "72%",
  },
  {
    number: "03",
    title: "Audit Frequency",
    description: "The regularity of institutional audits.",
    value: "76%",
  },
];

export default function ReadinessSection() {
  return (
    <section
      className="relative overflow-hidden px-[clamp(16px,3vw,32px)] py-[clamp(32px,3.6vw,52px)]"
    >
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "30px 30px",
            animation: "lbGridPan 38s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(700px,80vw)",
            height: "min(700px,80vw)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ animation: "lbSpin 130s linear infinite" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(23,174,185,.14)" }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "24%",
                border: "1px dashed rgba(23,174,185,.12)",
              }}
            />
          </div>
        </div>
      </div>

      {/* content grid */}
      <div
        className="relative mx-auto grid max-w-[1280px] border border-[#C9D9DC] bg-[#EDF7F8]"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit,minmax(min(100%,440px),1fr))",
        }}
      >
        {/* left — metrics */}
        <div
          className="border-b border-r border-[#C9D9DC] p-[clamp(28px,4vw,56px)]"
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
              Readiness Score™
            </span>
          </div>

          <h2 className="mt-3 text-balance text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            Know where you stand.{" "}
            <span className="text-[#0E8B95]">Know where to focus.</span>
          </h2>

          <p className="mt-[14px] text-[16px] leading-[1.7] text-[#4C6165]">
            Understand readiness through three practical parameters, so your
            next action is grounded in what your institution needs.
          </p>

          <div className="mt-6 border-t border-[#C9D9DC]">
            {metrics.map((metric) => (
              <div
                key={metric.number}
                className="grid items-center gap-[14px] border-b border-[#C9D9DC] py-4"
                style={{ gridTemplateColumns: "44px 1fr auto" }}
              >
                <b className="text-[14px] font-extrabold text-[#0E8B95]">
                  {metric.number}
                </b>
                <span>
                  <span className="block text-[16.5px] font-extrabold text-[#152A2E]">
                    {metric.title}
                  </span>
                  <span className="mt-[2px] block text-[14px] text-[#4C6165]">
                    {metric.description}
                  </span>
                </span>
                <span className="text-[18px] font-extrabold text-[#152A2E]">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* right — score ring */}
        <div className="grid place-items-center border-b border-[#C9D9DC] bg-white p-[clamp(28px,4vw,56px)] text-center">
          <div>
            <div
              className="mx-auto grid aspect-square place-items-center rounded-full"
              style={{
                width: "min(280px,70vw)",
                background:
                  "conic-gradient(#17AEB9 0 78%,#E6EEEF 78% 100%)",
              }}
            >
              <div
                className="grid aspect-square place-items-center rounded-full border border-[#E6EEEF] bg-white"
                style={{ width: "80%" }}
              >
                <div>
                  <strong
                    className="block text-[clamp(54px,6vw,72px)] font-extrabold leading-none tracking-[-.04em] text-[#152A2E]"
                  >
                    702
                    <span className="text-[24px] text-[#9AAAAD]">
                      /900
                    </span>
                  </strong>
                  <small className="mt-2 block text-[12px] font-extrabold uppercase tracking-[.08em] text-[#4C6165]">
                    Readiness Score™
                  </small>
                </div>
              </div>
            </div>

            <div className="mt-5 text-[13px] leading-[1.6] text-[#6A7C80]">
              Illustrative score · An internal readiness indicator
              <br />
              External accreditation outcomes depend on the assessor’s
              evaluation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}