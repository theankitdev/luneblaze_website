// src/app/sqaaf/page.jsx
import FrameworkHero from "@/components/framework/FrameworkHero";
import FrameworkTimeline from "@/components/framework/FrameworkTimeline";
import FrameworkStats from "@/components/framework/FrameworkStats";
import FrameworkFlow from "@/components/framework/FrameworkFlow";
import FrameworkBeyond from "@/components/framework/FrameworkBeyond";
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
import { buildWheelSvg } from "@/lib/wheelsvg";


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

const nabetWheel = buildWheelSvg("NABET", [
  "Curriculum & Pedagogy",
  "Teaching & Learning",
  "Student Support",
  "Infrastructure & Safety",
  "Human Resources",
  "Management & Leadership",
  "Community Engagement",
]);

export default function Page() {
  return (
    <>
      <FrameworkHero
        eyebrow="NABET Accreditation Partner"
        heading="Build Processes That"
        headingHighlight="Stand Up to Review"
        description="National Accreditation Board for Education and Training. Strengthen school quality systems through structured documentation, evidence management, internal reviews and inspection preparation."
        image="/assets/lb-SQAAF.webp"
        wheel={nabetWheel}
        wheelTitle="Seven NABET quality areas"
        ctas={[
          { label: "Book a Demo ↗", href: "/book-a-demo", primary: true },
          { label: "View Portal", href: "https://www.luneblaze.com" },
        ]}
        stats={[
          { value: "100+", label: "Schools Assisted" },
          { value: "10+", label: "Years of Expertise" },
        ]}
        trust="Trusted by Schools across India"
      />

      <FrameworkStats
        eyebrow="Quality Council of India"
        heading="About"
        headingHighlight="NABET Accreditation"
        description="NABET is the Quality Council of India's board for education and training. Its school accreditation examines how consistently a school plans, delivers and improves, assessed against the published NABET standard."
        stats={[
          {
            value: "QCI",
            label: "Governing Body",
            desc: "NABET operates under the Quality Council of India",
          },
          {
            value: "36",
            label: "Mapped Documentation",
            desc: "Objective evidence uploaded against each parameter",
          },
          {
            value: "Audit",
            label: "Internal & External",
            desc: "Review cycles with corrective action tracking",
          },
          {
            value: "Renewal",
            label: "Cycle Validity",
            desc: "Re-assessment planned well ahead of expiry",
          },
        ]}
        wheel={nabetWheel}
        wheelTitle="Quality areas we help you organise"
        wheelLegend={[
          { label: "Curriculum & Pedagogy", value: "" },
          { label: "Teaching & Learning", value: "" },
          { label: "Student Support", value: "" },
          { label: "Infrastructure & Safety", value: "" },
          { label: "Human Resources", value: "" },
          { label: "Management & Leadership", value: "" },
          { label: "Community Engagement", value: "" },
        ]}
        background="#FFFFFF"
      />

      <FrameworkSection
        background="#FFFFFF"
        eyebrow="Why it matters"
        heading="Why NABET Accreditation"
        headingHighlight="Matters"
        cols={4}
        items={[
          {
            title: "Independent validation",
            desc: "A third-party mark that tells parents and boards your systems have been examined, not just described.",
          },
          {
            title: "Documentation discipline",
            desc: "Records are maintained continuously against criteria, so an assessment visit is never a scramble.",
          },
          {
            title: "Process over personality",
            desc: "Quality survives staff changes because it lives in documented systems, not individual memory.",
          },
          {
            title: "A platform for growth",
            desc: "Accreditation findings become the improvement plan for the next cycle.",
          },
        ]}
      />

      <FrameworkTimeline
        eyebrow="Eleven defined stages"
        heading="The NABET"
        headingHighlight="Accreditation Process"
        description="Eleven defined stages, from portal application through to annual surveillance. Luneblaze prepares your school for each one."
        items={[
          {
            badge: "STAGE 01",
            title: "Submission of Application",
            desc: "The school applies through the NABET Portal with all mandatory annexures and supporting documents uploaded.",
          },
          {
            badge: "STAGE 02",
            title: "Consent & Payment of Fees",
            desc: "Formal consent is given on the portal and the accreditation fee paid online per the prescribed structure.",
          },
          {
            badge: "STAGE 03",
            title: "Document Assessment",
            desc: "The NABET Secretariat reviews the submission for completeness, accuracy and alignment with requirements.",
          },
          {
            badge: "STAGE 04",
            title: "Closure of Inadequacies",
            desc: "One opportunity to rectify gaps recorded in the Document Assessment Report, within the stipulated timeline.",
          },
          {
            badge: "STAGE 05",
            title: "Final Document Review",
            desc: "The Secretariat reviews responses and either closes the assessment or advances the school to the next stage.",
          },
          {
            badge: "STAGE 06",
            title: "Self-Assessment",
            desc: "The school responds to all 36 Accreditation Parameters on the portal, uploading objective evidence against each.",
          },
          {
            badge: "STAGE 07",
            title: "Desktop Assessment",
            desc: "Assessors evaluate the self-assessment and evidence; gaps are recorded as Non-Conformities with one chance to close them.",
          },
          {
            badge: "STAGE 08",
            title: "Onsite Assessment",
            desc: "Two assessors, one day on site. Travel and stay costs are borne by the school as per applicable norms.",
          },
          {
            badge: "STAGE 09",
            title: "Assessment Report & Committee",
            desc: "A detailed report goes to the Accreditation Committee, which reviews findings and takes the final decision.",
          },
          {
            badge: "STAGE 10",
            title: "Grant of Accreditation",
            desc: "Accreditation is granted on committee approval, specifying the type of accreditation and its validity period.",
          },
          {
            badge: "STAGE 11",
            title: "Validity & Surveillance",
            desc: "Accreditation remains valid subject to surveillance through the cycle.",
          },
        ]}
      />

      <FrameworkBeyond
        items={[
          { title: "Documentation & Evidence Management" },
          { title: "Quality Process Mapping & Framework Implementation" },
          { title: "Policies, SOPs & Quality Manual Support" },
          { title: "Workflow & Stakeholder Management" },
          { title: "Gap Assessment & Improvement Planning" },
          { title: "Real-Time Progress & Quality Monitoring" },
          { title: "Mock Audits & Accreditation Readiness Assessment" },
          { title: "Corrective & Preventive Action Tracking" },
          { title: "Continuous Improvement & Compliance Monitoring" },
          { title: "Expert Advisory & Accreditation Support" },
        ]}
      />

      <FrameworkFlow
        eyebrow="Our approach"
        heading="A cycle that"
        headingHighlight="keeps improving"
        items={[
          { title: "Assess" },
          { title: "Plan" },
          { title: "Implement" },
          { title: "Monitor" },
          { title: "Review" },
          { title: "Improve" },
        ]}
        background="#F4F8F8"
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
        eyebrow="Also working towards SQAAF?"
        heading="The same evidence base"
        headingHighlight="serves both submissions."
        description="Explore how Luneblaze supports the SQAAF framework alongside your NABET cycle."
        tone="light"
        min="300px"
        items={[
          {
            badge: "SCHOOLS",
            title: "SQAAF",
            sub: "School Quality Assessment and Assurance Framework",
            desc: "School Quality Assessment and Assurance Framework — seven domains, 49 sub-domains and 84 standards.",
            logo: "/assets/fw-sqAAF.png",
            cta: "Visit SQAAF ↗",
            href: "/sqAAF.html",
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
        tone="white"
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
