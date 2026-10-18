'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import JuiLogo from './shared/JuiLogo';

export const scrollToPaintSection = () => {
  const performScroll = () => {
    const container = document.getElementById('product-sections');
    if (!container || container.offsetHeight === 0) {
      return false;
    }

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    // Section 3 (Paints) is centered at globalScroll 0.60 (active range: 0.53 - 0.73)
    const targetY = containerTop + 0.60 * scrollableDistance;

    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetY, { duration: 1.8 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    return true;
  };

  // Attempt immediately
  if (!performScroll()) {
    // Retry until the dynamically imported ProductSections is loaded and mounted
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (performScroll() || attempts > 40) {
        clearInterval(interval);
      }
    }, 100);
  }
};

const menuItems = [
  { name: 'JUI GLOBAL', href: '/' },
  { name: 'CURRENCY', href: '/currency' },
  { name: 'CARD', href: '/card' },
  { name: 'PAINT', href: '/?section=paints' },
  { name: 'PARTNERS', href: '/partners' },
  { name: 'CONTACT', href: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string; href: string }) => {
    if (item.name === 'PAINT') {
      e.preventDefault();
      if (pathname === '/') {
        scrollToPaintSection();
      } else {
        router.push('/?section=paints');
      }
    } else if (item.name === 'JUI GLOBAL' && pathname === '/') {
      e.preventDefault();
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-transparent pointer-events-none transition-all duration-300">
      {/* Logo with 4-Color CMYK Hover Effect */}
      <div className="flex-1 pointer-events-auto">
        <JuiLogo width={90} height={40} imageClassName="h-14 md:h-16 w-auto" />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10 pointer-events-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={(e) => handleItemClick(e, item)}
            className="text-[0.9rem] font-semibold tracking-[0.2em] text-white hover:text-accent transition-all duration-100 ease-out whitespace-nowrap hover:scale-110 inline-block cursor-pointer"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Placeholder for right side (empty for now) */}
      <div className="flex-1 flex justify-end pointer-events-none"></div>
    </nav>
  );
};

export default Navbar;
