// src/components/shared/ClientsStrip.jsx
"use client";

const defaultLogos = [
  { name: "Father Agnel Group of Schools",         img: "/assets/client-father-agnel.png" },
  { name: "Shalom Group of Schools",                img: "/assets/client-shalom.png" },
  { name: "Gayatri Group of Schools",               img: "/assets/client-gayatri.png" },
  { name: "Holy Child Group of Schools",            img: "/assets/client-holy-child.png" },
  { name: "GD Goenka School",                       img: "/assets/client-gd-goenka.png" },
  { name: "St. Michael’s School",                   img: "/assets/client-st-michaels.png" },
  { name: "Chinmaya Vidyalaya",                     img: "/assets/client-chinmaya.png" },
  { name: "Evergreen Public School",                img: "/assets/client-evergreen.png" },
  { name: "Livingstone Foundation International",   img: "/assets/client-livingstone.png" },
  { name: "SMS Academy of Central Education",       img: "/assets/client-sms-academy.png" },
  { name: "Indian Language School, Nigeria",        img: "/assets/client-indian-language.png" },
  { name: "Al Ain Juniors School, UAE",             img: "/assets/client-al-ain.png" },
];

export default function ClientsStrip({
  title = "Our school clients",
  subtitle = "Schools across India, Nigeria & the UAE",
  logos = defaultLogos,
  background = "#ffffff",
}) {
  if (!logos.length) return null;
  const loop = [...logos, ...logos];

  return (
    <section
      aria-label={title}
      className="overflow-hidden border-y border-[#D6E3E5]"
      style={{
        background,
        paddingTop: "clamp(36px,4.2vw,64px)",
        paddingBottom: "clamp(36px,4.2vw,64px)",
      }}
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center">
        {/* left label block */}
        <div className="min-w-[220px] max-w-[300px] flex-[0_1_300px] border-r border-[#E6EEEF] px-[clamp(16px,3vw,32px)] py-[22px]">
          <span className="block text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            Clients
          </span>
          <span className="mt-1.5 block text-[18px] font-extrabold tracking-[-.02em] text-[#152A2E]">
            {title}
          </span>
          <span className="mt-[3px] block text-[13.5px] leading-[1.4] text-[#4C6165]">
            {subtitle}
          </span>
        </div>

        {/* marquee */}
        <div
          className="min-w-0 flex-[1_1_480px] overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
            maskImage:
              "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
          }}
        >
          <div
            className="flex w-max gap-3 py-4"
            style={{ animation: "lfMarq 46s linear infinite" }}
          >
            {loop.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex w-[250px] flex-none items-center gap-2.5 rounded-[10px] border border-[#E1ECEE] bg-white py-2 pl-2 pr-3.5"
              >
                <img
                  src={logo.img}
                  alt={logo.name}
                  className="h-[52px] w-[52px] flex-none rounded-lg bg-white object-contain"
                />
                <span className="text-[13px] font-bold leading-[1.3] text-[#152A2E]">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}