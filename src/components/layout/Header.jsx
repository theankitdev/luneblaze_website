"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "School Quality", href: "/school-accreditations" },
  { name: "HEI Quality", href: "/heis-accreditations" },
  { name: "Groups", href: "/group-of-institutions" },
];

/** Is this nav item active for the current pathname? */
function isActive(href, pathname) {
  if (href === "/") return pathname === "/";
  // Treat /school-accreditations and /school-accreditations/sqaaf both as active
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[60] border-b border-[#D6E3E5] bg-white">
      <div className="relative mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-4 px-[clamp(16px,3vw,32px)]">
        {/* Logo */}
        <Link href="/" aria-label="Luneblaze home" className="flex shrink-0 items-center">
          <Image
            src="/assets/luneblaze-logo.png"
            alt="Luneblaze"
            width={180}
            height={46}
            priority
            className="h-[46px] w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden h-full items-stretch font-bold text-[14.5px] lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 xl:px-[18px] border-b-[3px] transition-colors ${
                  active
                    ? "border-[#17AEB9] text-[#0E8B95]"
                    : "border-transparent text-[#4C6165] hover:text-[#0E8B95] hover:border-[#B7E2E5]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-[10px]">
          <Link
            href="/book-a-demo"
            className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-[#17AEB9] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(23,174,185,.85)] transition-colors hover:bg-[#0E8B95] hover:text-white lg:px-5 lg:py-3"
          >
            Book a Demo <span>↗</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
            className="h-[40px] rounded-[4px] border border-[#D6E3E5] bg-white px-3 text-sm font-bold text-[#152A2E] transition-colors hover:bg-gray-50 lg:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="grid border-t border-[#D6E3E5] bg-white text-base font-bold shadow-lg lg:hidden">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-[#E6EEEF] px-[clamp(16px,3vw,32px)] py-[15px] ${
                  active
                    ? "border-l-[3px] border-l-[#17AEB9] text-[#0E8B95] bg-[#F4FAFA]"
                    : "text-[#152A2E] hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {/* Mobile-only Book a Demo button inside the menu */}
          <Link
            href="/book-a-demo"
            onClick={() => setMenuOpen(false)}
            className="px-[clamp(16px,3vw,32px)] py-[15px] text-[#0E8B95] sm:hidden"
          >
            Book a Demo ↗
          </Link>
        </nav>
      )}
    </header>
  );
}