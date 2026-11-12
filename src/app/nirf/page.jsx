// src/app/nirf/page.jsx
import FrameworkHero from "@/components/framework/FrameworkHero";
import FrameworkStats from "@/components/framework/FrameworkStats";
import FrameworkSplit from "@/components/framework/FrameworkSplit";
import InsidePlatform from "@/components/framework/InsidePlatform";
import FrameworkAlso from "@/components/framework/FrameworkAlso";
import FrameworkSection from "@/components/sections/ChooseFrameworkSection";
import CommunitySection from "@/components/sections/CommunitySection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import ClientsStrip from "@/components/sections/ClientsStrip";
import AdvisorsScroller from "@/components/school-quality/AdvisorsScrollar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTA from "@/components/sections/FinalCTA";
import { buildWheelSvg } from "@/lib/wheelsvg";

const COLLEGE_CLIENTS = [
  { name: "Father Agnel Group of Schools", img: "/assets/client-father-agnel.png" },
  { name: "Shalom Group of Schools", img: "/assets/client-shalom.png" },
  { name: "Gayatri Group of Schools", img: "/assets/client-gayatri.png" },
  { name: "Holy Child Group of Schools", img: "/assets/client-holy-child.png" },
  { name: "GD Goenka School", img: "/assets/client-gd-goenka.png" },
  { name: "St. Michael's School", img: "/assets/client-st-michaels.png" },
  { name: "Chinmaya Vidyalaya", img: "/assets/client-chinmaya.png" },
  { name: "Evergreen Public School", img: "/assets/client-evergreen.png" },
  { name: "Livingstone Foundation International", img: "/assets/client-livingstone.png" },
  { name: "SMS Academy of Central Education", img: "/assets/client-sms-academy.png" },
  { name: "Indian Language School, Nigeria", img: "/assets/client-indian-language.png" },
  { name: "Al Ain Juniors School, UAE", img: "/assets/client-al-ain.png" },
];

const nirfWheel = buildWheelSvg("NIRF", [
  "Teaching, Learning & Resources",
  "Research & Professional Practice",
  "Graduation Outcomes",
  "Outreach & Inclusivity",
  "Perception",
]);

