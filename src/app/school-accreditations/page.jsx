
import AdvisorsBand from "@/components/school-quality/AdvisorsBand";
import AdvisorsScroller from "@/components/school-quality/AdvisorsScrollar";
import FrameworkSection from "@/components/sections/FrameworkSection";
import CommunitySection from "@/components/sections/CommunitySection";
import ImplementationJourney from "@/components/school-quality/ImplementationJourney";
import PeopleBehindProcess from "@/components/school-quality/PeopleBehindProcess";
import QualityInPractice from "@/components/school-quality/QualityInPractice";
import SchoolHero from "@/components/school-quality/SchoolHero";
import ThreePillars from "@/components/school-quality/ThreePillars";
import QualityMattersSection from "@/components/sections/QualityMattersSection";
import WorkspaceSection from "@/components/school-quality/WorkspaceSection";
import FinalCTA from "@/components/sections/FinalCTA";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import ClientsStrip from "@/components/sections/ClientsStrip";

export const metadata = {
  title: "School Quality Accreditation | Luneblaze",
  description:
    "Luneblaze helps schools improve educational quality through accreditation support, AI-powered tools, automated documentation, audits, and expert guidance.",

  keywords: [
    "School Quality",
    "School Accreditation",
    "School Quality Assessment",
    "SQAAF",
    "CBSE SQAAF",
    "School Quality Improvement",
    "School Accreditation Software",
    "AI for School Accreditation",
    "Luneblaze",
  ],

  alternates: {
    canonical: "/school-accreditations",
  },

  openGraph: {
    title: "School Quality Accreditation | Luneblaze",
    description:
      "AI-powered school quality improvement and accreditation solutions by Luneblaze.",
    url: "https://www.luneblaze.com/school-accreditations",
    siteName: "Luneblaze",
    type: "website",
  },
};

const items = [
  { title: "Parent & stakeholder confidence",  desc: "Demonstrate structured processes, transparent practices and a commitment to improvement through evidence of everyday school life." },
  { title: "Consistency beyond individuals",   desc: "Document responsibilities and repeatable processes so institutional knowledge continues through changes in staff and leadership." },
  { title: "Measurable school performance",    desc: "Use assessment findings to understand strengths, identify gaps and prioritise resources where support is needed." },
  { title: "Prepared teams",                   desc: "Help teachers and coordinators understand expectations and maintain records throughout the year." },
  { title: "Owned improvement plans",          desc: "Translate findings into actions with named owners, timelines and review meetings." },
  { title: "Continuous institutional growth",  desc: "Build on each review to strengthen practices, improve teaching and sustain progress." },
];

const frameworkItems = [
  {
    title: "SQAAF",
    desc: "Self-assessment, domain-wise evidence, teamwork and school improvement planning.",
    cta: "Explore SQAAF ↗",
    href: "/sqaaf",
    logo: "/assets/fw-sqaaf.png",
  },
  {
    title: "NABET",
    desc: "Quality processes, documentation, internal reviews and inspection preparation.",
    cta: "Explore NABET ↗",
    href: "/nabet",
    logo: "/assets/fw-nabet.png",
  },
  {
    title: "Already exploring a platform?",
    desc: "See how Luneblaze fits your school’s current stage and implementation priorities.",
    cta: "Visit platform / Sign up ↗",
    href: "https://www.luneblaze.com",
    external: true,
  },
];

export default function SchoolQualityPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F8F8] text-[#152A2E]">
      <SchoolHero />
      <QualityMattersSection
        eyebrow = "Why school quality matters"
        heading = "Quality that lasts"
        headingHighlight = "beyond an assessment."
        items = {items}
      />;
      <QualityInPractice />
      <FrameworkSection
      eyebrow="Choose your school framework"
      heading="A clear pathway"
      headingHighlight="for your school."
      items={frameworkItems}
    />
      <ImplementationJourney /> 
      <AdvisorsBand /> 
      <WorkspaceSection />
      <ThreePillars />
      <PeopleBehindProcess />
      <FinalCTA
        eyebrow="Your next chapter in quality"
        heading="Build your school’s quality system."
        body="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel="Book a Demo ↗"
      />
      <KnowledgeSection />
      <AdvisorsScroller />
      <CommunitySection
      eyebrow="School communities"
      heading="Join Our School Communities"
      groupLabel="SQAAF"
      bg="#ffffff"
    />
      <ClientsStrip
      title="Our school clients"
      subtitle="Schools across India, Nigeria & the UAE"
    />
      <FinalCTA
        eyebrow="Book a demo"
        heading="Ready to Simplify Your School Quality Journey?"
        body="A 30-minute walkthrough of the dashboard, mapped to where your school is right now."
        ctaLabel="Book a Demo Now ↗"
      />
    </main>
  );
}
