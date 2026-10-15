'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const STATS = [
  { value: '30+', label: 'Years of Excellence', sub: 'Established in 1997 in Mumbai' },
  { value: '50+', label: 'Global Principals', sub: 'World-renowned technology partners' },
  { value: '4', label: 'Core Industries', sub: 'Currency, Card, Mint & Security Paper' },
  { value: '100%', label: 'Sovereign Trust', sub: 'Serving India’s national security institutions' },
];

const PILLARS = [
  {
    tag: 'BANKNOTE & SECURITY',
    title: 'Currency & Security Printing',
    description:
      'Providing end-to-end consulting, representation, and specialized engineering systems for banknote numbering, security thread embedding, intaglio printing, and high-speed envelope converting.',
    points: [
      'High-speed automated numbering systems',
      'Banknote paper sheeters & finishing lines',
      'Rotary stamp and document micro-perforation',
    ],
  },
  {
    tag: 'CREDENTIALS & ID',
    title: 'Smart Card & Identity Systems',
    description:
      'Supplying central issuance and personalization infrastructure for national IDs, passports, banking chips, and biometric citizen identification across India.',
    points: [
      'High-volume central issuance machines',
      'Dual-interface card embedding & milling',
      'Physical and cryptographic key personalization',
    ],
  },
  {
    tag: 'PRECISION MINTING',
    title: 'Minting & Coin Production',
    description:
      'Partnering with world-leading European mint engineering firms to supply state-of-the-art coin blanking, 3D laser die engraving, optical coin sorting, and sachet packaging lines.',
    points: [
      'High-tonnage hydraulic medal & coin presses',
      '3D laser die engraving & micro-frosting',
      'Automated high-speed optical blank inspection',
    ],
  },
  {
    tag: 'MATERIALS & COATINGS',
    title: 'Security Paper & Specialty Inks',
    description:
      'Facilitating high-security substrate technology, watermarking wire, chemical authentication agents, and industrial paint & ink mixing systems for sovereign security facilities.',
    points: [
      'Security paper cylinder mould wire cloth',
      'Anti-counterfeiting optical taggants & dyes',
      'High-throughput industrial dispersion & mixing',
    ],
  },
];

const LOCATIONS = [
  {
    type: 'Registered & Corporate Office',
    city: 'Mumbai',
    address: 'A wing 305, Everest Grande, Mahakali Caves Road, Andheri East, Mumbai - 400 093, India.',
    badge: 'HQ',
  },
  {
    type: 'Works & Logistics Hub',
    city: 'Bhiwandi',
    address: 'J6-26 Bhumi World, Mumbai - Nashik Express Way, Pimplas, Bhiwandi, Thane, Maharashtra 421302.',
    badge: 'Facility',
  },
  {
    type: 'Works & Warehouse Facility',
    city: 'Turbhe, Navi Mumbai',
    address: 'C-1, Punit Industrial Premises, Plot No. D 11/11-A, M.I.D.C., T.T.C., Opp. Turbhe Rly. Stn., Navi Mumbai – 400 705.',
    badge: 'Logistics',
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden pt-32 pb-24 px-6 md:px-12 lg:px-20 selection:bg-cyan-400/30">
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[50%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-28">
        {/* Hero Section */}
        <section className="flex flex-col items-start max-w-4xl pt-6">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-10 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00D1FF]" />
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.35em] uppercase">
              Est. 1997 · Mumbai, India
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
          >
            Pioneering the Gateway to India&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">Security & Minting</span> Industry.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#8BAAB8] leading-relaxed font-normal max-w-3xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
          >
            For nearly three decades, JUI Global has served as the trusted bridge connecting world-renowned international technology leaders with India’s sovereign currency printing, minting, security paper manufacturing, and identity document institutions.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
          >
            <Link
              href="/currency"
              className="px-8 py-3.5 rounded-lg border border-cyan-400/50 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,209,255,0.2)]"
            >
              Explore Solutions
            </Link>
            <Link
              href="/#product-sections"
              className="px-8 py-3.5 rounded-lg border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40 transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md"
            >
              Interactive Showcase
            </Link>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-md flex flex-col justify-between hover:border-cyan-400/40 transition-colors group"
            >
              <div className="text-5xl font-black text-cyan-400 tracking-tight mb-4 font-mono group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div>
                <div className="text-white font-bold text-base mb-1 tracking-tight">
                  {stat.label}
                </div>
                <div className="text-[#8BAAB8] text-xs font-medium leading-relaxed">
                  {stat.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Core Expertise Pillars */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Four Pillars of Sovereign Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10 flex flex-col justify-between hover:border-cyan-400/35 transition-all group backdrop-blur-md"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-300/80 uppercase block mb-3">
                    {pillar.tag}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[#8BAAB8] text-sm leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  {pillar.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-xs text-white/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00D1FF]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Corporate Infrastructure & Locations */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
              Infrastructure & Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Offices & Warehouse Facilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOCATIONS.map((loc, i) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col justify-between hover:border-cyan-400/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-cyan-400/30 bg-cyan-400/10">
                      {loc.badge}
                    </span>
                    <span className="text-white/60 font-mono text-[11px]">
                      {loc.city}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">
                    {loc.type}
                  </h4>
                  <p className="text-[#8BAAB8] text-xs leading-relaxed">
                    {loc.address}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action Card */}
        <section className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-black to-slate-950/50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,209,255,0.1)]">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Explore Our Global Principals Network
            </h3>
            <p className="text-[#8BAAB8] text-sm leading-relaxed">
              Discover our world-leading technology partners across Germany, Switzerland, the United Kingdom, and the United States.
            </p>
          </div>

          <Link
            href="/#product-sections"
            className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200 shrink-0 shadow-[0_0_25px_rgba(0,209,255,0.5)] hover:scale-105"
          >
            View 3D Interactive Map
          </Link>
        </section>
      </div>
    </main>
  );
}
