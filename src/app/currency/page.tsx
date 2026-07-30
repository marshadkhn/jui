"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerProductsGrid, { ProductItem } from "@/components/currency/PartnerProductsGrid";
import CoinMintingSection from "@/components/currency/CoinMintingSection";
import SecurityPrintingSection from "@/components/currency/SecurityPrintingSection";

const PaperWindMesh = dynamic(() => import("@/components/shared-3d/PaperWindMesh"), { ssr: false });

const coinMintingProducts: ProductItem[] = [
  { id: 'cm1', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'cm2', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'cm3', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'cm4', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
];

const securityPrintingProducts: ProductItem[] = [
  { id: 'sp1', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'sp2', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'sp3', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
  { id: 'sp4', title: 'NUMBERING SYSTEM', imageSrc: '/currency page/logo1.png' },
];

export default function CurrencyPage() {
  return (
    <main className="relative w-full flex flex-col bg-transparent min-h-screen pb-16">
      {/* Hero Section — 3D Unclipped Paper Wind Mesh Floating in Space */}
      <section className="relative w-full px-0 z-10 mb-0 flex flex-col items-center">
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
