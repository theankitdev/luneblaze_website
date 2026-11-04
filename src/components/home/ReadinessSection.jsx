export default function ReadinessSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(32px, 3.6vw, 52px) clamp(16px, 3vw, 32px)",
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
            opacity: 0.4,
            backgroundImage:
              "radial-gradient(circle, rgba(23,174,185,.18) 1.1px, transparent 1.1px)",
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
            width: "min(700px, 80vw)",
            height: "min(700px, 80vw)",
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
              Readiness Score™
            </span>
          </div>
          <h2
            className="mx-auto mt-3 font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]"
            style={{
              fontSize: "clamp(28px, 3.2vw, 42px)",
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            Know where you stand.{" "}
            <span className="text-[#0E8B95]">Know where to focus.</span>
          </h2>
          <p
            className="mx-auto"
            style={{
              marginTop: "14px",
              maxWidth: "680px",
              textAlign: "center",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            Understand readiness through three practical parameters, so your
            next action is grounded in what your institution needs.
          </p>
        </div>

        {/* video clip — Readiness Score meter */}
        <div style={{ marginTop: "clamp(24px, 3vw, 36px)" }}>
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 9",
              border: "1px solid #C9D9DC",
              borderRadius: "12px",
              background: "#FAF6EE",
              boxShadow: "0 24px 50px -34px rgba(21,42,46,.45)",
            }}
          >
            <iframe
              src="/film/clip.html?s=Readiness&d=7.4&hold=3"
              title="Readiness Score meter"
              loading="lazy"
              className="absolute inset-0 block h-full w-full border-0"
            />
          </div>
        </div>

        {/* footnote */}
        <p
          style={{
            margin: "12px 0 0",
            textAlign: "center",
            fontSize: "12.5px",
            lineHeight: 1.6,
            color: "#6A7C80",
          }}
        >
          Illustrative score · An internal readiness indicator. External
          accreditation outcomes depend on the assessor’s evaluation.
        </p>
      </div>
    </section>
  );
}