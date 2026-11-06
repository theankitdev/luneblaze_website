// src/app/sqaaf/page.jsx
import FrameworkHero from "@/components/framework/FrameworkHero";
import FrameworkTimeline from "@/components/framework/FrameworkTimeline";
import FrameworkStats from "@/components/framework/FrameworkStats";
import FrameworkFilm from "@/components/framework/FrameworkFilm";
import FrameworkSplit from "@/components/framework/FrameworkSplit";
import FrameworkPillars from "@/components/framework/FrameworkPillars";
import InsidePlatform from "@/components/framework/InsidePlatform";
import FrameworkFlow from "@/components/framework/FrameworkFlow";
import FrameworkAdvisors from "@/components/framework/FrameworkAdvisors";
import FrameworkTestimonials from "@/components/framework/FrameworkTestimonials";
import FrameworkCTA from "@/components/framework/FrameworkCTA";

import FrameworkSection from "@/components/sections/ChooseFrameworkSection";
import CommunitySection from "@/components/sections/CommunitySection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import ClientsStrip from "@/components/sections/ClientsStrip";

const ADVISORS = [
  {
    name: "Ms. Kalyani Dixit",
    role: "Former Founder · Principal and Director",
    img: "/assets/advisor-1.png",
  },
  {
    name: "Ms. Mini Johny",
    role: "Master Trainer – CBSE · District Coordinator for Training CoE Bengaluru",
    img: "/assets/advisor-2.png",
  },
  {
    name: "Dr. Kshma Swarnkar",
    role: "CBSE Resource Person · AI & Edtech Expert",
    img: "/assets/advisor-3.png",
  },
  {
    name: "Ms. Archana Awade",
    role: "General Manager – Aditya Birla Education Academy",
    img: "/assets/advisor-4.png",
  },
  {
    name: "Ms. Sumithra Singh",
    role: "Academic Consultant & Teacher Trainer",
    img: "/assets/advisor-5.png",
  },
  {
    name: "Mr. Naresh Sharma",
    role: "CBSE Resource Person · UNESCO Health and Wellness Master Trainer",
    img: "/assets/advisor-6.png",
  },
  {
    name: "Ms. Manjit Malik",
    role: "Academic Auditor · Education & School Quality Consultant",
    img: "/assets/advisor-7.png",
  },
  {
    name: "Dr. Rakhee Chaudhary",
    role: "Accreditation & Quality Assurance Expert",
    img: "/assets/advisor-8.png",
  },
  {
    name: "Mr. Narender Kumar",
    role: "CBSE Master Trainer & Lead Facilitator",
    img: "/assets/advisor-9.png",
  },
  {
    name: "Dr. Deepti Chaturvedi",
    role: "CBSE Resource Person · Founder Principal",
    img: "/assets/advisor-10.png",
  },
  {
    name: "Dr. Abhishek Sharma",
    role: "Advanced Lean Six Sigma Certified Trainer",
    img: "/assets/advisor-11.png",
  },
  {
    name: "Dr. Manjari Tejpal",
    role: "CBSE Resource Person & SQAAF Trainer",
    img: "/assets/advisor-12.png",
  },
  {
    name: "Mr. Jeeson Sunny",
    role: "CBSE SQAAF – PAT Member",
    img: "/assets/advisor-13.png",
  },
  {
    name: "Ms. Mohita Jain",
    role: "CBSE Resource Person · Career and Guidance Counsellor",
    img: "/assets/advisor-14.png",
  },
  {
    name: "Dr. Jyoti Prakash Tripathy",
    role: "CBSE Resource Person, District Coordinator",
    img: "/assets/advisor-15.png",
  },
  {
    name: "Dr. Bani Godara",
    role: "CBSE School Principal · CBSE Manual Reviewer",
    img: "/assets/advisor-16.png",
  },
];

const TESTIMONIALS = [
  {
    name: "Mohammad Gaffar",
    role: "Principal · AL AIN Juniors School, UAE",
    quote:
      "Luneblaze's guidance during our SQAAF implementation was invaluable. Their structured documentation support, responsive team, and user-friendly portal made the entire process smooth and efficient.",
    img: "/assets/testimonial-1.png",
  },
  {
    name: "Kusum K P",
    role: "Principal · SMS Academy of Central Education, Karnataka",
    quote:
      "Our SQAAF implementation gained clarity and momentum after partnering with Luneblaze. The structured portal, intuitive dashboard, and timely support helped our team stay aligned with CBSE timelines and manage documentation efficiently.",
    img: "/assets/testimonial-2.png",
  },
  {
    name: "Fr. Roy D'Sa",
    role: "Principal · Fr. Agnel Group of Schools",
    quote:
      "Luneblaze's support during our SQAAF implementation was invaluable. Their structured documentation system and intuitive platform made compliance manageable and efficient for our team.",
    img: "/assets/testimonial-3.png",
  },
  {
    name: "Dr. Andrew Aohato",
    role: "Principal · Livingstone Foundation International School, Nagaland",
    quote:
      "Luneblaze has been an integral part of our SQAAF journey. Their tech-based platform streamlined automation and documentation, providing well-structured, tailored solutions that made accreditation implementation seamless.",
    img: "/assets/testimonial-4.png",
  },
  {
    name: "Pradumna Chaturvedi",
    role: "Managing Director · Gayatri Group of Schools, Agra",
    quote:
      "Luneblaze has brought structure and clarity to our quality assurance journey. The user-friendly portal, streamlined documentation, progress tracking, and timely expert support have helped us manage SQAAF requirements more effectively.",
    img: "/assets/testimonial-5.png",
  },
  {
    name: "Vandana Bhatia",
    role: "Principal · Holy Child Group of Schools",
    quote:
      "Luneblaze's technology-driven systems have streamlined our accreditation and assessment processes, significantly enhancing quality and efficiency in our school.",
    img: "/assets/testimonial-6.png",
  },
];

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
        image="/assets/lb-homepagebanner.gif"
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
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

    <FrameworkCTA
        eyebrow="Your next chapter in quality"
        heading="See Luneblaze in action for your school"
        description="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
      />

      <FrameworkFlow
        eyebrow="How Luneblaze works"
        heading="Eight steps to"
        headingHighlight="audit readiness"
        steps={[
          "System Setup",
          "CLT Creation",
          "Initial Training",
          "Document & Evidence Creation",
          "Real-Time Tracking",
          "Progress Reporting",
          "Monthly Trainings",
          "Audit Readiness",
        ]}
      />

      <FrameworkAdvisors items={ADVISORS} />

      <FrameworkTestimonials items={TESTIMONIALS} />

      <CommunitySection
        eyebrow="Community"
        heading="Join the SQAAF Insights Community"
        description="A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes."
        groupLabel="SQAAF"
      />

      <FrameworkSection
        eyebrow="Also working towards NABET?"
        heading="The same evidence base"
        headingHighlight="serves both submissions."
        items={[
          {
            title: "NABET",
            desc: "Accreditation readiness for schools, with criteria-mapped documentation and audit trails.",
            href: "/nabet",
            logo: "/assets/fw-nabet.png",
            cta: "Visit NABET ↗",
          },
        ]}
      />

      <KnowledgeSection />

      <ClientsStrip
        title="Our school clients"
        subtitle="Schools across India, Nigeria & the UAE"
        logos={SCHOOL_CLIENTS}
      />

      <FrameworkCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your SQAAF Journey?"
        description="A 30-minute walkthrough of the dashboard, mapped to where your school is in the framework right now."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo"
        email="schools@luneblaze.com"
      />
    </>
  );
}
