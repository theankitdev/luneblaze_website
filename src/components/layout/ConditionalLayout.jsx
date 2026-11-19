"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}

      <main>{children}</main>

      {!isAdminPage && <Footer />}

      {!isAdminPage && <Loader />}
    </>
  );
}