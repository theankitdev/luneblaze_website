// src/components/framework/FrameworkAlso.jsx
"use client";

export default function FrameworkAlso({
  id,
  eyebrow,
  heading,
  headingHighlight,
  description,
  items = [],
  tone = "light",
  background = "#FFFFFF",
  min = "300px",
}) {
  const bg = tone === "white" ? "#fff" : background;

  return (
    <section
      id={id}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px,5vw,72px) clamp(16px,3vw,32px)",
        background: bg,
        borderBottom: "1px solid #D6E3E5",
      }}
    >
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        {/* Centered head */}
        <div style={{ textAlign: "center" }}>
          {eyebrow && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "rgba(223,241,243,.9)",
                border: "1px solid #BEE2E6",
                borderRadius: 999,
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#0E7A83",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#17AEB9",
                  animation: "lbPulse 2.4s ease-in-out infinite",
                }}
              />
              {eyebrow}
            </span>
          )}

          {(heading || headingHighlight) && (
            <h2
              style={{
                margin: "14px 0 0",
                fontWeight: 800,
                fontSize: "clamp(28px,3.4vw,46px)",
                lineHeight: 1.1,
                letterSpacing: "-.03em",
                color: "#152A2E",
              }}
            >
              {heading}{" "}
              {headingHighlight && (
                <span style={{ color: "#17AEB9" }}>{headingHighlight}</span>
              )}
            </h2>
          )}

          {description && (
            <p
              style={{
                margin: "16px auto 0",
                maxWidth: 700,
                fontSize: 17,
                lineHeight: 1.7,
                color: "#4C6165",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Grid of "also working towards" cards */}
        <div
          style={{
            marginTop: "clamp(32px,4.5vw,52px)",
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}),1fr))`,
            border: "1px solid #C9D9DC",
            background: "#fff",
          }}
        >
          {items.map((it, i) => (
            <article
              key={it.title}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "clamp(24px,2.8vw,34px)",
                borderRight: "1px solid #D6E3E5",
                borderBottom: "1px solid #D6E3E5",
                borderTop: `3px solid ${i === 0 ? "#17AEB9" : "transparent"}`,
                transition: "background .25s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4FAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {it.badge && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      color: "#fff",
                      background: "#17AEB9",
                      padding: "5px 9px",
                      borderRadius: 3,
                    }}
                  >
                    {it.badge}
                  </span>
                )}
                {it.logo && (
                  <div
                    role="img"
                    aria-label={it.title}
                    style={{
                      width: 56,
                      height: 56,
                      border: "1px solid #E6EEEF",
                      background: `#fff url('${it.logo}') center/72% no-repeat`,
                    }}
                  />
                )}
              </div>

              <h3
                style={{
                  margin: "18px 0 0",
                  fontWeight: 800,
                  fontSize: "clamp(19px,1.7vw,22px)",
                  lineHeight: 1.25,
                  letterSpacing: "-.015em",
                  color: "#152A2E",
                }}
              >
                {it.title}
              </h3>

              {it.sub && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: ".02em",
                    color: "#0E8B95",
                  }}
                >
                  {it.sub}
                </div>
              )}

              {it.desc && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "#4C6165",
                  }}
                >
                  {it.desc}
                </p>
              )}

              {it.cta && it.href && (
                <a
                  href={it.href}
                  style={{
                    marginTop: "auto",
                    paddingTop: 20,
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#0E8B95",
                    textDecoration: "none",
                  }}
                >
                  {it.cta}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}