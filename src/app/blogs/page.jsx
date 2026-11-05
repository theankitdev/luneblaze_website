// src/components/blog/BlogsPage.jsx
import BlogHero from "@/components/blog/BlogHero";
import BlogListSection from "@/components/blog/BlogListSection";
import BlogJoinSection from "@/components/blog/BlogJoinSection";

export default function BlogsPage() {
  return (
    <>
      <BlogHero />
      <BlogListSection />
      <BlogJoinSection />
    </>
  );
}