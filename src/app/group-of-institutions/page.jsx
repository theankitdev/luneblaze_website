import GroupHero from "@/components/group/GroupHero";
import FeatureGridSection from "@/components/heis/FeatureGridSection";
import GroupIntroSection from "@/components/group/GroupIntroSection";
import PillarGridSection from "@/components/group/PillarGridSection";
import ReadinessScoreSection from "@/components/group/ReadinessScoreSection";
import BeyondSqaafSection from "../../components/group/BeyondSqaafSection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import ClientsStrip from "@/components/sections/ClientsStrip";
import FinalCTA from "@/components/sections/FinalCTA";
import GdashSection from "@/components/group/GdashSection";

const GROUP_CLIENTS = [
  { name: "Father Agnel Group of Schools", img: "/assets/client-father-agnel.png" },
  { name: "Shalom Group of Schools",       img: "/assets/client-shalom.png" },
  { name: "Gayatri Group of Schools",      img: "/assets/client-gayatri.png" },
  { name: "Holy Child Group of Schools",   img: "/assets/client-holy-child.png" },
];

export default function GroupOfInstitutionsPage() {
  return (
    <main>
      <GroupHero />
      <FeatureGridSection
        eyebrow="Why group-wide governance matters"
        heading="Long-term groups are built on"
        headingHighlight="group-wide systems."
        description="One underperforming campus can affect trust in an entire group. Shared standards and leadership visibility help you intervene earlier."
        minCol="220px"
        background="#F4F8F8"
        items={[
          {
            title: "Protect the group's reputation",
            desc: "Build consistent quality practices across schools to support parent trust and the group's reputation.",
          },
          {
            title: "Coordinate SQAAF readiness",
            desc: "Keep self-assessment, evidence, responsibilities and implementation progress visible across campuses.",
          },
          {
            title: "Standardize quality",
            desc: "Reduce variation in processes and student experiences with common policies and quality frameworks.",
          },
          {
            title: "Give leadership visibility",
            desc: "Move from disconnected updates to a central view of school performance and improvement priorities.",
          },
          {
            title: "Govern continuously",
            desc: "Make quality monitoring, measurement and improvement an ongoing group-wide practice.",
          },
        ]}
      />
      <GroupIntroSection />
      <GdashSection />
      <PillarGridSection />
      <ReadinessScoreSection />
      <BeyondSqaafSection />
      <KnowledgeSection />
      <ClientsStrip
        title="Our group clients"
        subtitle="School groups running multiple campuses"
        logos={GROUP_CLIENTS}
        background="#ffffff"
      />
      <FinalCTA
        eyebrow="Your next chapter in quality"
        heading="Bring your whole group onto one dashboard."
        body="See how Luneblaze brings your people, processes and progress together. Start with a walkthrough for your institution."
        ctaLabel="Book a Demo ↗"
        ctaHref="/book-a-demo.html?interest=School%20Group"
        background="#F4F8F8"
      />
    </main>
  );
}
