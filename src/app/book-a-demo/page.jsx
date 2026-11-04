import BookingForm from "@/components/book/BookingForm";

export const metadata = {
  title: "Book a Demo | Luneblaze",
  description:
    "An AI-powered platform to simplify SQAAF implementation, streamline documentation, track readiness and build a culture of continuous improvement.",
};

export default function BookDemoPage() {
  return (
    <>
      {/* Form / Hero Section */}
      <section
        id="form"
        className="relative overflow-hidden bg-[#FCFDFD] pt-[clamp(96px,6vw,120px)] pr-[clamp(20px,4vw,52px)] pb-[clamp(40px,5vw,72px)] pl-[clamp(20px,4vw,52px)] "
      >
        <div className="relative mx-auto max-w-[1100px]">
          <BookingForm />
        </div>
      </section>

      {/* About Luneblaze */}
      <section
        id="about-lb"
        className="relative overflow-hidden  bg-[#EDF7F8] py-[clamp(48px,5vw,80px)] pr-[clamp(20px,4vw,52px)] pl-[clamp(20px,4vw,52px)] [border-radius:clamp(28px,3vw,48px)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 animate-[lbGridPan_42s_linear_infinite] bg-[radial-gradient(circle,rgba(23,174,185,.18)_1.1px,transparent_1.1px)] bg-[length:28px_28px] opacity-[0.34]" />
        </div>
        <div className="relative mx-auto max-w-[1320px]">
          {/* Heading — centered */}
          <div data-reveal className="mx-auto max-w-[850px] text-center">
            <h2 className="m-0 text-[clamp(28px,3.4vw,44px)] leading-[1.09] font-extrabold tracking-[-0.032em] text-[#152A2E]">
              About Luneblaze
            </h2>
            <p className="mt-[16px] mb-0 text-[clamp(15px,1.15vw,17.5px)] leading-[1.67] text-[#5F7175]">
              Luneblaze is an AI-powered quality and accreditation management
              platform for schools, colleges and institution groups. Built by
              Avadna Services Pvt Ltd, we have worked with educational
              institutions on quality and accreditation since 2017.
            </p>
          </div>

          <div
            data-solgrid
            data-cols="3"
            className="mt-[clamp(28px,3.2vw,44px)] grid grid-cols-1 gap-[clamp(12px,1.4vw,18px)] md:grid-cols-3"
          >
            {[
              {
                n: "01",
                t: "One quality ecosystem",
                d: "Assessment, documentation, evidence, audits, reporting and improvement in a single workspace rather than scattered across spreadsheets.",
              },
              {
                n: "02",
                t: "Built on framework reality",
                d: "Every module maps to how assessors, IQAC teams and school leadership actually work through a cycle.",
              },
              {
                n: "03",
                t: "Improvement that compounds",
                d: "What an institution learns in one cycle feeds the next, so maturity moves forward instead of resetting.",
              },
            ].map((item, i) => (
              <div
                key={i}
                data-reveal
                data-delay={i * 60}
                className="flex flex-col gap-3.5 rounded-[22px] border border-[#E4EEEF] bg-white p-[24px_22px] transition-[transform,border-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] hover:-translate-y-[5px] hover:border-[#17AEB9] hover:shadow-[0_22px_44px_-28px_rgba(15,60,66,.45)]"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-[#E4F5F6] text-[13.5px] font-extrabold text-[#17AEB9] shadow-[0_0_0_7px_#E4F5F666]"
                >
                  {item.n}
                </span>
                <div>
                  <h3
                    data-soltext
                    className="m-0 text-[16.5px] font-extrabold tracking-[-0.016em] text-[#152A2E]"
                  >
                    {item.t}
                  </h3>
                  <p className="mt-[8px] mb-0 text-[14px] leading-[1.62] text-[#5F7175]">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Luneblaze Helps */}
      <section
        id="how-quality"
        className="relative overflow-hidden bg-[#FCFDFD] py-[clamp(48px,5vw,80px)] pr-[clamp(20px,4vw,52px)] pl-[clamp(20px,4vw,52px)] [border-radius:clamp(28px,3vw,48px)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 animate-[lbGridPan_42s_linear_infinite] bg-[radial-gradient(circle,rgba(23,174,185,.18)_1.1px,transparent_1.1px)] bg-[length:28px_28px] opacity-[0.34]" />
        </div>
        <div className="relative mx-auto max-w-[1320px]">
          {/* Heading — centered */}
          <div data-reveal className="mx-auto max-w-[850px] text-center">
            <h2 className="m-0 text-[clamp(28px,3.4vw,44px)] leading-[1.09] font-extrabold tracking-[-0.032em] text-[#152A2E]">
              How Luneblaze Helps Institutional Quality
            </h2>
            <p className="mt-[16px] mb-0 text-[clamp(15px,1.15vw,17.5px)] leading-[1.67] text-[#5F7175]">
              Quality work fails when it lives in one person&rsquo;s head. The
              platform turns it into a system the institution keeps.
            </p>
          </div>

          <div
            data-solgrid
            data-cols="3"
            className="mt-[clamp(28px,3.2vw,44px)] grid grid-cols-1 gap-[clamp(12px,1.4vw,18px)] md:grid-cols-3"
          >
            {[
              {
                n: "01",
                t: "An honest baseline",
                d: "Score every standard and see exactly where the institution stands, indicator by indicator.",
              },
              {
                n: "02",
                t: "Evidence that holds up",
                d: "Documents linked to the standard they answer, versioned, and ready before a review begins.",
              },
              {
                n: "03",
                t: "Shared ownership",
                d: "Domains owned by named people, so quality stops sitting with one overloaded coordinator.",
              },
              {
                n: "04",
                t: "Gaps found early",
                d: "Weak areas surface months before a deadline, while there is still time to act.",
              },
              {
                n: "05",
                t: "Leadership visibility",
                d: "Readiness, maturity and risk on one dashboard, at institution or group level.",
              },
              {
                n: "06",
                t: "Audit readiness",
                d: "Internal, external and surprise cycles with reviewer notes and corrective actions tracked.",
              },
            ].map((item, i) => (
              <div
                key={i}
                data-reveal
                data-delay={i * 60}
                className="flex flex-col gap-3.5 rounded-[22px] border border-[#E4EEEF] bg-white p-[24px_22px] transition-[transform,border-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] hover:-translate-y-[5px] hover:border-[#0E8B95] hover:shadow-[0_22px_44px_-28px_rgba(15,60,66,.45)]"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-[#E4F5F6] text-[13.5px] font-extrabold text-[#0E8B95] shadow-[0_0_0_7px_#E4F5F666]"
                >
                  {item.n}
                </span>
                <div>
                  <h3
                    data-soltext
                    className="m-0 text-[16.5px] font-extrabold tracking-[-0.016em] text-[#152A2E]"
                  >
                    {item.t}
                  </h3>
                  <p className="mt-[8px] mb-0 text-[14px] leading-[1.62] text-[#5F7175]">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}