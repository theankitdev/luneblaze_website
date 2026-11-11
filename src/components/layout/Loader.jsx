"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // let the arc finish a sweep instead of blinking out
    const HOLD = 260;

    const hide = () => {
      setDone(true);
      setTimeout(() => setMounted(false), 560);
    };

    // hide as soon as the page has fully loaded
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    // never trap the visitor if an asset stalls
    const failsafe = setTimeout(hide, 6000);

    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(failsafe);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        #lb-loader {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 26px;
          background: linear-gradient(160deg, #FCFDFD 0%, #F1FAFB 46%, #E9F6F8 100%);
          transition: opacity .5s ease, visibility .5s ease;
        }
        #lb-loader.lb-done {
          opacity: 0; visibility: hidden; pointer-events: none;
        }
        #lb-loader .lb-grid {
          position: absolute; inset: 0; opacity: .4;
          background-image: radial-gradient(circle, rgba(23,174,185,.2) 1.1px, transparent 1.1px);
          background-size: 30px 30px;
        }
        #lb-loader .lb-mark {
          position: relative; width: 132px; height: 132px;
        }
        #lb-loader .lb-mark svg {
          position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible;
        }
        #lb-loader .lb-core {
          position: absolute; inset: 26px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 14px 30px -16px rgba(15,60,66,.45);
        }
        #lb-loader .lb-core img {
          width: 44px; height: auto; display: block;
          animation: lbLoadPulse 2s ease-in-out infinite;
        }
        #lb-loader .lb-core span {
          font: 800 24px/1 Manrope, ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -.03em;
          color: #17AEB9;
          animation: lbLoadPulse 2s ease-in-out infinite;
        }
        #lb-loader .lb-ring-outer { animation: lbLoadSpin 14s linear infinite; }
        #lb-loader .lb-ring-inner { animation: lbLoadSpin 10s linear infinite reverse; }
        #lb-loader .lb-ring-arc   { animation: lbLoadSpin 1.5s cubic-bezier(.5,.15,.35,.9) infinite; }
        #lb-loader .lb-orbit      { animation: lbLoadSpin 6s linear infinite; }
        #lb-loader .lb-ring-outer,
        #lb-loader .lb-ring-inner,
        #lb-loader .lb-ring-arc,
        #lb-loader .lb-orbit { transform-origin: 66px 66px; }
        #lb-loader .lb-cap {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 11px;
        }
        #lb-loader .lb-cap b {
          font: 800 11px/1 Manrope, ui-sans-serif, system-ui, sans-serif;
          letter-spacing: .22em; text-transform: uppercase;
          color: #0E7A83;
        }
        #lb-loader .lb-bar {
          display: block; width: 132px; height: 3px;
          border-radius: 99px;
          background: rgba(23,174,185,.18);
          overflow: hidden;
        }
        #lb-loader .lb-bar i {
          display: block; width: 40%; height: 100%;
          border-radius: 99px;
          background: #17AEB9;
          animation: lbLoadBar 1.25s cubic-bezier(.5,.1,.5,.9) infinite;
        }
        @keyframes lbLoadSpin { to { transform: rotate(360deg); } }
        @keyframes lbLoadPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(.9); opacity: .72; }
        }
        @keyframes lbLoadBar {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(360%); }
        }
        @media (max-width: 560px) {
          #lb-loader { gap: 20px; }
          #lb-loader .lb-mark { width: 104px; height: 104px; }
          #lb-loader .lb-core { inset: 21px; }
          #lb-loader .lb-core img { width: 34px; }
          #lb-loader .lb-bar { width: 104px; }
          #lb-loader .lb-ring-outer,
          #lb-loader .lb-ring-inner,
          #lb-loader .lb-ring-arc,
          #lb-loader .lb-orbit { transform-origin: 52px 52px; }
        }
        @media (prefers-reduced-motion: reduce) {
          #lb-loader * { animation: none !important; }
        }
      `}</style>

      <div
        id="lb-loader"
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={done ? "lb-done" : ""}
      >
        <div className="lb-grid" aria-hidden="true" />

        <div className="lb-mark">
          <svg viewBox="0 0 132 132" aria-hidden="true">
            <circle
              className="lb-ring-outer"
              cx="66"
              cy="66"
              r="62"
              fill="none"
              stroke="rgba(23,174,185,.18)"
              strokeWidth="1"
              strokeDasharray="5 8"
            />
            <circle
              className="lb-ring-inner"
              cx="66"
              cy="66"
              r="47"
              fill="none"
              stroke="rgba(91,91,214,.16)"
              strokeWidth="1"
              strokeDasharray="3 7"
            />
            <circle
              className="lb-ring-arc"
              cx="66"
              cy="66"
              r="62"
              fill="none"
              stroke="#17AEB9"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="98 292"
            />
            <g className="lb-orbit">
              <circle cx="66" cy="4" r="4.2" fill="#17AEB9" />
              <circle cx="125" cy="85" r="4.2" fill="#17AEB9" />
              <circle cx="7" cy="85" r="4.2" fill="#17AEB9" />
            </g>
          </svg>
          <div className="lb-core">
            <img
              src="/assets/luneblaze-mark.png"
              alt=""
              onError={(e) => {
                const span = document.createElement("span");
                span.textContent = "LB";
                e.currentTarget.replaceWith(span);
              }}
            />
          </div>
        </div>

        <div className="lb-cap">
          <b>Luneblaze</b>
          <span className="lb-bar">
            <i />
          </span>
        </div>
      </div>
    </>
  );
}