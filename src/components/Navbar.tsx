'use client';

import React from 'react';
import Link from 'next/link';

const menuItems = [
  { name: 'JUI GLOBALS', href: '#' },
  { name: 'CURRENCY', href: '#' },
  { name: 'CARD', href: '#' },
  { name: 'PAINT', href: '#' },
  { name: 'CONTACT US', href: '#' },
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-8 bg-transparent transition-all duration-300 backdrop-blur-[0px] hover:backdrop-blur-sm">
      {/* Logo */}
      <div className="flex-1">
        <Link 
          href="/" 
          className="text-2xl font-bold italic tracking-tighter hover:text-accent transition-colors duration-300"
        >
          jui
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-10">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-xs font-semibold tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
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
