// src/app/nba/page.jsx
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

const nbaWheel = buildWheelSvg("NBA", [
  "Vision, Mission & PEOs",
  "Curriculum & Teaching-Learning",
  "Course & Programme Outcomes",
  "Students' Performance",
  "Faculty Information",
  "Facilities & Technical Support",
  "Continuous Improvement",
  "First Year Academics",
  "Student Support Systems",
  "Governance & Resources",
]);

export default function Page() {
  return (
    <>
      <FrameworkHero
        eyebrow="NBA Accreditation Partner"
        heading="Outcome-Based Education."
        headingHighlight="Evidence That Connects"
        description="National Board of Accreditation. Bring programme outcomes, attainment analysis and accreditation preparation into a structured departmental workflow."
        image="/assets/group-colleges.png"
        wheel={nbaWheel}
        wheelTitle="Self Assessment Report criteria"
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

      {/* About the NBA framework */}
      <FrameworkStats
        background="#F4F8F8"
        eyebrow="Programme accreditation"
        heading="About"
        headingHighlight="NBA Accreditation"
        description="NBA accredits programmes rather than institutions, judging them on Outcome-Based Education. Its Self Assessment Report is organised into criteria covering curriculum, outcomes, faculty, facilities and continuous improvement."
        stats={[
          { value: "OBE", label: "Core Approach", desc: "Outcome-Based Education sits at the centre" },
          { value: "CO-PO", label: "Outcome Mapping", desc: "Course outcomes mapped to programme outcomes" },
          { value: "SAR", label: "Self Assessment", desc: "The report structure the whole submission follows" },
          { value: "Programme", label: "Unit of Accreditation", desc: "Each programme is assessed on its own merits" },
        ]}
        wheel={nbaWheel}
        wheelTitle="Self Assessment Report criteria"
        wheelLegend={[
          { label: "Vision, Mission & PEOs", value: "" },
          { label: "Curriculum & Teaching-Learning", value: "" },
          { label: "Course & Programme Outcomes", value: "" },
          { label: "Students' Performance", value: "" },
          { label: "Faculty Information", value: "" },
          { label: "Facilities & Technical Support", value: "" },
          { label: "Continuous Improvement", value: "" },
          { label: "First Year Academics", value: "" },
          { label: "Student Support Systems", value: "" },
          { label: "Governance & Resources", value: "" },
        ]}
        barsTitle="The SAR criteria"
        barsSubtitle="Indicative weightage · UG programmes"
        bars={[
          { label: "Vision, Mission & PEOs", pct: 10 },
          { label: "Curriculum & Teaching-Learning", pct: 20 },
          { label: "Course & Programme Outcomes", pct: 20 },
          { label: "Students' Performance", pct: 15 },
          { label: "Faculty Information", pct: 10 },
          { label: "Facilities & Technical Support", pct: 10 },
          { label: "Continuous Improvement", pct: 15 },
        ]}
      />

      {/* Why NBA matters */}
      <FrameworkSection
        background="#FFFFFF"
        eyebrow="Why it matters"
        heading="Why NBA Accreditation"
        headingHighlight="Matters"
        description="It is not a form-filling exercise. Done properly, NBA changes how an institution sees itself — and gives leadership a defensible picture of where it stands."
        cols={4}
        items={[
          { title: "Graduate mobility", desc: "Accredited programmes carry weight with employers, and with universities abroad." },
          { title: "Evidence of outcomes", desc: "Attainment data shows what graduates can actually do, not just what was taught." },
          { title: "Curriculum feedback loop", desc: "Gaps in attainment point directly at the parts of the curriculum that need work." },
          { title: "Departmental clarity", desc: "Each programme sees its own position, so improvement is owned at department level." },
        ]}
      />

      {/* NBA Solution */}
      <FrameworkSplit
        eyebrow="Mapping to attainment"
        heading="Our End-to-End"
        headingHighlight="NBA Solution"
        description="Everything an outcome-based submission asks for, from mapping through to attainment evidence and continuous improvement."
        image="/assets/lb-acchome.webp"
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
        tone="white"
        items={[
          { title: "CO-PO Mapping & Matrices" },
          { title: "Attainment Calculation & Analysis" },
          { title: "SAR Structuring & Filing Support" },
          { title: "Documentation & Evidence Management" },
          { title: "Faculty & Programme Records" },
          { title: "Real-Time Progress Monitoring" },
          { title: "Corrective & Preventive Action Tracking" },
          { title: "Mock Audits & Readiness Assessment" },
          { title: "Continuous Improvement Tracking" },
          { title: "Expert Advisory & Accreditation Support" },
        ]}
      />

      {/* Inside the platform */}
      <InsidePlatform
        eyebrow="Inside the platform"
        heading="What the Luneblaze"
        headingHighlight="NBA Portal Provides"
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

      {/* Also working towards NAAC / NIRF */}
      <FrameworkAlso
        id="s-also-nba"
        eyebrow="Working towards NAAC or NIRF too?"
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
            title: "NIRF",
            sub: "National Institutional Ranking Framework",
            desc: "Ranking parameters tracked year on year, using data your institution already holds.",
            logo: "/assets/fw-nirf.png",
            cta: "Visit NIRF ↗",
            href: "/nirf",
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
          { title: "Monitor Quality on a Single Dashboard", desc: "Every institution, criterion and metric in one live view for leadership." },
          { title: "Institution Monitoring and Benchmarking", desc: "Compare readiness across colleges and see which need support first." },
          { title: "Standards Across All Institutions", desc: "Shared policies, templates and evidence structures applied consistently." },
          { title: "Role-based access", desc: "Group management sees the whole network; each college works inside its own space." },
        ]}
      />

      <AdvisorsScroller />
      <TestimonialsSection />

      <CommunitySection
        eyebrow="Community"
        heading="Join the Luneblaze Quality Community"
        description="A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes."
        groupLabel="NBA"
      />

      <KnowledgeSection />

      <FinalCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your NBA Journey?"
        body="A 30-minute walkthrough of the dashboard, mapped to where your institution is in the framework right now."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />
    </>
  );
}