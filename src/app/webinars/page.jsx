
import BlogHero from "@/components/blog/BlogHero";
import WebinarListSection from "@/components/webinar/WebinarListSection";
import BlogJoinSection from "@/components/blog/BlogJoinSection";

const ALL_WEBINARS = [
  {
    slug: "sqaaf-self-assessment",
    img: "/assets/blog-5.png",
    title: "SQAAF Self-Assessment: A Practical Walkthrough",
    desc: "Scoring all 84 standards — weightage, evidence expectations and the mistakes that cost marks.",
    tag: "SQAAF",
    cat: "sqaaf",
    status: "UPCOMING",
    meta: "Date to be announced",
    length: "60 min",
    cta: "Register interest",
    href: "/webinars/sqaaf-self-assessment",
  },
  {
    slug: "naac-ssr-preparation",
    img: "/assets/blog-3.webp",
    title: "NAAC SSR Preparation Without the Panic",
    desc: "Building a Self Study Report that survives DVV clarifications first time round.",
    tag: "NAAC",
    cat: "naac",
    status: "UPCOMING",
    meta: "Date to be announced",
    length: "75 min",
    cta: "Register interest",
    href: "/webinars/naac-ssr-preparation",
  },
  {
    slug: "co-po-mapping-attainment",
    img: "/assets/blog-6.png",
    title: "CO-PO Mapping and Attainment in Practice",
    desc: "Direct and indirect attainment worked through with real programme examples.",
    tag: "NBA",
    cat: "nba",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "55 min",
    cta: "Watch session",
    href: "/webinars/co-po-mapping-attainment",
  },
  {
    slug: "documentation-systems-that-scale",
    img: "/assets/blog-2.webp",
    title: "Documentation Systems That Scale",
    desc: "Structure your document library once, then reuse it every cycle across every framework.",
    tag: "QUALITY",
    cat: "quality",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "45 min",
    cta: "Watch session",
    href: "/webinars/documentation-systems-that-scale",
  },
  {
    slug: "nabet-documentation-first-principles",
    img: "/assets/blog-4.png",
    title: "NABET Documentation From First Principles",
    desc: "What the standard asks for, and how to organise it before assessors arrive.",
    tag: "NABET",
    cat: "nabet",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "50 min",
    cta: "Watch session",
    href: "/webinars/nabet-documentation-first-principles",
  },
  {
    slug: "nirf-collecting-ranking-data",
    img: "/assets/blog-1.webp",
    title: "NIRF: Collecting Ranking Data All Year",
    desc: "Systems that make the submission window uneventful instead of frantic.",
    tag: "NIRF",
    cat: "nirf",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "40 min",
    cta: "Watch session",
    href: "/webinars/nirf-collecting-ranking-data",
  },
  {
    slug: "preparing-external-audit",
    img: "/assets/blog-in-3.webp",
    title: "Preparing for Your External Audit",
    desc: "A checklist-driven session for the four weeks before an assessment visit.",
    tag: "QUALITY",
    cat: "quality",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "65 min",
    cta: "Watch session",
    href: "/webinars/preparing-external-audit",
  },
  {
    slug: "setting-up-clt-focus-groups",
    img: "/assets/blog-in-1.webp",
    title: "Setting Up Your CLT and Focus Groups",
    desc: "How to structure ownership so quality work actually moves between meetings.",
    tag: "SQAAF",
    cat: "sqaaf",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "35 min",
    cta: "Watch session",
    href: "/webinars/setting-up-clt-focus-groups",
  },
  {
    slug: "evidence-that-holds-up-under-review",
    img: "/assets/blog-in-5.webp",
    title: "Evidence That Holds Up Under Review",
    desc: "What assessors look for, and the gaps institutions most commonly miss.",
    tag: "QUALITY",
    cat: "quality",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "50 min",
    cta: "Watch session",
    href: "/webinars/evidence-that-holds-up-under-review",
  },
  {
    slug: "reading-readiness-dashboard",
    img: "/assets/blog-in-2.webp",
    title: "Reading Your Readiness Dashboard Honestly",
    desc: "Turning domain scores into a plan leadership will actually fund.",
    tag: "QUALITY",
    cat: "quality",
    status: "ON DEMAND",
    meta: "Recording coming soon",
    length: "30 min",
    cta: "Watch session",
    href: "/webinars/reading-readiness-dashboard",
  },
];

export default function WebinarsPage() {
  return (
    <>
      <BlogHero
        breadcrumb="Webinars"
        title="Practical Sessions."
        highlight="Better-Prepared Teams"
        subtitle="Explore session topics for principals, coordinators, IQAC members and institutional quality teams."
      />
      <WebinarListSection items={ALL_WEBINARS} />
      <BlogJoinSection
        title="Get Session Invites on WhatsApp"
        description="Join the Luneblaze quality group and get webinar invites, framework updates and templates the moment they are out — alongside coordinators and principals working through the same cycles."
        whatsappLabel="Join the WhatsApp Group"
      />
    </>
  );
}
