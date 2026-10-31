// src/components/shared/FinalCTA.jsx
import Link from "next/link";

export default function FinalCTA({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref = "/book-a-demo",
  mail,
  background = "#F4F8F8",
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background,
        paddingTop: "clamp(44px,5vw,72px)",
        paddingBottom: "clamp(44px,5vw,72px)",
        paddingLeft: "clamp(16px,3vw,32px)",
        paddingRight: "clamp(16px,3vw,32px)",
      }}
    >
      {/* decorative bg */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.36]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-18%",
            right: "-8%",
            width: "min(460px,48vw)",
            height: "min(460px,48vw)",
            animation: "lbSpin 120s linear infinite",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(23,174,185,.14)" }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "26%",
              border: "1px dashed rgba(23,174,185,.12)",
            }}
          />
        </div>
      </div>

      {/* CTA card */}
      <div className="relative mx-auto max-w-[1280px] overflow-hidden border border-[#17AEB9] bg-[#17AEB9] px-[clamp(22px,5vw,64px)] py-[clamp(36px,4.5vw,64px)] text-center text-white">
        {/* card decorations */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle,rgba(255,255,255,.4) 1.1px,transparent 1.1px)",
              backgroundSize: "30px 30px",
              animation: "lbGridPan 46s linear infinite",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "-40%",
              left: "50%",
              width: "min(780px,90vw)",
              height: "min(780px,90vw)",
              marginLeft: "calc(min(780px, 90vw) / -2)",
              animation: "lbSpin 140s linear infinite",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(255,255,255,.22)" }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "24%",
                border: "1px dashed rgba(255,255,255,.2)",
              }}
            />
          </div>
        </div>

        <div className="relative">
          <div className="text-[13px] font-extrabold uppercase tracking-[.06em] text-white">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-balance text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.08] tracking-[-.03em] text-white">
            {heading}
          </h2>
          <p className="mx-auto mt-[14px] max-w-[580px] text-[17px] leading-[1.7] text-white">
            {body}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-[10px] rounded-[4px] bg-white px-7 py-4 text-[16px] font-extrabold text-[#152A2E] transition-colors hover:bg-[#152A2E] hover:text-white"
            >
              {ctaLabel}
            </Link>
            {mail && (
              <Link
                href={`mailto:${mail}`}
                className="inline-flex items-center rounded-[4px] border border-[rgba(255,255,255,.7)] px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-[rgba(255,255,255,.14)]"
              >
                {mail}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}