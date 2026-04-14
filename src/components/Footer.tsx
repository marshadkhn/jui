'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer = () => {
    const footerLinks = {
        company: [
          { name: 'About Us', href: '#' },
          { name: 'JUI Globals', href: '#' },
          { name: 'Sustainability', href: '#' },
          { name: 'Careers', href: '#' },
        ],
        expertise: [
          { name: 'Currency Printing', href: '#' },
          { name: 'Security Paper', href: '#' },
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
       {/* Solid Background to prevent any 3D overlap from India section */}
       <div className="absolute inset-0 bg-black z-[-1]" />

       {/* Background Depth Elements */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,209,255,0.05)_0%,transparent_70%)] opacity-50" />
       </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Heading - Matches Continuity of Product Sections */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
        >
             <div className="mb-4">
                <span className="font-mono font-bold leading-none select-none text-[14px] tracking-[0.4em] text-accent uppercase opacity-50">
                    Next Chapter
                </span>
            </div>
            <h2 className="text-white font-bold mb-4 tracking-[-0.01em] text-4xl md:text-6xl lg:text-7xl">
                Global Network <span className="text-accent/80">.</span>
            </h2>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-10">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="JUI Logo"
                width={140}
                height={60}
                className="brightness-125 transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="text-[#8BAAB8] text-base leading-relaxed max-w-sm">
              We are a global logistics and investment firm, creating connections that power the future of trade through innovation and high-security technology.
            </p>
            
            {/* Newsletter */}
            <div className="relative max-w-xs pt-4">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Subscribe to our insights</p>
                <div className="relative group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-transparent border-b border-white/20 py-3 pr-10 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                    />
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-accent transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
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
          
          <div className="flex items-center gap-4 bg-white/[0.03] px-5 py-2.5 rounded-full border border-white/5">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-accent/90">Active Protocol</span>
          </div>
        </div>
      </div>

      {/* Futuristic Scanline Effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </footer>
  );
};

export default Footer;
