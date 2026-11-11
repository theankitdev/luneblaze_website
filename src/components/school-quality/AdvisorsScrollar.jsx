import Link from "next/link";

const advisors = [
  { name: "Ms. Kalyani Dixit",         role: "Former Founder · Principal and Director",                              img: "/assets/advisor-1.png" },
  { name: "Ms. Mini Johny",            role: "Master Trainer – CBSE · District Coordinator for Training CoE Bengaluru", img: "/assets/advisor-2.png" },
  { name: "Dr. Kshma Swarnkar",        role: "CBSE Resource Person · AI & Edtech Expert",                            img: "/assets/advisor-3.png" },
  { name: "Ms. Archana Awade",         role: "General Manager – Aditya Birla Education Academy",                     img: "/assets/advisor-4.png" },
  { name: "Ms. Sumithra Singh",        role: "Academic Consultant & Teacher Trainer",                               img: "/assets/advisor-5.png" },
  { name: "Mr. Naresh Sharma",         role: "CBSE Resource Person · UNESCO Health and Wellness Master Trainer",     img: "/assets/advisor-6.png" },
  { name: "Ms. Manjit Malik",          role: "Academic Auditor · Education & School Quality Consultant",             img: "/assets/advisor-7.png" },
  { name: "Dr. Rakhee Chaudhary",      role: "Accreditation & Quality Assurance Expert",                             img: "/assets/advisor-8.png" },
  { name: "Mr. Narender Kumar",        role: "CBSE Master Trainer & Lead Facilitator",                              img: "/assets/advisor-9.png" },
  { name: "Dr. Deepti Chaturvedi",     role: "CBSE Resource Person · Founder Principal",                            img: "/assets/advisor-10.png" },
  { name: "Dr. Abhishek Sharma",       role: "Advanced Lean Six Sigma Certified Trainer",                           img: "/assets/advisor-11.png" },
  { name: "Dr. Manjari Tejpal",        role: "CBSE Resource Person & SQAAF Trainer",                                 img: "/assets/advisor-12.png" },
  { name: "Mr. Jeeson Sunny",          role: "CBSE SQAAF – PAT Member",                                             img: "/assets/advisor-13.png" },
  { name: "Ms. Mohita Jain",           role: "CBSE Resource Person · Career and Guidance Counsellor",                img: "/assets/advisor-14.png" },
  { name: "Dr. Jyoti Prakash Tripathy", role: "CBSE Resource Person, District Coordinator",                         img: "/assets/advisor-15.png" },
  { name: "Dr. Bani Godara",           role: "CBSE School Principal · CBSE Manual Reviewer",                        img: "/assets/advisor-16.png" },
];

export default function AdvisorsScroller() {
  return (
    <section className="relative overflow-hidden border-b border-[#D6E3E5] bg-[#F4F8F8] px-5 py-16 sm:px-8 lg:py-20">
      {/* decorative bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(91,91,214,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 44s linear infinite reverse",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-24%",
            left: "2%",
            width: "min(440px,46vw)",
            height: "min(440px,46vw)",
            animation: "lbSpinRev 108s linear infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-[rgba(91,91,214,.16)]" />
          <div className="absolute inset-[26%] rounded-full border border-dashed border-[rgba(91,91,214,.14)]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BEE2E6] bg-[rgba(223,241,243,.9)] px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.16em] text-[#0E7A83]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#17AEB9]"
              style={{ animation: "lbPulse 2.4s ease-in-out infinite" }}
            />
            Guided by our advisors
          </span>
          <h2 className="mx-auto mt-3  text-3xl font-extrabold leading-tight tracking-tight text-[#152A2E] sm:text-4xl lg:text-5xl">
            Guided by Experience.{" "}
            <span className="text-[#17AEB9]">Strengthened by Expertise.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-[#4C6165]">
            A collective of 50+ education leaders, quality experts and
            practitioners across the globe.
          </p>
        </div>

        {/* horizontal rail */}
        <div
          className="lf-rail mt-10 grid gap-4 overflow-x-auto pb-1.5 sm:mt-12"
          style={{
            gridAutoFlow: "column",
            gridAutoColumns: "clamp(210px,20vw,240px)",
            scrollSnapType: "x mandatory",
          }}
        >
          {advisors.map((a) => (
            <div
              key={a.name}
              className="border border-[#C9D9DC] bg-white"
              style={{ scrollSnapAlign: "start" }}
            >
              <div
                role="img"
                aria-label={a.name}
                className="border-b-[3px] border-[#17AEB9] bg-[#EDF7F8] bg-cover bg-top"
                style={{
                  aspectRatio: "1",
                  backgroundImage: `url('${a.img}')`,
                }}
              />
              <div className="px-4 pb-[18px] pt-3.5">
                <div className="text-[15.5px] font-extrabold text-[#152A2E]">
                  {a.name}
                </div>
                <div className="mt-1 text-[13px] leading-[1.45] text-[#4C6165]">
                  {a.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 text-center sm:mt-6">
          <Link
            href="/advisors"
            className="inline-block rounded-[10px] border border-[#152A2E] px-6 py-[13px] text-[15px] font-bold text-[#152A2E] transition-colors hover:bg-[#152A2E] hover:text-white"
          >
            Meet All Advisors ↗
          </Link>
        </div>
      </div>
    </section>
  );
}