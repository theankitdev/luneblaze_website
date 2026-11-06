// src/components/framework/FrameworkTimeline.jsx
"use client";

import { useEffect, useRef } from "react";

export default function FrameworkTimeline({
  eyebrow,
  heading,
  headingHighlight,
  description,
  items = [],
  background = "#F4F8F8",
  accentColor = "#17AEB9",
}) {
  const colors = ["#17AEB9", "#5B5BD6", "#B98200", "#C4373C", "#12B981"];
  const railRef = useRef(null);

  return (
    <section
      className="relative overflow-hidden border-b border-[#D6E3E5] px-5 py-16 sm:px-8 lg:py-20"
      style={{ background }}
    >
      <style>{`
        @keyframes lfTlGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes lfTlRun {
          0%   { left: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes lfTlPop {
          0%   { transform: scale(.4); opacity: 0; }
          70%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        .lf-tl > div:hover .lf-tl-node {
          transform: scale(1.12);
        }
        .lf-tl [data-rv] {
          width: 100%;
        }
        @media (max-width: 1240px) {
          .lf-tl {
            grid-auto-columns: 200px !important;
            width: max-content !important;
          }
        }
        .lf-tl-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 26px 44px -26px rgba(15,60,66,.55) !important;
        }
        .lf-tl-card-down:hover {
          transform: translateY(4px) !important;
          box-shadow: 0 26px 44px -26px rgba(15,60,66,.55) !important;
        }
      `}</style>

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
          <h2 className="mx-auto mt-3.5 max-w-3xl text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#152A2E]">
            {heading}{" "}
            <span style={{ color: accentColor }}>{headingHighlight}</span>
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
              {description}
            </p>
          )}
        </div>

        {/* Snake timeline rail */}
        <div
          ref={railRef}
          className="lf-rail mt-12 overflow-x-auto pb-6"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div
            className="lf-tl relative"
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "minmax(0, 1fr)",
              width: "100%",
            }}
          >
            {/* baseline */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 6,
                marginTop: -3,
                background: "#E4EEEF",
              }}
            />
            {/* gradient fill */}
            <div
              aria-hidden="true"
              className="lf-tl-fill"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 6,
                marginTop: -3,
                background:
                  "linear-gradient(90deg,#17AEB9,#5B5BD6 30%,#B98200 58%,#C4373C 80%,#12B981)",
                transformOrigin: "left",
                animation: "lfTlGrow 2.4s cubic-bezier(.22,.8,.2,1) both",
              }}
            />

            {/* Running dot — matches .lf-tl running dot in HTML */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: 14,
                height: 14,
                marginTop: -7,
                borderRadius: "50%",
                background: "#fff",
                boxShadow:
                  "0 0 0 4px rgba(23,174,185,.35), 0 0 18px 4px rgba(23,174,185,.55)",
                animation: "lfTlRun 7s linear 2.4s infinite",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />

            {items.map((it, i) => {
              const color = colors[i % colors.length];
              const up = i % 2 === 0;
              const stage = String(i + 1).padStart(2, "0");
              const delay = `${(0.3 + i * 0.18).toFixed(2)}s`;

              return (
                <div
                  key={stage}
                  style={{
                    position: "relative",
                    minWidth: 0,
                    display: "grid",
                    gridTemplateRows: "minmax(0,1fr) 72px minmax(0,1fr)",
                    padding: "0 6px",
                  }}
                >
                  {/* top slot */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      minHeight: 190,
                    }}
                  >
                    {up && (
                      <>
                        <div
                          className="lf-tl-card"
                          data-rv=""
                          style={{
                            position: "relative",
                            background: "#fff",
                            border: "1px solid #C9D9DC",
                            borderTop: `3px solid ${color}`,
                            padding: "14px 15px 15px",
                            boxShadow: "0 18px 36px -28px rgba(15,60,66,.5)",
                            transition: "transform .3s, box-shadow .3s",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              letterSpacing: ".12em",
                              color,
                            }}
                          >
                            STAGE {stage}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 800,
                              fontSize: 15.5,
                              lineHeight: 1.3,
                              color: "#152A2E",
                            }}
                          >
                            {it.title}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 13,
                              lineHeight: 1.55,
                              color: "#4C6165",
                            }}
                          >
                            {it.desc}
                          </div>
                        </div>
                        <div
                          style={{
                            alignSelf: "center",
                            width: 2,
                            height: 18,
                            background: color,
                            opacity: 0.6,
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* node */}
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="lf-tl-node"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "#fff",
                        border: `3px solid ${color}`,
                        color,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: 17,
                        boxShadow:
                          "0 0 0 6px #fff, 0 12px 26px -12px rgba(15,60,66,.55)",
                        animation:
                          "lfTlPop .6s cubic-bezier(.34,1.5,.5,1) both",
                        animationDelay: delay,
                        transition: "transform .25s",
                      }}
                    >
                      {stage}
                    </div>
                  </div>

                  {/* bottom slot */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      minHeight: 190,
                    }}
                  >
                    {!up && (
                      <>
                        <div
                          style={{
                            alignSelf: "center",
                            width: 2,
                            height: 18,
                            background: color,
                            opacity: 0.6,
                          }}
                        />
                        <div
                          className="lf-tl-card-down"
                          data-rv=""
                          style={{
                            position: "relative",
                            background: "#fff",
                            border: "1px solid #C9D9DC",
                            borderBottom: `3px solid ${color}`,
                            padding: "14px 15px 15px",
                            boxShadow: "0 18px 36px -28px rgba(15,60,66,.5)",
                            transition: "transform .3s, box-shadow .3s",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              letterSpacing: ".12em",
                              color,
                            }}
                          >
                            STAGE {stage}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 800,
                              fontSize: 15.5,
                              lineHeight: 1.3,
                              color: "#152A2E",
                            }}
                          >
                            {it.title}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 13,
                              lineHeight: 1.55,
                              color: "#4C6165",
                            }}
                          >
                            {it.desc}
                          </div>
                        </div>
                      </>
                    )}
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