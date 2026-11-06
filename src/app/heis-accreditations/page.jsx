import HeroSection from "@/components/heis/HeroSection";
import QualityMattersSection from "@/components/sections/QualityMattersSection";
import FrameworkSection from "@/components/sections/ChooseFrameworkSection";
import FeatureGridSection from "@/components/heis/FeatureGridSection";
import OneInstitutionDifferentPurposes from "@/components/heis/OneInstitutionDifferentPurposes";
import AdvisorsBand from "@/components/school-quality/AdvisorsBand";
import FinalCTA from "@/components/sections/FinalCTA";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import AdviorsScroller from "@/components/school-quality/AdvisorsScrollar";
import CommunitySection from "@/components/sections/CommunitySection";
import ClientsStrip from "@/components/sections/ClientsStrip";


export const metadata = {
  title: "HEIs Accreditations | Luneblaze",
  description:
    "Luneblaze supports Higher Education Institutions with accreditation, automated documentation, assessment, and quality improvement solutions.",

  keywords: [
    "HEIs Accreditation",
    "Higher Education Accreditation",
    "NAAC Accreditation",
    "NBA Accreditation",
    "NIRF Ranking",
    "College Accreditation",
    "University Accreditation",
    "Higher Education Quality",
    "AI for Accreditation",
    "Luneblaze",
  ],

  alternates: {
    canonical: "/heis-accreditations",
  },

  openGraph: {
    title: "HEIs Accreditations | Luneblaze",
    description:
      "Technology-driven accreditation and quality improvement solutions for higher education institutions.",
    url: "https://www.luneblaze.com/heis-accreditations",
    siteName: "Luneblaze",
    type: "website",
  },
};


const items = [
  {
    title: "Trust through evidence",
    desc: "Help students, faculty and leadership understand the institution’s strengths through documented practices and outcomes.",
  },
  {
    title: "Academic accountability",
    desc: "Connect curriculum delivery, assessment and student outcomes to departmental review and improvement.",
  },
  {
    title: "Leadership clarity",
    desc: "Give management a consistent picture of pending work, evidence gaps and improvement priorities.",
  },
  {
    title: "Continuity across cycles",
    desc: "Maintain records as institutional work happens so preparation becomes a repeatable process.",
  },
  {
    title: "Departmental ownership",
    desc: "Assign responsibility to the people closest to each record, programme and outcome.",
  },
  {
    title: "Informed resource allocation",
    desc: "Use reviewed data to guide investment in faculty development, research, student support and infrastructure.",
  },
];

const frameworkItems = [
  {
    title: "NAAC",
    desc: "Coordinate IQAC-led quality processes, organise criterion-linked evidence and track institutional improvement actions.",
    cta: "Explore NAAC support ↗",
    href: "/naac",
    logo: "/assets/fw-naac.png",
  },
  {
    title: "NBA",
    desc: "Organise programme documentation, outcome-related evidence and departmental ownership for programme accreditation preparation.",
    cta: "Explore NBA support ↗",
    href: "/nba",
    logo: "/assets/fw-nba.png",
  },
  {
    title: "NIRF",
    desc: "Bring institutional data, supporting records and reporting responsibilities into a coordinated ranking preparation workflow.",
    cta: "Explore NIRF support ↗",
    href: "/nirf",
    logo: "/assets/fw-nirf.png",
  },
];

const collegeLogos = [
  { name: "J.C. Bose University of Science and Technology, YMCA", img: "/assets/client-jc-bose.png" },
  { name: "PAL College of Technology & Management",              img: "/assets/client-pal.png" },
  { name: "Aravali College of Engineering and Management",       img: "/assets/client-aravali.png" },
  { name: "IEC College of Engineering",                          img: "/assets/client-iec.png" },
  { name: "D. Y. Patil College of Engineering & Technology",     img: "/assets/client-dy-patil.png" },
  { name: "Atria Institute of Technology",                       img: "/assets/client-atria.png" },
  { name: "East West Institute of Technology",                   img: "/assets/client-east-west.png" },
  { name: "HMS Institute of Technology",                         img: "/assets/client-hms.png" },
  { name: "Ghousia College of Engineering",                      img: "/assets/client-ghousia.png" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QualityMattersSection
        eyebrow="Why institutional quality matters"
        heading="Make improvement visible"
        headingHighlight="across the institution."
        items={items}
      />
      <FrameworkSection
        eyebrow="Distinct frameworks. Relevant workflows."
        heading="Choose your higher"
        headingHighlight="education pathway."
        items={frameworkItems}
        background="#ffffff"
      />
      <FeatureGridSection
      eyebrow="Why a connected quality system matters"
      heading="Make institutional"
      headingHighlight="quality visible."
      items={[
        {
          title: "Clear criteria and responsibilities",
          desc: "Turn framework requirements into work owned by IQAC, departments and programme teams.",
        },
        {
          title: "Evidence that can be reviewed",
          desc: "Maintain a traceable connection between institutional claims, supporting data and source documents.",
        },
        {
          title: "Outcome-based improvement",
          desc: "Use programme results, stakeholder feedback and reviews to identify practical improvement priorities.",
        },
        {
          title: "Continuous institutional reporting",
          desc: "Build records throughout the year so reports draw from maintained information rather than a last-minute collection drive.",
        },
      ]}
    />
      <OneInstitutionDifferentPurposes />
      <AdvisorsBand />
      <FeatureGridSection
      eyebrow="Inside the platform"
      heading="A workspace that"
      headingHighlight="supports the work."
      items={[
        {
          title: "IQAC workflows",
          desc: "Tasks, meetings, review dates and records that help quality teams coordinate across departments.",
        },
        {
          title: "Evidence management",
          desc: "A shared repository for policies, data and implementation evidence connected to the relevant preparation scope.",
        },
        {
          title: "Programme outcomes",
          desc: "Outcome mapping, attainment records and improvement actions for programme-level preparation.",
        },
        {
          title: "Leadership reports",
          desc: "Progress reporting to help management identify priorities, review action closure and direct support.",
        },
      ]}
    />
    <FeatureGridSection
      eyebrow="A working quality office"
      heading="Support the people"
      headingHighlight="doing the work."
      items={[
        {
          title: "IQAC & committees",
          desc: "Maintain review agendas, attendance, minutes, responsibilities and follow-up actions.",
        },
        {
          title: "Departments & programmes",
          desc: "Own source records, check data and link outcomes to improvements in academic practice.",
        },
        {
          title: "Management & group leadership",
          desc: "Review institution-level progress and coordinate support across departments or campuses.",
        },
      ]}
      minCol="300px"
      background="#F4F8F8"
    />
    <FinalCTA
      eyebrow="Your next chapter in quality"
      heading="Build a more coordinated quality journey."
      body="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
      ctaLabel="Book a Demo ↗"
      ctaHref="/book-a-demo.html"
    />
    <KnowledgeSection />
    <AdviorsScroller />
    <CommunitySection
      eyebrow="College communities"
      heading="Join Our College Communities"
      description="A working community for coordinators, principals and quality teams — share what you have built, ask what you are stuck on, and keep up with framework changes."
      groupLabel="NAAC"
      bg="#F4F8F8"
    />
    <ClientsStrip
      title="Our college clients"
      subtitle="Universities & colleges across India"
      logos={collegeLogos}
    />
    <FinalCTA
      eyebrow="Book a demo"
      heading="Ready to Simplify Your College Quality Journey?"
      body="A 30-minute walkthrough of the dashboard, mapped to where your institution is right now."
      ctaLabel="Book a Demo ↗"
      ctaHref="/book-a-demo.html"
    />
    </>
  );
}
