'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Printer,
  Clock,
  Building2,
  Warehouse,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

// Location Facilities Data
const LOCATIONS = [
  {
    id: 'corporate',
    title: 'Registered & Corporate Office',
    shortName: 'Mumbai HQ (Andheri)',
    badge: 'Headquarters',
    tagline: 'Executive Directorate & Sovereign Advisory',
    address: '305, Everest Grande, Mahakali Caves Road, Andheri East, Mumbai - 400 093, Maharashtra, India.',
    phone: '+91 22 6137 8200',
    fax: '+91 22 6137 8299',
    emails: ['jui@juiglobal.com', 'rtpt@juiglobal.com'],
    hours: 'Mon – Sat: 09:30 AM – 06:30 PM IST',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10662.243579769984!2d72.8591093868608!3d19.122023816279782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c825ee066529%3A0xd7628fac7119c9d6!2sJUI+GROUP!5e0!3m2!1sen!2sin!4v1482412706697',
    directionsUrl:
      'https://maps.google.com/?q=JUI+GROUP+305+Everest+Grande+Mahakali+Caves+Road+Andheri+East+Mumbai',
    image: '/jui_office.jpg',
  },
  {
    id: 'turbhe',
    title: 'Works & Warehouse Facility (Turbhe)',
    shortName: 'Turbhe Works (Navi Mumbai)',
    badge: 'Smart Card & Raw Materials',
    tagline: 'RT Print Technology Manufacturing Hub',
    address:
      'C-1, Punit Industrial Premises Co-op. Society Ltd., Plot No. D 11/11-A, M.I.D.C., T.T.C., Opp. Fly Over Bridge, Turbhe Rly. Stn., Thane Belapur Road, Turbhe, Navi Mumbai – 400 705, Maharashtra, India.',
    phone: '+91 22 6137 8200',
    fax: '+91 22 6137 8299',
    emails: ['rtpt@juiglobal.com', 'jui@juiglobal.com'],
    hours: 'Mon – Sat: 09:00 AM – 06:30 PM IST',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8222687102717!2d73.01358937582236!3d19.071536782131976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c140cceca6b7%3A0x6b8c8d8b4b73b221!2sTurbhe%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000',
    directionsUrl:
      'https://maps.google.com/?q=Punit+Industrial+Premises+MIDC+TTC+Turbhe+Navi+Mumbai',
    image: null,
  },
  {
    id: 'bhiwandi',
    title: 'Works & Logistics Hub (Bhiwandi)',
    shortName: 'Bhiwandi Hub (Thane)',
    badge: 'Heavy Logistics',
    tagline: 'Pan-India Distribution & Heavy Machinery Staging',
    address:
      'J6-26 Bhumi World, Mumbai - Nashik Express Way, Pimplas, Bhiwandi, Thane, Maharashtra 421302, India.',
    phone: '+91 22 6137 8200',
    fax: '+91 22 6137 8299',
    emails: ['jui@juiglobal.com'],
    hours: 'Mon – Sat: 08:30 AM – 07:00 PM IST',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.452654316972!2d73.05374667582697!3d19.262692281977797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bd05697693c7%3A0x867375a2bf85458!2sBhumi%20World%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1700000000001',
    directionsUrl:
      'https://maps.google.com/?q=Bhumi+World+Industrial+Park+Bhiwandi+Maharashtra',
    image: null,
  },
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'corporate' | 'turbhe' | 'bhiwandi'>('corporate');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeLocation = LOCATIONS.find((loc) => loc.id === activeTab) || LOCATIONS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden pt-32 pb-24 px-6 md:px-12 lg:px-20 selection:bg-cyan-400/30">
      {/* Background Atmosphere Glows matching JUI Design System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[8%] left-[-10%] w-[550px] h-[550px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[45%] right-[-10%] w-[650px] h-[650px] bg-blue-600/10 blur-[170px] rounded-full" />
        <div className="absolute bottom-[5%] left-[25%] w-[450px] h-[450px] bg-teal-500/5 blur-[160px] rounded-full" />
        {/* Subtle geometric grid backdrop */}
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
              Official Contact Desk · Mumbai, India
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
          >
            Get In Touch With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">
              JUI Global
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#8BAAB8] leading-relaxed font-normal max-w-3xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
          >
            Whether you represent a central bank, government currency printing press, smart card
            manufacturer, or a global technology principal seeking high-trust market representation
            in India — our engineering and logistics directors are at your service.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
          >
            <a
              href="#facilities-section"
              className="px-8 py-3.5 rounded-lg border border-cyan-400/50 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,209,255,0.2)] flex items-center gap-2"
            >
              <span>Explore Facilities & Map</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href="mailto:jui@juiglobal.com"
              className="px-8 py-3.5 rounded-lg border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40 transition-all text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md flex items-center gap-2"
            >
              <span>Send Email</span>
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href="tel:+912261378200"
              className="px-6 py-3.5 rounded-lg border border-white/[0.08] bg-transparent text-[#8BAAB8] hover:text-white hover:border-cyan-400/40 transition-all text-xs font-mono tracking-wider flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+91 22 6137 8200</span>
            </a>
          </motion.div>
        </section>



        {/* 3. INTERACTIVE MULTI-FACILITY DIRECTORY & MAP */}
        <section id="facilities-section" className="flex flex-col gap-10 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
            <div>
              <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase block mb-3">
                Geographic Presence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Offices, Works & Staging Facilities
              </h2>
            </div>

            {/* Facility Selector Tabs */}
            <div className="flex flex-wrap p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md self-start md:self-auto">
              {LOCATIONS.map((loc) => {
                const isActive = activeTab === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveTab(loc.id as any)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${isActive
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,209,255,0.4)]'
                        : 'text-[#8BAAB8] hover:text-white hover:bg-white/[0.04]'
                      }`}
                  >
                    {loc.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Facility Card + Map */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Details (Span 5) */}
              <div className="lg:col-span-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 backdrop-blur-md flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded border border-cyan-400/30 bg-cyan-400/10">
                      {activeLocation.badge}
                    </span>
                    <span className="text-[#8BAAB8] text-xs font-mono">
                      Maharashtra, India
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                      {activeLocation.title}
                    </h3>
                    <p className="text-cyan-300/90 text-sm font-medium">
                      {activeLocation.tagline}
                    </p>
                  </div>

                  {/* Office Building Image if available */}
                  {activeLocation.image && (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/[0.1] group">
                      <Image
                        src={activeLocation.image}
                        alt="JUI Corporate Office Building"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[11px] font-mono tracking-wider text-white/90 bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                          Everest Grande · Andheri East
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">
                          Corporate Hub
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Address & Direct Details */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3.5">
                      <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#8BAAB8] font-mono mb-1">
                          Postal Address
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">
                          {activeLocation.address}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[#8BAAB8] font-mono">
                            Telephone
                          </div>
                          <a
                            href={`tel:${activeLocation.phone.replace(/\s+/g, '')}`}
                            className="text-xs font-mono font-medium text-white hover:text-cyan-400 transition-colors"
                          >
                            {activeLocation.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Printer className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[#8BAAB8] font-mono">
                            Facsimile
                          </div>
                          <span className="text-xs font-mono text-white/80">
                            {activeLocation.fax}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#8BAAB8] font-mono mb-1">
                          Email Communications
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeLocation.emails.map((em) => (
                            <a
                              key={em}
                              href={`mailto:${em}`}
                              className="text-xs font-mono text-cyan-300 hover:text-white transition-colors underline decoration-cyan-400/40"
                            >
                              {em}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#8BAAB8] font-mono">
                          Operational Timing
                        </div>
                        <div className="text-xs text-white/85">
                          {activeLocation.hours}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-6 mt-6 border-t border-white/[0.06]">
                  <a
                    href={activeLocation.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black text-cyan-300 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span>Navigate With Google Maps</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Embedded Google Map (Span 7) */}
              <div className="lg:col-span-7 rounded-3xl border border-white/[0.08] overflow-hidden bg-black/60 relative min-h-[420px] lg:min-h-full flex flex-col">
                <iframe
                  title={`${activeLocation.title} Google Map`}
                  src={activeLocation.mapEmbed}
                  className="w-full h-full min-h-[450px] lg:min-h-[600px] border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.1] opacity-90 transition-opacity hover:opacity-100"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </section>


        {/* 7. BOTTOM CALL TO ACTION BANNER */}
        <section className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-black to-slate-950/50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,209,255,0.1)]">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Explore Our Full Capabilities Portfolio
            </h3>
            <p className="text-[#8BAAB8] text-sm leading-relaxed">
              Learn more about our thirty-year journey, global European technology principals, and
              the security infrastructure powering India’s banknotes, cards, and mints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="px-8 py-4 rounded-xl border border-cyan-400/50 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:text-white font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200"
            >
              About JUI Global
            </Link>
            <Link
              href="/currency"
              className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,209,255,0.5)] hover:scale-105"
            >
              Currency Division
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
