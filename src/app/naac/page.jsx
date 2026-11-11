// src/app/naac/page.jsx
import FrameworkHero from "@/components/framework/FrameworkHero";
import FrameworkStats from "@/components/framework/FrameworkStats";
import FrameworkSplit from "@/components/framework/FrameworkSplit";
import FrameworkBeyond from "@/components/framework/FrameworkBeyond";
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
  {
    name: "Father Agnel Group of Schools",
    img: "/assets/client-father-agnel.png",
  },
  { name: "Shalom Group of Schools", img: "/assets/client-shalom.png" },
  { name: "Gayatri Group of Schools", img: "/assets/client-gayatri.png" },
  { name: "Holy Child Group of Schools", img: "/assets/client-holy-child.png" },
  { name: "GD Goenka School", img: "/assets/client-gd-goenka.png" },
  { name: "St. Michael's School", img: "/assets/client-st-michaels.png" },
  { name: "Chinmaya Vidyalaya", img: "/assets/client-chinmaya.png" },
  { name: "Evergreen Public School", img: "/assets/client-evergreen.png" },
  {
    name: "Livingstone Foundation International",
    img: "/assets/client-livingstone.png",
  },
  {
    name: "SMS Academy of Central Education",
    img: "/assets/client-sms-academy.png",
  },
  {
    name: "Indian Language School, Nigeria",
    img: "/assets/client-indian-language.png",
  },
  { name: "Al Ain Juniors School, UAE", img: "/assets/client-al-ain.png" },
];

const naacWheel = buildWheelSvg("NAAC", [
  "Curriculum",
  "Faculty",
  "Infrastructure",
  "Finances",
  "Learning and Teaching",
  "Extended Curricular Engagements",
  "Management",
  "Student Outcomes",
  "Research and Innovation Outcomes",
  "Sustainability Outcomes",
]);

