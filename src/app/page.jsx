import HeroSection from "@/components/home/HeroSection";
import TrustedInstitutions from "@/components/home/TrustedInstitutions";
import PathwaysSection from "@/components/home/PathwaysSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import WorkspaceSection from "@/components/home/WorkspaceSection";
import ImprovementCycle from "@/components/home/ImprovementCycle";
import ReadinessSection from "@/components/home/ReadinessSection";
import GroupsSection from "@/components/home/GroupsSection";
import FrameworksSection from "@/components/home/FrameworksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import FinalCTA from "@/components/sections/FinalCTA";
import QualitySystemFilm from "@/components/home/QualitySystemFilm";


export const metadata = {
  title: "Luneblaze | Inducing Quality in Education",

  description:
    "Luneblaze offers AI-powered accreditation solutions for schools and colleges, streamlining SQAAF and NAAC processes with automated documentation, audits, and expert consultancy, trusted by over 100 institutions since 2017.",

  keywords: [
    "Luneblaze",
    "SQAAF accreditation",
    "NAAC accreditation",
    "AI for education",
    "School accreditation software",
    "College accreditation solutions",
    "Accreditation automation",
    "Education quality framework",
    "CBSE SQAAF",
    "NAAC SSR",
    "IIQA automation",
    "Educational consultancy",
    "AI in schools",
    "AI in colleges",
    "Accreditation platform India",
    "NEP 2020",
    "National Education Policy",
    "Audits",
    "Consultancy Support",
  ],

  icons: {
    icon: "/images/favicon.webp",
    shortcut: "/images/favicon.webp",
  },

  verification: {
    google: "R5dUqiw4AVzRJDBZx3wgrzd_r1HxevauUq0BO7dZtHI",
  },

  openGraph: {
    title: "Luneblaze | Inducing Quality in Education",
    description:
      "AI-powered accreditation solutions for schools and colleges.",
    siteName: "Luneblaze",
    type: "website",
    url: "https://www.luneblaze.com",
  },
};


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedInstitutions />
      <PathwaysSection />
      <QualitySystemFilm />
      <EcosystemSection />
      <WorkspaceSection />
      <ImprovementCycle />
      <ReadinessSection />
      <GroupsSection />
      <FrameworksSection />
      <TestimonialsSection />
      <KnowledgeSection />
      <FinalCTA 
        eyebrow = "Your next chapter in quality"
        heading = "Let’s make quality a culture."
        body = "See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel = "Book a Demo ↗"
        ctaHref = "/book-a-demo"
      />
    </>
  );
}