'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  { name: 'JUI GLOBALS', href: '#' },
  { name: 'CURRENCY', href: '#' },
  { name: 'CARD', href: '#' },
  { name: 'PAINT', href: '#' },
  { name: 'CONTACT US', href: '#' },
];

const Navbar = () => {
  return (
    <nav className=" relative top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-transparent transition-all duration-300 backdrop-blur-[0px] hover:backdrop-blur-sm">
      {/* Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="Jui Logo"
            width={90}
            height={40}
            className="h-16 w-auto object-contain brightness-110"
            priority
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-[0.9rem] font-semibold tracking-[0.2em] text-foreground hover:text-accent transition-all duration-100 ease-out whitespace-nowrap hover:scale-110 inline-block"
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