export default function Page() {
  return (
    <>
      <FrameworkHero
        eyebrow="NIRF Ranking Partner"
        heading="Ranking Preparation,"
        headingHighlight="Supported by Year-Round Data"
        description="National Institutional Ranking Framework. Coordinate parameter-wise information, supporting records and institutional reporting so every figure can be traced to its source."
        image="/assets/group-colleges.png"
        wheel={nirfWheel}
        wheelTitle="Five parameter groups · published weightage"
        ctas={[
          { label: "Book a Demo ↗", href: "/book-a-demo", primary: true },
          { label: "View Portal", href: "https://www.luneblaze.com" },
        ]}
        stats={[
          { value: "100+", label: "Institutions Assisted" },
          { value: "10+", label: "Years of Expertise" },
        ]}
        trust="Trusted by Institutions across India"
      />

      {/* About the NIRF Framework — stats + wheel + bars */}
      <FrameworkStats
        background="#F4F8F8"
        eyebrow="Five parameter groups"
        heading="About the"
        headingHighlight="NIRF Framework"
        description="NIRF ranks institutions on five weighted parameter groups. Because submissions repeat every year, the institutions that do well are the ones collecting the data continuously rather than in the final weeks."
        stats={[
          {
            value: "5",
            label: "Parameter Groups",
            desc: "Each carrying its own published weightage",
          },
          {
            value: "30%",
            label: "Highest Weight",
            desc: "Teaching, Learning & Resources, and Research alike",
          },
          {
            value: "Annual",
            label: "Submission Cycle",
            desc: "Data is required every year, without exception",
          },
          {
            value: "Trend",
            label: "What Moves Rank",
            desc: "Year-on-year movement matters as much as any figure",
          },
        ]}
        wheel={nirfWheel}
        wheelTitle="Five parameter groups · published weightage"
        wheelLegend={[
          { label: "Teaching, Learning & Resources", value: "30%" },
          { label: "Research & Professional Practice", value: "30%" },
          { label: "Graduation Outcomes", value: "20%" },
          { label: "Outreach & Inclusivity", value: "10%" },
          { label: "Perception", value: "10%" },
        ]}
        barsTitle="The five NIRF parameter groups"
        barsSubtitle="Published weightages"
        bars={[
          { label: "Teaching, Learning & Resources", pct: 30 },
          { label: "Research & Professional Practice", pct: 30 },
          { label: "Graduation Outcomes", pct: 20 },
          { label: "Outreach & Inclusivity", pct: 10 },
          { label: "Perception", pct: 10 },
        ]}
      />

      {/* Why NIRF matters */}
      <FrameworkSection
        background="#FFFFFF"
        eyebrow="Why it matters"
        heading="Why NIRF Ranking"
        headingHighlight="Matters"
        description="It is not a form-filling exercise. Done properly, NIRF changes how an institution sees itself — and gives leadership a defensible picture of where it stands."
        cols={4}
        items={[
          {
            title: "Visibility with students",
            desc: "Rank is one of the first things applicants and parents look at when comparing institutions.",
          },
          {
            title: "Data you already hold",
            desc: "Most parameters draw on records the institution keeps anyway — the work is organising them.",
          },
          {
            title: "Gaps found early",
            desc: "Weak parameters surface months before the window, while there is still time to act.",
          },
          {
            title: "Movement over years",
            desc: "Consistent year-on-year improvement tells a stronger story than a single good year.",
          },
        ]}
      />

      {/* NIRF Solution */}
      <FrameworkSplit
        eyebrow="Year-round data"
        heading="Our End-to-End"
        headingHighlight="NIRF Solution"
        description="Parameter data collected continuously through the year, so the submission window is uneventful and every figure is traceable."
        image="/assets/lb-acchome.webp"
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
        tone="white"
        items={[
          { title: "Parameter-Wise Data Collection" },
          { title: "Research & Publication Metrics" },
          { title: "Graduation Outcome Tracking" },
          { title: "Outreach & Inclusivity Records" },
          { title: "Perception Survey Management" },
          { title: "Real-Time Progress Dashboards" },
          { title: "Gap Detection Before Submission" },
          { title: "Year-on-Year Trend Analysis" },
          { title: "Submission Review & Validation" },
          { title: "Expert Advisory & Ranking Support" },
        ]}
      />

      {/* Inside the platform */}
      <InsidePlatform
        eyebrow="Inside the platform"
        heading="What the Luneblaze"
        headingHighlight="NIRF Portal Provides"
        description="Everything the framework asks of you, in one workspace — and everything your team needs to keep it moving between cycles."
        videoSrc="/assets/hero-video.mp4"
        ctaText="View Dashboard ↗"
        ctaHref="https://www.luneblaze.com"
      />

      <FinalCTA
        eyebrow="Your next chapter in quality"
        heading="See Luneblaze in action for your institution."
        body="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />

      {/* Also working towards NAAC / NBA */}
      <FrameworkAlso
        id="s-also-nirf"
        eyebrow="Working towards NAAC or NBA too?"
        heading="The same evidence base"
        headingHighlight="serves every submission."
        description="Explore how Luneblaze supports the other higher-education frameworks your institution may be pursuing."
        tone="light"
        min="300px"
        items={[
          {
            badge: "COLLEGES",
            title: "NAAC",
            sub: "National Assessment and Accreditation Council",
            desc: "Criteria-wise preparation for higher education — IIQA through SSR, DVV and AQAR.",
            logo: "/assets/fw-naac.png",
            cta: "Visit NAAC ↗",
            href: "/naac",
          },
          {
            badge: "COLLEGES",
            title: "NBA",
            sub: "National Board of Accreditation",
            desc: "Outcome-based education with CO-PO mapping, attainment tracking and SAR structure.",
            logo: "/assets/fw-nba.png",
            cta: "Visit NBA ↗",
            href: "/nba",
          },
        ]}
      />

      {/* For college groups */}
      <FrameworkSplit
        eyebrow="For college groups"
        heading="Monitoring Quality Across"
        headingHighlight="Groups of Colleges"
        description="Luneblaze enables universities and college groups to monitor quality across every institution, compare readiness and coordinate improvement from one dashboard."
        image="/assets/group-colleges.png"
        ctaLabel="Explore College Groups ↗"
        ctaHref="/group-of-institutions"
        tone="white"
        items={[
          {
            title: "Monitor Quality on a Single Dashboard",
            desc: "Every institution, criterion and metric in one live view for leadership.",
          },
          {
            title: "Institution Monitoring and Benchmarking",
            desc: "Compare readiness across colleges and see which need support first.",
          },
          {
            title: "Standards Across All Institutions",
            desc: "Shared policies, templates and evidence structures applied consistently.",
          },
          {
            title: "Role-based access",
            desc: "Group management sees the whole network; each college works inside its own space.",
          },
        ]}
      />

      <AdvisorsScroller />
      <TestimonialsSection />

      <CommunitySection
        eyebrow="Community"
        heading="Join the Luneblaze Quality Community"
        description="A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes."
        groupLabel="NIRF"
      />

      <KnowledgeSection />

      <FinalCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your NIRF Journey?"
        body="A 30-minute walkthrough of the dashboard, mapped to where your institution is in the framework right now."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />
    </>
  );
}