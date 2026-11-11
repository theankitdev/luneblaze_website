// src/app/sqaaf/page.jsx
import FrameworkHero from "@/components/framework/FrameworkHero";
import FrameworkTimeline from "@/components/framework/FrameworkTimeline";
import FrameworkStats from "@/components/framework/FrameworkStats";
import FrameworkFilm from "@/components/framework/FrameworkFilm";
import FrameworkSplit from "@/components/framework/FrameworkSplit";
import FrameworkPillars from "@/components/framework/FrameworkPillars";
import InsidePlatform from "@/components/framework/InsidePlatform";
import FrameworkAlso from "@/components/framework/FrameworkAlso";
import FrameworkSection from "@/components/sections/ChooseFrameworkSection";
import CommunitySection from "@/components/sections/CommunitySection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import ClientsStrip from "@/components/sections/ClientsStrip";
import AdvisorsScroller from "@/components/school-quality/AdvisorsScrollar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTA from "@/components/sections/FinalCTA";


const SCHOOL_CLIENTS = [
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

export default function Page() {
  return (
    <>
      <FrameworkHero
        eyebrow="SQAAF Implementation Partner"
        heading="Build Lasting School Quality"
        headingHighlight="with SQAAF"
        description="School Quality Assessment and Assurance Framework. Bring documents, evidence, team workflows, audits and expert guidance together in one AI-enabled SQAAF implementation solution."
        ctas={[
          { label: "Book a Demo ↗", href: "/book-a-demo", primary: true },
          { label: "View Portal", href: "https://www.luneblaze.com" },
        ]}
        stats={[
          { value: "100+", label: "Schools Assisted" },
          { value: "10+", label: "Years of Expertise" },
        ]}
        trust="Trusted by Schools across India"
        ring="film/clip.html?s=Domains&d=7.6&hold=4&cx=1290&cy=560&cw=1140&ch=920&clipx=720&bg=none"
      />

      <FrameworkStats
        eyebrow="CBSE framework"
        heading="About the"
        headingHighlight="SQAAF Framework"
        description="SQAAF is CBSE's School Quality Assessment and Assurance Framework — a structured way for schools to assess institutional practices, identify improvement areas and strengthen quality across seven key domains."
        stats={[
          {
            value: "7",
            label: "Domains",
            desc: "Broad areas of school functioning",
          },
          {
            value: "49",
            label: "Sub-Domains",
            desc: "Specify what each domain contains",
          },
          {
            value: "84",
            label: "Standards",
            desc: "Define and qualify quality",
          },
          {
            value: "5",
            label: "Maturity Levels",
            desc: "From emerging to exemplary",
          },
        ]}
        wheelRing="film/clip.html?s=Domains&d=7.6&hold=4&cx=1290&cy=560&cw=1140&ch=920&clipx=720&bg=none"
        wheelTitle="Seven SQAAF domains · weightage"
        wheelLegend={[
          { label: "Curriculum, Pedagogy & Assessment", value: "40%" },
          { label: "Infrastructure", value: "10%" },
          { label: "Human Resources", value: "10%" },
          { label: "Inclusive Practices", value: "10%" },
          { label: "Management & Governance", value: "10%" },
          { label: "Leadership", value: "10%" },
          { label: "Beneficiary Satisfaction", value: "10%" },
        ]}
      />

      <FrameworkFilm
        eyebrow="Why it matters"
        heading="Why"
        headingHighlight="SQAAF"
        description="Long-term institutions are built on strong quality systems. SQAAF gives schools a structured way to assess practices, find improvement areas and make quality measurable — not just documented."
        note="SQAAF isn't an annual documentation exercise. It should become part of how a school operates, evaluates itself and improves."
        film="film/clip.html?s=Stakes&d=10&hold=2"
      />

      <FrameworkTimeline
        eyebrow="Eight stages, every year"
        heading="The SQAAF"
        headingHighlight="Timeline"
        description="Eight stages from onboarding to grade, then repeating annually. Luneblaze carries your school through every one."
        items={[
          {
            badge: "STAGE 01",
            title: "Registration & Setup",
            desc: "School onboarded, CLT and focus groups formed, domain ownership assigned.",
          },
          {
            badge: "STAGE 02",
            title: "Self-Assessment",
            desc: "All 84 standards scored across seven domains for a baseline readiness.",
          },
          {
            badge: "STAGE 03",
            title: "Documentation",
            desc: "Policies, SOPs and plans built against every standard in the framework.",
          },
          {
            badge: "STAGE 04",
            title: "Evidence Collection",
            desc: "Objective evidence tagged domain-wise and verified against its standard.",
          },
          {
            badge: "STAGE 05",
            title: "Mock Audit",
            desc: "Internal review and inspection readiness check, with gaps recorded.",
          },
          {
            badge: "STAGE 06",
            title: "Filing & SIP",
            desc: "Self-assessment filed on the portal and the Improvement Plan generated.",
          },
          {
            badge: "STAGE 07",
            title: "Onsite Inspection",
            desc: "External inspection leading to a grade from A+ through to C.",
          },
          {
            badge: "STAGE 08",
            title: "Annual Cycle",
            desc: "Self-assessment repeats yearly with continuous compliance monitoring.",
          },
        ]}
      />

      <FrameworkSection
        background="#FFFFFF"
        eyebrow="Across all seven domains"
        heading="Drive"
        headingHighlight="School Quality"
        items={[
          {
            title: "AI-Powered Quality Systems",
            desc: "Structured workflows, smart checklists and AI assistance across every SQAAF domain.",
          },
          {
            title: "Measurable Progress",
            desc: "Domain-wise readiness scores show exactly where your school stands — and what to do next.",
          },
          {
            title: "Continuous Improvement",
            desc: "Year-round monitoring replaces last-minute preparation with a sustained quality culture.",
          },
        ]}
      />

      <FrameworkSection
        eyebrow="The core problem"
        heading="The Challenges"
        headingHighlight="Schools Face"
        items={[
          {
            title: "Manual & Paper-Based Processes",
            desc: "Traditional documentation makes tracking, updating and retrieving records slow and inefficient.",
          },
          {
            title: "Disorganized Documentation & Evidence",
            desc: "Scattered records and unstructured evidence make inspections stressful and hard to manage.",
          },
          {
            title: "Faculty Workload & Time Constraints",
            desc: "Significant faculty hours go into meetings and maintaining compliance records.",
          },
          {
            title: "Unclear Progress & Accountability",
            desc: "Without real-time monitoring it's hard to measure readiness or hold stakeholders accountable.",
          },
          {
            title: "Last-Minute Inspection Preparation",
            desc: "Keeping staff prepared for inspections remains a constant challenge.",
          },
          {
            title: "Continuous Training Requirement",
            desc: "SQAAF implementation needs ongoing faculty training and regular handholding.",
          },
        ]}
      />

      <FrameworkSplit
        eyebrow="Built for more than compliance"
        heading="The Luneblaze"
        headingHighlight="Solution"
        description="One structured system for every quality requirement. Luneblaze brings technology, expert guidance and institutional processes together so schools implement SQAAF systematically — and keep improving."
        note="Measure quality. Strengthen systems. Improve continuously."
        image="/assets/lb-SQAAF.webp"
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo.html"
        decorative // enables the grid + ring background
        tone="light"
        items={[
          {
            title: "Centralized Documentation & Evidence",
            desc: "Organize documents, policies, records and evidence in one structured digital environment.",
          },
          {
            title: "Real-Time Progress Tracking",
            desc: "Monitor progress across every domain, spot gaps early and keep improvement on track.",
          },
          {
            title: "Clear Ownership & Accountability",
            desc: "Assign responsibilities and track tasks, evidence submissions and completion status.",
          },
          {
            title: "Continuous Inspection Readiness",
            desc: "Stay ready throughout the year instead of relying on last-minute preparation.",
          },
          {
            title: "Standardized Quality Processes",
            desc: "Repeatable workflows, documented procedures and consistent practices across departments and campuses.",
          },
        ]}
      />

      <FrameworkPillars
        eyebrow="Building the quality muscle"
        heading="The Luneblaze"
        headingHighlight="Quality Ecosystem"
        description="An AI-powered, end-to-end accreditation and quality management platform that combines digital infrastructure, expert assistance and performance intelligence."
        film="film/clip.html?s=Pillars&d=15.6"
        pillars={[
          {
            badge: "PILLAR 01",
            title: "Quality Systems",
            desc: "The infrastructure that makes quality repeatable.",
            list: [
              "Document & Evidence Management",
              "Workflow & Core Learning Team Management",
              "SQAAF Implementation, Compliance & Portal Filing",
              "Standardized Policies, SOPs & Quality Frameworks",
            ],
          },
          {
            badge: "PILLAR 02",
            title: "Quality Excellence",
            desc: "Expertise that strengthens everyday practice.",
            list: [
              "24×7 Expert Assistance",
              "Mock Audits & Readiness Assessments",
              "Classroom Observations & Teaching Assessments",
              "Trainings & Capacity Building",
            ],
          },
          {
            badge: "PILLAR 03",
            title: "Quality Governance",
            desc: "Visibility that turns data into decisions.",
            list: [
              "AI-Powered Quality Dashboard",
              "Continuous Monitoring with Readiness Score™",
              "School Rankings & Group Benchmarking",
              "Performance Analytics & Executive Reports",
            ],
          },
        ]}
      />

      <InsidePlatform
        eyebrow="Inside the platform"
        heading="What the Luneblaze"
        headingHighlight="Platform Provides"
        description="Everything the framework asks of you, in one workspace — and everything your team needs to keep it moving between cycles."
        videoSrc="assets/hero-video.mp4"
        ctaText="View Dashboard ↗"
        ctaHref="https://www.luneblaze.com"
      />

      <FinalCTA
        eyebrow="Your next chapter in quality"
        heading="See Luneblaze in action for your school."
        body="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />

      <FrameworkAlso
        id="s-also-nabet"
        eyebrow="Also working towards NABET?"
        heading="The same evidence base"
        headingHighlight="serves both submissions."
        description="Explore how Luneblaze supports NABET accreditation alongside your SQAAF cycle."
        tone="light"
        min="300px"
        items={[
          {
            badge: "SCHOOLS",
            title: "NABET",
            sub: "National Accreditation Board for Education and Training",
            desc: "Accreditation readiness for schools, with criteria-mapped documentation and audit trails.",
            logo: "/assets/fw-nabet.png",
            cta: "Visit NABET ↗",
            href: "/nabet.html",
          },
        ]}
      />

      <FrameworkSplit
        eyebrow="For school groups"
        heading="Monitoring Quality of Group"
        headingHighlight="Across Groups of Schools"
        description="Luneblaze enables school groups and franchise networks to monitor quality across every campus, compare performance and coordinate improvement from one dashboard."
        image="/assets/group-schools.png"
        ctaLabel="Explore School Groups ↗"
        ctaHref="/group-of-institutions.html"
        tone="white" // this section is #fff on the SQAAF page
        decorative // optional — the source alternates d0/d1 per section index
        items={[
          {
            title: "Monitor Quality on a Single Dashboard",
            desc: "Every campus, every domain and every standard in one live view for leadership.",
          },
          {
            title: "School Monitoring and Benchmarking",
            desc: "Rank schools instantly to spot top performers and the campuses needing support.",
          },
          {
            title: "Standards Across All Groups",
            desc: "One structured system, the same policies and SOPs, applied consistently group-wide.",
          },
          {
            title: "Role-based access",
            desc: "Group management sees the whole network; each school works inside its own space.",
          },
        ]}
      />

      <AdvisorsScroller />
      <TestimonialsSection />

      <CommunitySection
        eyebrow="Community"
        heading="Join the SQAAF Insights Community"
        description="A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes."
        groupLabel="SQAAF"
      />

      <KnowledgeSection />

      <ClientsStrip
        title="Our school clients"
        subtitle="Schools across India, Nigeria & the UAE"
        logos={SCHOOL_CLIENTS}
      />

      <FinalCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your SQAAF Journey?"
        body="A 30-minute walkthrough of the dashboard, mapped to where your school is in the framework right now."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />
    </>
  );
}
