
import GroupHero from "@/components/group/GroupHero";
import FeatureGridSection from "@/components/heis/FeatureGridSection";
import GroupIntroSection from "@/components/group/GroupIntroSection";
import PillarGridSection from "@/components/group/PillarGridSection";
import ReadinessScoreSection from "@/components/group/ReadinessScoreSection";
import BeyondSqaafSection from "../../components/group/BeyondSqaafSection";
import KnowledgeSection from "@/components/shared/KnowledgeSection";
import ClientsStrip from "@/components/shared/ClientsStrip";
import FinalCTA from "@/components/shared/FinalCTA";
import GdashSection from "@/components/group/GdashSection";
import logoService from "@/services/logoService";

export default async function GroupOfInstitutionsPage() {
  let groupClients = [];

  try {
    const response = await logoService.getAllLogos(1, 100);

    if (
      response?.status === "success" &&
      Array.isArray(response?.data)
    ) {
      groupClients = response.data
        .filter(
          (logo) =>
            String(logo.logo_type).toLowerCase() === "school"
        )
        .map((logo) => ({
          name: logo.logo_name,
          img: logoService.getLogoUrl(
            logo.logo_uri,
            response.host
          ),
        }));
    }
  } catch (error) {
    console.error("Failed to fetch group client logos:", error);
  }

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

      {groupClients.length > 0 && (
        <ClientsStrip
          title="Our group clients"
          subtitle="School groups running multiple campuses"
          logos={groupClients}
          background="#ffffff"
        />
      )}

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
