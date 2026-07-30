'use client';

import React from 'react';
import Link from 'next/link';
import JuiLogo from './shared/JuiLogo';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'JUI Global', href: '#' },
    ],
    expertise: [
      { name: 'Currency Printing', href: '#' },
      { name: 'Card Technology', href: '#' },
      { name: 'Paints & Coatings', href: '#' },
    ],
    social: [
      { name: 'LinkedIn', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'Instagram', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Use', href: '#' },
    ]
  };

  return (
    <footer className="relative w-full min-h-[90vh] bg-[#000000] z-30 pt-32 pb-16 px-6 md:px-16 flex flex-col justify-between snap-start">
      {/* Top Transition Blur - Creates the "merged" effect with India section */}
      <div className="absolute top-1 left-0 w-full h-72 -translate-y-full pointer-events-none z-50">
        <div
          className="w-full h-full bg-gradient-to-t from-black to-transparent backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to top, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
          }}
        />
      </div>

      {/* Solid Background */}
      <div className="absolute inset-0 bg-black z-[-1]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-24">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-10">
            <JuiLogo width={140} height={60} imageClassName="h-16 w-auto" />
            <p className="text-[#8BAAB8] text-base leading-relaxed max-w-sm">
              We are a global logistics and investment firm, creating connections that power the future of trade through innovation and high-security technology.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-8 md:pt-4">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40">Company</h4>
            <ul className="flex flex-col gap-5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#8BAAB8] hover:text-accent transition-colors text-[15px] font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 md:pt-4">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40">Expertise</h4>
            <ul className="flex flex-col gap-5">
              {footerLinks.expertise.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#8BAAB8] hover:text-accent transition-colors text-[15px] font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 md:pt-4">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40">Follow</h4>
            <ul className="flex flex-col gap-5">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#8BAAB8] hover:text-accent transition-colors text-[15px] font-medium ">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-14">
            <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-bold">
              © 2024 JUI INDUSTRIES. SECURED HUB.
            </p>
            <div className="flex gap-10">
              {footerLinks.legal.map(link => (
                <Link key={link.name} href={link.href} className="text-white/20 hover:text-accent transition-colors text-[10px] tracking-[0.3em] uppercase font-bold">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Scanline Effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </footer>
  );
};

export default Footer;
