'use client';

import React from 'react';
import Link from 'next/link';
import JuiLogo from './shared/JuiLogo';

const menuItems = [
  { name: 'JUI GLOBALS', href: '/' },
  { name: 'CURRENCY', href: '/currency' },
  { name: 'CARD', href: '#' },
  { name: 'PAINT', href: '#' },
  { name: 'CONTACT US', href: '#contact' },
];

const Navbar = () => {
  return (
    <nav className=" relative top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-transparent transition-all duration-300 backdrop-blur-[0px] hover:backdrop-blur-sm">
      {/* Logo with 4-Color CMYK Hover Effect */}
      <div className="flex-1">
        <JuiLogo width={90} height={40} imageClassName="h-14 md:h-16 w-auto" />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-[0.9rem] font-semibold tracking-[0.2em] text-white hover:text-accent transition-all duration-100 ease-out whitespace-nowrap hover:scale-110 inline-block"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Placeholder for right side (empty for now) */}
      <div className="flex-1 flex justify-end"></div>
    </nav>
  );
};

export default Navbar;
