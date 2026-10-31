const LOGOS = [
  { name: "Fr. Agnel Group of Schools", img: "/assets/logo-agnel.webp" },
  { name: "GD Goenka School", img: "/assets/logo-goenka.webp" },
  { name: "Livingstone Foundation Intl. School", img: "/assets/logo-livingstone.webp" },
  { name: "Evergreen Public School", img: "/assets/logo-evergreen.webp" },
  { name: "Howard Convent School", img: "/assets/logo-howard.webp" },
  { name: "Prince Public School", img: "/assets/logo-prince.webp" },
  { name: "Panbai International School", img: "/assets/logo-panbai.webp" },
  { name: "Dolphin School", img: "/assets/logo-dolphin.png" },
  { name: "Sankara Vidyalaya", img: "/assets/logo-sankara.png" },
  { name: "Zydus School", img: "/assets/logo-zydus.png" },
  { name: "Emerald Heights", img: "/assets/logo-emerald.png" },
  { name: "Taurian World School", img: "/assets/logo-taurian.png" },
];

export default function TrustedInstitutions() {
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section
      id="trusted"
      className="overflow-hidden border-b border-[#D6E3E5] bg-white py-12 md:py-14"
    >
      <div
        className="lf-trust relative mx-auto grid max-w-[1280px] items-stretch"
        style={{ gridTemplateColumns: "minmax(220px,300px) minmax(0,1fr)" }}
      >
        {/* Left block */}
        <div className="flex min-w-0 shrink-0 items-center gap-[14px] border-r border-[#E6EEEF] px-[clamp(16px,3vw,32px)] py-[22px]">
          <span className="block text-[clamp(40px,4.4vw,56px)] font-extrabold leading-none tracking-[-.04em] text-[#17AEB9]">
            100+
          </span>
          <span className="block text-[13.5px] leading-[1.4] text-[#4C6165]">
            <b className="block text-[15px] leading-[1.3] text-[#152A2E]">
              Institutions trust us
            </b>
            across India &amp; internationally
          </span>
        </div>

        {/* Right block — marquee */}
        <div
          className="min-w-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
        >
          <div
            className="flex w-max gap-3 py-4 will-change-transform"
            style={{ animation: "lfMarq 46s linear infinite" }}
          >
            {loop.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex h-[62px] w-[230px] flex-none items-center gap-[10px] rounded-[10px] border border-[#E1ECEE] bg-white py-2 pl-2 pr-[14px]"
              >
                <div
                  role="img"
                  aria-label={logo.name}
                  className="h-[46px] w-[46px] flex-none rounded-lg border border-[#EEF3F4] bg-white bg-[length:80%] bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${logo.img}')` }}
                />
                <span className="text-[13.5px] font-bold leading-[1.3] text-[#152A2E]">
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