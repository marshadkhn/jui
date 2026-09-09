"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerProductsGrid, { ProductItem } from "@/components/currency/PartnerProductsGrid";
import CoinMintingSection from "@/components/currency/CoinMintingSection";
import SecurityPrintingSection from "@/components/currency/SecurityPrintingSection";

const PaperWindMesh = dynamic(() => import("@/components/shared-3d/PaperWindMesh"), {
  ssr: false,
  loading: () => <div className="relative w-full aspect-[16/9] max-h-[820px] min-h-[400px] sm:min-h-[500px] bg-transparent" />
});

const coinMintingProducts: ProductItem[] = [
  {
    id: 'cm1',
    title: 'LASER ENGRAVING SYSTEMS',
    companyName: 'ACSYS Lasertechnik GmbH',
    description: 'Precision 3D laser engraving, frosting, and high-security die digitizing systems for national mints.',
    website: 'https://www.acsys.de/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: 'cm2',
    title: 'HYDRAULIC MEDAL PRESSES',
    companyName: 'Locatelli Meccanica S.r.l.',
    description: 'High-tonnage hydraulic medal and coin stamping presses engineered for state and national mint facilities.',
    website: 'https://www.locatellimeccanica.com/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: 'cm3',
    title: 'OPTICAL COIN INSPECTION',
    companyName: 'PRODITEC',
    description: 'High-speed automated optical inspection systems ensuring flaw-free coin blanks and finished coins.',
    website: 'https://www.proditec.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: 'cm4',
    title: 'COIN SACHET & PACKAGING',
    companyName: 'Syntegon Technology India Pvt. Ltd.',
    description: 'Automated high-throughput coin counting, sachet packaging, wrapping, and cartoning lines.',
    website: 'https://www.syntegon.com/',
    imageSrc: '/currency page/logo2.png',
  },
];

const securityPrintingProducts: ProductItem[] = [
  {
    id: 'sp1',
    title: 'ENVELOPE MAKING MACHINES',
    companyName: 'BW Converting GmbH',
    description: 'Specialized high-speed envelope making and converting lines for the secure document industry.',
    website: 'https://www.bwconverting.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: 'sp2',
    title: 'PASSPORT MAKING MACHINES',
    companyName: 'BW Papersystems Stuttgart GmbH',
    description: 'Kugler Womako automated passport manufacturing systems and precision banknote paper sheeters.',
    website: 'https://www.bwpapersystems.com/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: 'sp3',
    title: 'SMART CARD ISSUANCE & PERSONALIZATION',
    companyName: 'ENTRUST Corporation',
    description: 'Advanced central issuance, physical and digital credential personalization systems for national ID.',
    website: 'https://www.entrust.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: 'sp4',
    title: 'STAMP ROTARY PERFORATION',
    companyName: 'APS Engineering Ltd',
    description: 'Inline rotary perforation and precision security processing systems for postage stamps and secure prints.',
    website: 'http://www.apseng.co.uk/',
    imageSrc: '/currency page/logo2.png',
  },
];

export default function CurrencyPage() {
  return (
    <main className="relative w-full flex flex-col bg-transparent min-h-screen pb-16">
      {/* Hero Section — 3D Unclipped Paper Wind Mesh Floating in Space */}
      <section className="relative w-full px-0 z-10 mb-0 flex flex-col items-center min-h-[400px] sm:min-h-[500px]">
        <PaperWindMesh />
      </section>

      {/* Currency Printing Products & Logo Grid Section */}
      <PartnerProductsGrid />

      {/* Coin Minting Section with Background Wireframe Press & Overlaid Text */}
      <CoinMintingSection />

      {/* Coin Minting Product & Logo Grid Section mounted directly below Coin Minting */}
      <PartnerProductsGrid
        showHeader={false}
        items={coinMintingProducts}
        className="-mt-4 md:-mt-8"
      />

      {/* Security Printing Section with Glowing UV Republic of India Graphic & Overlaid Text */}
      <SecurityPrintingSection />

      {/* Security Printing Product & Logo Grid Section mounted directly below Security Printing */}
      <PartnerProductsGrid
        showHeader={false}
        items={securityPrintingProducts}
        className="-mt-4 md:-mt-8"
      />
    </main>
  );
}
