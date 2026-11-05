// src/components/about/AboutPage.jsx
import AboutHero from "@/components/about/AboutHero";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import TeamSection from "@/components/about/TeamSection";
import AdvisorsSection from "@/components/about/AdvisorsSection";
import GoalSection from "@/components/about/GoalSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <MissionVisionSection />
      <TeamSection />
      <AdvisorsSection />
      <GoalSection />
    </>
  );
}