import Link from "next/link";
import Image from "next/image";

const companyLinks = [
  { name: "About Us", href: "/about-us" },
  { name: "Job Openings", href: "/careers" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms and Rules", href: "/terms-and-rules" },
];

const resourceLinks = [
  { name: "Blogs", href: "/blogs" },
  { name: "Webinars", href: "/webinars" },
  { name: "Newsletter", href: "https://www.linkedin.com/newsletters/7125753253224493056/", external: true },
  { name: "News", href: "/news" },
];

const usefulLinks = [
  { name: "SQAAF Handbook", href: "/blogs", download: true },
  { name: "NABET Handbook", href: "/blogs", download: true },
  { name: "NAAC Handbook", href: "/blogs", download: true },
  { name: "NBA Handbook", href: "/blogs", download: true },
  { name: "NIRF Handbook", href: "/blogs", download: true },
  { name: "Join SQAAF Group", href: "https://wa.me/918810418840?text=Hi%20Luneblaze%2C%20please%20add%20me%20to%20the%20SQAAF%20group." },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/luneblaze", path: "M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" },
  { label: "YouTube", href: "https://www.youtube.com/@luneblaze", path: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" },
  { label: "Facebook", href: "https://www.facebook.com/luneblaze", path: "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.49-1.46H17V4.4c-.28-.04-1.25-.12-2.38-.12-2.36 0-3.97 1.44-3.97 4.08v2.14H8v3h2.65V21h2.85Z" },
  { label: "Instagram", href: "https://www.instagram.com/luneblaze", path: "M12 2.6c-2.55 0-2.87.01-3.87.06-1 .04-1.68.2-2.28.44a4.6 4.6 0 0 0-1.66 1.08A4.6 4.6 0 0 0 3.1 5.84c-.23.6-.4 1.28-.44 2.28C2.61 9.13 2.6 9.45 2.6 12s.01 2.87.06 3.87c.04 1 .2 1.68.44 2.28a4.6 4.6 0 0 0 1.08 1.66 4.6 4.6 0 0 0 1.66 1.08c.6.23 1.28.4 2.28.44 1 .05 1.32.06 3.87.06s2.87-.01 3.87-.06c1-.04 1.68-.2 2.28-.44a4.6 4.6 0 0 0 1.66-1.08 4.6 4.6 0 0 0 1.08-1.66c.23-.6.4-1.28.44-2.28.05-1 .06-1.32.06-3.87s-.01-2.87-.06-3.87c-.04-1-.2-1.68-.44-2.28a4.6 4.6 0 0 0-1.08-1.66A4.6 4.6 0 0 0 18.16 3.1c-.6-.23-1.28-.4-2.28-.44-1-.05-1.32-.06-3.87-.06Zm0 1.69c2.5 0 2.8.01 3.79.05.91.05 1.4.2 1.73.33.44.17.75.37 1.08.7.33.33.53.64.7 1.08.13.33.28.82.33 1.73.04.99.05 1.29.05 3.79s-.01 2.8-.05 3.79c-.05.91-.2 1.4-.33 1.73-.17.44-.37.75-.7 1.08a2.9 2.9 0 0 1-1.08.7c-.33.13-.82.28-1.73.33-.99.04-1.29.05-3.79.05s-2.8-.01-3.79-.05c-.91-.05-1.4-.2-1.73-.33a2.9 2.9 0 0 1-1.08-.7 2.9 2.9 0 0 1-.7-1.08c-.13-.33-.28-.82-.33-1.73-.04-.99-.05-1.29-.05-3.79s.01-2.8.05-3.79c.05-.91.2-1.4.33-1.73.17-.44.37-.75.7-1.08a2.9 2.9 0 0 1 1.08-.7c.33-.13.82-.28 1.73-.33.99-.04 1.29-.05 3.79-.05Zm0 2.87a4.84 4.84 0 1 0 0 9.68 4.84 4.84 0 0 0 0-9.68Zm0 7.98a3.14 3.14 0 1 1 0-6.28 3.14 3.14 0 0 1 0 6.28Zm6.16-8.17a1.13 1.13 0 1 1-2.26 0 1.13 1.13 0 0 1 2.26 0Z" },
  { label: "X", href: "https://x.com/luneblaze", path: "M17.2 3h3.3l-7.2 8.23L21.5 21h-6.1l-4.78-6.25L5.14 21H1.83l7.5-8.57L2.2 3h6.25l4.5 5.95L17.2 3Zm-1.16 16h1.83L7.02 4.9H5.06L16.04 19Z" },
];

export default function Footer() {
  return (
    <footer className="relative mt-[clamp(10px,1.5vw,20px)] overflow-hidden border-t border-[#21535B] bg-[#0D3940] px-[clamp(20px,4vw,52px)] pb-[26px] pt-[clamp(46px,5.5vw,76px)] text-white">
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.07) 1.1px, transparent 1.1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto max-w-[1360px]">
        {/* Grid */}
        <div className="grid grid-cols-2 gap-[clamp(16px,2.2vw,34px)] pb-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Image
              src="/assets/luneblaze-logo-white.png"
              alt="Luneblaze"
              width={190}
              height={50}
              className="block h-auto w-full max-w-[190px]"
            />
            <p className="mt-4 text-[clamp(14.5px,1.1vw,16.5px)] font-extrabold leading-[1.35] tracking-[-0.02em] text-white">
              Quality Institutions
              <br />
              Quality Education
            </p>
            <div className="mt-[18px] flex gap-[6px]">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-[#21535B] bg-white/[0.06] text-[#C6DFE2] transition-colors hover:border-[#17AEB9] hover:bg-[#17AEB9] hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="m-0 text-[clamp(14px,1.1vw,16px)] font-extrabold tracking-[-0.012em] text-white">
              Company
            </h3>
            <div className="mt-4 grid gap-[11px]">
              {companyLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] transition-colors hover:text-[#5CD3DB]"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="m-0 text-[clamp(14px,1.1vw,16px)] font-extrabold tracking-[-0.012em] text-white">
              Resources
            </h3>
            <div className="mt-4 grid gap-[11px]">
              {resourceLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] transition-colors hover:text-[#5CD3DB]"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="m-0 text-[clamp(14px,1.1vw,16px)] font-extrabold tracking-[-0.012em] text-white">
              Useful Links
            </h3>
            <div className="mt-4 grid gap-[11px]">
              {usefulLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] transition-colors hover:text-[#5CD3DB]"
                >
                  {l.name}
                  {l.download && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-none opacity-60"
                    >
                      <path d="M12 4v12" />
                      <path d="M7 11l5 5 5-5" />
                      <path d="M5 20h14" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="m-0 text-[clamp(14px,1.1vw,16px)] font-extrabold tracking-[-0.012em] text-white">
              Contact
            </h3>
            <div className="mt-4 grid gap-[11px]">
              <a
                href="https://wa.me/918810418840?text=Hi%20Luneblaze%2C%20I%20have%20a%20question."
                className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] hover:text-[#5CD3DB]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="flex-none text-[#25936B]">
                  <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
                </svg>
                Chat with us
              </a>
              <a
                href="tel:+918810418840"
                className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] hover:text-[#5CD3DB]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none text-[#0E8B95]">
                  <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 5 6.1 1.5 1.5 0 0 1 6.5 3.5Z" />
                </svg>
                +91 88104 18840
              </a>
              <a
                href="mailto:contact@luneblaze.com"
                className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2] hover:text-[#5CD3DB]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none text-[#0E8B95]">
                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                  <path d="M3.5 7l8.5 6 8.5-6" />
                </svg>
                contact@luneblaze.com
              </a>
              <span className="flex items-start gap-2 text-[13px] font-semibold leading-[1.45] text-[#C6DFE2]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none text-[#0E8B95]">
                  <path d="M12 21s6.5-5.7 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 15.3 12 21 12 21Z" />
                  <circle cx="12" cy="10.4" r="2.3" />
                </svg>
                Faridabad, Haryana – 121006
              </span>
            </div>
          </div>

          {/* Supported By */}
          <div>
            <h3 className="m-0 text-[clamp(14px,1.1vw,16px)] font-extrabold tracking-[-0.012em] text-white">
              Supported By
            </h3>
            <div className="mt-4 grid gap-[9px]">
              {[
                { src: "/assets/partner-ecurise-dark.png", alt: "ECURISE 2.0 — Redefining Education", max: 132 },
                { src: "/assets/partner-dpiit-dark.png", alt: "DPIIT Startup India recognised", max: 118 },
                { src: "/assets/partner-sdg4-dark.png", alt: "SDG 4 — Quality Education", max: 152 },
              ].map((p) => (
                <span
                  key={p.src}
                  className="flex items-center justify-center rounded-[13px] border border-[#21535B] bg-white/[0.06] px-[14px] py-[11px]"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.max}
                    height={40}
                    className="block h-auto w-full"
                    style={{ maxWidth: p.max }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-[clamp(30px,3.5vw,46px)] flex flex-wrap items-center gap-[14px] border-t border-[#ADD3D8] pt-[22px]">
          <span className="text-[12.5px] text-[#A9C8CC]">
            Copyright {new Date().getFullYear()} by Avadna Services Pvt Ltd. All Rights Reserved.
          </span>
          <span className="ml-auto flex flex-wrap gap-[18px]">
            <Link href="/privacy-policy" className="text-[12.5px] font-semibold text-[#A9C8CC] hover:text-[#5CD3DB]">
              Privacy Policy
            </Link>
            <Link href="/terms-and-rules" className="text-[12.5px] font-semibold text-[#A9C8CC] hover:text-[#5CD3DB]">
              Terms &amp; Conditions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}