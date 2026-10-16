'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building2,
  Wrench,
  Award,
  Cpu,
  Coins,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCheck2,
} from 'lucide-react';


// Core Industry Verticals representing the old site's business scope
const BUSINESS_SECTORS = [
  {
    icon: Coins,
    tag: 'BANKNOTE & SECURITY PRINTING',
    title: 'Banknote & Security Printing',
    description:
      'Started with a steadfast focus on the currency and security printing market, representing world-renowned European engineering firms for high-speed automated numbering, intaglio presses, and security finishing lines.',
    capabilities: [
      'Automated high-speed numbering systems (Leibinger partner)',
      'Banknote paper sheeters, slitters, and envelope finishing',
      'Rotary stamp and high-security document micro-perforation',
    ],
  },
  {
    icon: Cpu,
    tag: 'SMART CARD & ID INDUSTRY',
    title: 'Smart Card & Raw Materials (RT Print)',
    description:
      'Premier manufacturer and supplier catering to the smart card, banking card, and telecom industry across India with certified raw materials, machine systems, and electronic components.',
    capabilities: [
      'PVC & PVC-ABS core sheets for digital inkjet and offset printing',
      'Coated and uncoated overlays with high-bonding formulations',
      'SMARTRAC RFID inlays, magnetic tapes, and tipping foils',
    ],
  },
  {
    icon: ShieldCheck,
    tag: 'MINT & SECURITY PAPER MILLS',
    title: 'Mint Industry & Security Paper Mills',
    description:
      'Turnkey engineering and materials supply for India’s sovereign mints and security paper manufacturing mills, adhering to stringent government tender specifications.',
    capabilities: [
      'High-speed coin blanking lines and optical blank sorting',
      '3D laser coin die engraving and micro-frosting systems',
      'Cylinder mould wire cloth for security paper watermarking',
    ],
  },
  {
    icon: Wrench,
    tag: 'SPARES, CONSUMABLES & SERVICE',
    title: 'Spares Stocking & Engineering Support',
    description:
      'Maintaining dedicated warehouse facilities in Mumbai for rapid stocking and dispatch of essential spares and consumables, backed by experienced resident service engineers.',
    capabilities: [
      'Mumbai warehouse stocking of critical machinery spare parts',
      'On-site machinery installation, calibration, and commissioning',
      'Long-term annual maintenance contracts and preventive servicing',
    ],
  },
];



export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden pt-32 pb-24 px-6 md:px-12 lg:px-20 selection:bg-cyan-400/30">
      {/* Background Atmosphere Glows matching JUI Design System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[8%] left-[-10%] w-[550px] h-[550px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[45%] right-[-10%] w-[650px] h-[650px] bg-blue-600/10 blur-[170px] rounded-full" />
        <div className="absolute bottom-[5%] left-[20%] w-[450px] h-[450px] bg-teal-500/5 blur-[160px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-24">
        {/* 1. HERO SECTION */}
        <section className="flex flex-col items-start max-w-4xl pt-4">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-10 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00D1FF]" />
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.35em] uppercase">
              Established 1997 · Mumbai, India
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
          >
            Pioneering Representation in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">
              Banknote, Security & Card
            </span>{' '}
            Industry.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#8BAAB8] leading-relaxed font-normal max-w-3xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
          >
            JUI Group is engaged in the representation of world-renowned international companies in the field of Banknote & Security Printing, Mint Industry, Security Paper Mills, and the Smart Card Industry in India. Specialized in high-security, high-value tenders with established credentials as a trusted supplier of machineries, raw materials, spares, and consumables.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-lg border border-cyan-400/50 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,209,255,0.2)] flex items-center gap-2"
            >
              <span>Connect With Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/currency"
              className="px-8 py-3.5 rounded-lg border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40 transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md"
            >
              Currency Division
            </Link>
            <Link
              href="/partners"
              className="px-8 py-3.5 rounded-lg border border-white/[0.08] bg-transparent text-[#8BAAB8] hover:text-white hover:border-cyan-400/40 transition-all text-xs font-mono tracking-wider"
            >
              Global Principals
            </Link>
          </motion.div>
        </section>


        {/* 3. CORE CORPORATE PROFILE & HISTORICAL JOURNEY */}
        <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-8 md:p-14 backdrop-blur-xl">
          <div className="max-w-3xl mb-12">
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase block mb-3">
              Corporate Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Three Decades of Trust in Sovereign High-Security Tenders
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm text-[#8BAAB8] leading-relaxed">
            {/* Column 1: Genesis & Roots */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-4 hover:border-cyan-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Established Roots Since 1997
              </h3>
              <p>
                Established in 1997 with a steadfast focus on the Currency & Security Printing market, JUI Group expanded further catering to the smart card industry, having established strong roots in handling high-security and high-value tender business since 1997.
              </p>
              <p>
                Today, the activity is consolidated to provide end-to-end representation for leading European technology providers to Indian sovereign institutions.
              </p>
            </div>

            {/* Column 2: Mumbai Infrastructure */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-4 hover:border-cyan-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Strategic Mumbai Infrastructure
              </h3>
              <p>
                Headquarters located in the heart of Mumbai’s commercial business district (Andheri East), having close proximity to international and domestic airports, arterial expressways, and financial centers.
              </p>
              <p>
                Supported by dedicated warehouse facilities for prompt stocking of critical machinery spares, consumables, and certified raw materials for rapid pan-India dispatch.
              </p>
            </div>

            {/* Column 3: Service Engineering & Reputation */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-4 hover:border-cyan-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Technical Staff & Service Engineers
              </h3>
              <p>
                Staffed by a dedicated team of professionals including qualified service engineers who provide after-sales technical support, machine installations, calibration, and preventive maintenance.
              </p>
              <p>
                The Group enjoys the highest reputation amongst its global Principals and Indian Clientele alike for its fair dealings, professional capabilities, and customer-care attitude.
              </p>
            </div>
          </div>
        </section>

        {/* 4. THE FOUR CORE BUSINESS SECTORS */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
              Operational Scope
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Four Core Pillars of Representation
            </h2>
            <p className="text-[#8BAAB8] text-sm max-w-2xl leading-relaxed">
              Consistently delivering machineries, raw materials, spares, and consumables across critical national security sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUSINESS_SECTORS.map((sector, idx) => {
              const IconComp = sector.icon;
              return (
                <motion.div
                  key={sector.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10 flex flex-col justify-between hover:border-cyan-400/35 transition-all group backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-300/80 uppercase">
                        {sector.tag}
                      </span>

                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {sector.title}
                    </h3>
                    <p className="text-[#8BAAB8] text-sm leading-relaxed mb-6 font-normal">
                      {sector.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                    {sector.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5 text-xs text-white/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00D1FF] shrink-0 mt-1.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>



        {/* 7. BOTTOM CALL TO ACTION BANNER */}
        <section className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-black to-slate-950/50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,209,255,0.1)]">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Engage With Our Engineering & Procurement Desk
            </h3>
            <p className="text-[#8BAAB8] text-sm leading-relaxed">
              Explore how JUI Group bridges world-leading international technology with India’s sovereign institutions, banknote presses, mints, and card manufacturers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,209,255,0.5)] hover:scale-105 flex items-center gap-2"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partners"
              className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40 font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200"
            >
              Principals Network
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
