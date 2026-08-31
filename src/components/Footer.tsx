'use client';

import React from 'react';
import Link from 'next/link';
import JuiLogo from './shared/JuiLogo';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'JUI Global', href: '#' },
      { name: 'Global Network', href: '#india-section' },
    ],
    expertise: [
      { name: 'Currency Printing', href: '/currency' },
      { name: 'Card Technology', href: '#' },
      { name: 'Paints & Coatings', href: '#' },
    ],
    locations: [
      {
        label: 'Registered & Corporate Office',
        address: 'A wing 305, Everest Grande, Mahakali Caves Road, Andheri East, Mumbai - 400 093, India.',
      },
      {
        label: 'Works & Warehouse (Bhiwandi)',
        address: 'J6-26 Bhumi World, Mumbai - Nashik Express Way, Pimplas, Bhiwandi, Thane, Maharashtra 421302.',
      },
      {
        label: 'Works & Warehouse (Turbhe)',
        address: 'C-1, Punit Industrial Premises Co-op. Society Ltd., Plot No. D 11/11-A, M.I.D.C., T.T.C. Opp. Fly Over Bridge Turbhe Rly. Stn., Thane Belapur Road, Turbhe, Navi Mumbai – 400 705.',
      },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Use', href: '#' },
    ],
  };

  return (
    <footer className="relative w-full bg-[#000000] z-[70] pt-28 pb-14 px-6 md:px-12 lg:px-16 flex flex-col justify-between snap-start shadow-[0_-30px_70px_rgba(0,0,0,0.98)]">
      {/* Top Transition Blur - Creates the "merged" effect with India section */}
      <div className="absolute top-1 left-0 w-full h-72 -translate-y-full pointer-events-none z-50">
        <div
          className="w-full h-full bg-gradient-to-t from-black to-transparent backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to top, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          }}
        />
      </div>

      {/* Solid Background */}
      <div className="absolute inset-0 bg-black z-[-1]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Main Footer Content — Balanced 4 - 2 - 2 - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 mb-20">
          
          {/* Column 1: Brand (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <JuiLogo width={140} height={60} imageClassName="h-14 w-auto" />
              <p className="text-[#8BAAB8] text-[14px] leading-relaxed max-w-sm">
                We are a global logistics and investment firm, creating connections that power the future of trade through innovation and high-security technology.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D1FF]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8BAAB8]/80">
                Global Operations Active
              </span>
            </div>
          </div>

          {/* Column 2: Company Links (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:pt-2">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40 font-mono">
              Company
            </h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#8BAAB8] hover:text-cyan-400 transition-colors text-[14px] font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Expertise Links (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:pt-2">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40 font-mono">
              Expertise
            </h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.expertise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#8BAAB8] hover:text-cyan-400 transition-colors text-[14px] font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Office Locations (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:pt-2">
            <h4 className="text-white font-bold text-[11px] tracking-[0.25em] uppercase opacity-40 font-mono">
              Office Locations
            </h4>
            <div className="flex flex-col gap-4">
              {footerLinks.locations.map((loc) => (
                <div
                  key={loc.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-cyan-400/25"
                >
                  <span className="text-white text-[12px] font-semibold tracking-tight block mb-1">
                    {loc.label}
                  </span>
                  <p className="text-[#8BAAB8] text-[12px] leading-relaxed">
                    {loc.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-bold font-mono">
            © 2024 JUI INDUSTRIES. SECURED HUB.
          </p>
          <div className="flex items-center gap-8">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/30 hover:text-cyan-400 transition-colors text-[10px] tracking-[0.25em] uppercase font-bold font-mono"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Futuristic Scanline Effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </footer>
  );
};

export default Footer;