export default function Page() {
  return (
    <>
      <FrameworkHero
        eyebrow="NAAC Preparation Partner"
        heading="Your NAAC Journey."
        headingHighlight="One Coordinated Quality System"
        description="National Assessment and Accreditation Council. Connect documentation, IQAC workflows, audits, filing support and faculty training with expert guidance for your institution's NAAC preparation."
        image="/assets/group-colleges.png"
        wheel={naacWheel}
        wheelTitle="Binary accreditation parameters"
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

      {/* About the NAAC Framework */}
      <FrameworkStats
        eyebrow="Seven criteria"
        heading="About the"
        headingHighlight="NAAC Framework"
        description="NAAC assesses higher education institutions across seven criteria, each broken into key indicators and quantitative or qualitative metrics. Grades run to A++ on a four-point CGPA scale."
        stats={[
          {
            value: "7",
            label: "Criteria",
            desc: "Each mapped to its key indicators and metrics",
          },
          {
            value: "4.00",
            label: "Maximum CGPA",
            desc: "Scored on a four-point scale",
          },
          {
            value: "A++",
            label: "Highest Grade",
            desc: "The top band in the NAAC grading scale",
          },
          {
            value: "5",
            label: "Years Validity",
            desc: "Accreditation runs for a five-year cycle",
          },
        ]}
        wheel={naacWheel}
        wheelTitle="Binary accreditation parameters"
        wheelLegend={[
          { label: "Curriculum", value: "" },
          { label: "Faculty", value: "" },
          { label: "Infrastructure", value: "" },
          { label: "Finances", value: "" },
          { label: "Learning and Teaching", value: "" },
          { label: "Extended Curricular Engagements", value: "" },
          { label: "Management", value: "" },
          { label: "Student Outcomes", value: "" },
          { label: "Research and Innovation Outcomes", value: "" },
          { label: "Sustainability Outcomes", value: "" },
        ]}
        barsTitle="The seven NAAC criteria"
        barsSubtitle="Indicative weightage · affiliated UG colleges"
        bars={[
          { label: "Curricular Aspects", pct: 10 },
          { label: "Teaching-Learning & Evaluation", pct: 35 },
          { label: "Research, Innovations & Extension", pct: 11 },
          { label: "Infrastructure & Learning Resources", pct: 10 },
          { label: "Student Support & Progression", pct: 14 },
          { label: "Governance, Leadership & Management", pct: 10 },
          { label: "Institutional Values & Best Practices", pct: 10 },
        ]}
        background="#FFFFFF"
      />

      {/* What's new — Binary Accreditation */}
      <FrameworkSection
        background="#F4F8F8"
        eyebrow="What's new"
        heading="The New Binary"
        headingHighlight="Accreditation System"
        description="NAAC is rolling out a Binary Accreditation System — a move to simplify and digitise the whole process for colleges and universities."
        cols={5}
        items={[
          {
            title: "Accredited or Not Accredited",
            desc: "No more complex grades",
          },
          {
            title: "Fully Online Process",
            desc: "No on-site visits",
          },
          {
            title: "Faster Cycle",
            desc: "Accreditation every 3 years instead of 5",
          },
          {
            title: "Maturity-Based Levels 1–5",
            desc: "Institutions grow progressively",
          },
          {
            title: "95%+ Coverage Target",
            desc: "Across higher education institutions",
          },
        ]}
      />

      {/* Why NAAC matters */}
      <FrameworkSection
        background="#FFFFFF"
        eyebrow="Why it matters"
        heading="Why NAAC Accreditation"
        headingHighlight="Matters"
        description="It is not a form-filling exercise. Done properly, NAAC changes how an institution sees itself — and gives leadership a defensible picture of where it stands."
        cols={4}
        items={[
          {
            title: "Eligibility and funding",
            desc: "Accreditation status governs autonomy, UGC schemes and a range of funding routes.",
          },
          {
            title: "Metric-linked evidence",
            desc: "Every claim is tied to the metric it answers, so DVV clarifications are straightforward.",
          },
          {
            title: "Institutional clarity",
            desc: "Criteria-wise scoring shows leadership precisely where the institution is strong and where it is not.",
          },
          {
            title: "A repeatable cycle",
            desc: "AQAR reporting becomes continuous rather than a once-in-five-years effort.",
          },
        ]}
      />

      {/* NAAC Solution — the ten deliverables */}
      <FrameworkSplit
        eyebrow="Built for the Binary Accreditation System"
        heading="Our End-to-End"
        headingHighlight="NAAC Solution"
        description="An AI-powered solution covering every part of the NAAC journey."
        image="/assets/lb-acchome.webp"
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
        tone="white"
        items={[
          { title: "Document & Evidence Creation" },
          { title: "Workflow and IQAC Management" },
          { title: "NAAC Filing & DVV Query Handling" },
          { title: "Regular IQAC Trainings" },
          { title: "SSR & AQAR Automation" },
          { title: "Real Time Quality Monitoring" },
          { title: "Progress Dashboards" },
          { title: "24×7 Expert Support" },
          { title: "Mock Audits" },
        ]}
      />

      {/* Inside the platform */}
      <InsidePlatform
        eyebrow="Inside the platform"
        heading="What the Luneblaze"
        headingHighlight="NAAC Portal Provides"
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

      {/* Also working towards NBA / NIRF */}
      <FrameworkAlso
        id="s-also-naac"
        eyebrow="Working towards NBA or NIRF too?"
        heading="The same evidence base"
        headingHighlight="serves every submission."
        description="Explore how Luneblaze supports the other higher-education frameworks your institution may be pursuing."
        tone="light"
        min="300px"
        items={[
          {
            badge: "COLLEGES",
            title: "NBA",
            sub: "National Board of Accreditation",
            desc: "Outcome-based education with CO-PO mapping, attainment tracking and SAR structure.",
            logo: "/assets/fw-nba.png",
            cta: "Visit NBA ↗",
            href: "/nba",
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
        groupLabel="NAAC"
      />

      <KnowledgeSection />

      <ClientsStrip
        title="Our clients"
        subtitle="Institutions across India, Nigeria & the UAE"
        logos={COLLEGE_CLIENTS}
      />

      <FinalCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your NAAC Journey?"
        body="A 30-minute walkthrough of the dashboard, mapped to where your institution is in the framework right now."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />
    </>
  );
}