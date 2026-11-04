export default function QualitySystemFilm() {
  return (
    <>
      {/* ── Film clip 1: "Building the quality muscle" ── */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(24px, 2.6vw, 38px) clamp(18px, 4vw, 40px) 0",
          background: "#F4F8F8",
        }}
      >
        <div className="mx-auto max-w-[1100px]">
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
              src="/film/clip.html?s=Turn&d=12&hold=3"
              title="Building the quality muscle inside every institution"
              loading="lazy"
              className="absolute inset-0 block h-full w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* ── Film clip 2: "One ecosystem, three pillars" ── */}
      <section
        id="quality-system"
        className="relative overflow-hidden"
        style={{
          padding: "clamp(24px, 2.6vw, 38px) clamp(16px, 3vw, 32px)",
          background: "#F4F8F8",
          boxShadow: "0 24px 40px -30px rgba(21,42,46,.35)",
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
      </section>
    </>
  );
}