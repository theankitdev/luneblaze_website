// src/components/framework/FrameworkFlow.jsx
"use client";

export default function FrameworkFlow({
  eyebrow,
  heading,
  headingHighlight,
  description,
  items = [],
  background = "#F4F8F8",
  accentColor = "#17AEB9",
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20"
      style={{ background }}
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: accentColor,
                animation: "lbPulse 2.4s ease-in-out infinite",
              }}
            />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
              {description}
            </p>
          )}
        </div>

        {/* Circular flow */}
        <div className="flex justify-center" style={{ marginTop: "clamp(32px,4.5vw,52px)" }}>
          <div
            style={{
              position: "relative",
              width: "min(560px,100%)",
              aspectRatio: "1",
            }}
          >
            {/* Dashed rotating ring */}
            <div
              style={{
                position: "absolute",
                inset: "13%",
                border: "2px dashed #9FD8DD",
                borderRadius: "50%",
                animation: "lbSpin 60s linear infinite",
              }}
            />
            {/* Center disc */}
            <div
              style={{
                position: "absolute",
                inset: "35%",
                borderRadius: "50%",
                background: accentColor,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                fontWeight: 800,
                fontSize: "clamp(13px,1.6vw,18px)",
                lineHeight: 1.25,
                padding: 8,
                boxShadow: "0 20px 40px -20px rgba(23,174,185,.8)",
              }}
            >
              Continuous
              <br />
              Improvement
            </div>

            {/* Item cards around the circle */}
            {items.map((it, j) => {
              const angle = (-90 + (j * 360) / items.length) * (Math.PI / 180);
              const fx = (50 + 43 * Math.cos(angle)).toFixed(2) + "%";
              const fy = (50 + 43 * Math.sin(angle)).toFixed(2) + "%";
              return (
                <div
                  key={it.title}
                  style={{
                    position: "absolute",
                    left: fx,
                    top: fy,
                    transform: "translate(-50%,-50%)",
                    width: "clamp(92px,24%,132px)",
                    background: "#fff",
                    border: "1px solid #C9D9DC",
                    borderTop: `3px solid ${accentColor}`,
                    padding: "10px 8px",
                    textAlign: "center",
                    boxShadow: "0 16px 30px -22px rgba(15,60,66,.55)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      color: "#0E8B95",
                    }}
                  >
                    {String(j + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontWeight: 800,
                      fontSize: "clamp(13px,1.4vw,15.5px)",
                      color: "#152A2E",
                    }}
                  >
                    {it.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}