export default function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden"
      style={{
        padding: "clamp(32px, 3.6vw, 52px) clamp(16px, 3vw, 32px)",
        background: "#fff",
        borderTop: "1px solid #D6E3E5",
        borderBottom: "1px solid #D6E3E5",
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
              The Luneblaze quality ecosystem
            </span>
          </div>
          <h2
            className="mt-3 font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]"
            style={{
              fontSize: "clamp(28px, 3.4vw, 46px)",
              textWrap: "balance",
            }}
          >
            Quality needs a system.{" "}
            <span className="text-[#17AEB9]">Excellence grows from it.</span>
          </h2>
          <p
            className="mx-auto"
            style={{
              marginTop: "16px",
              maxWidth: "680px",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#4C6165",
            }}
          >
            Move beyond scattered files and last-minute preparation. Create a
            connected approach that supports your institution every day.
          </p>
        </div>

        {/* video clip — "One ecosystem, three pillars" */}
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
              src="/film/clip.html?s=Pillars&d=15.6&hold=3"
              title="One ecosystem, three pillars"
              loading="lazy"
              className="absolute inset-0 block h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}