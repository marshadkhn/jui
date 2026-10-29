"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerProductsGrid from "@/components/currency/PartnerProductsGrid";
import CoinMintingSection from "@/components/currency/CoinMintingSection";
import SecurityPrintingSection from "@/components/currency/SecurityPrintingSection";

const PaperWindMesh = dynamic(() => import("@/components/shared-3d/PaperWindMesh"), {
  ssr: false,
  loading: () => <div className="relative w-full aspect-[16/9] max-h-[820px] min-h-[400px] sm:min-h-[500px] bg-transparent" />
});

export default function CurrencyPage() {
  return (
    <main className="relative w-full flex flex-col bg-transparent min-h-screen pb-16 pt-24 sm:pt-28 md:pt-36">
      {/* Hero Section — 3D Unclipped Paper Wind Mesh Floating in Space with comfortable clearance below Navbar */}
      <section className="relative w-full px-0 z-10 mb-0 flex flex-col items-center min-h-[420px] sm:min-h-[520px] pt-4 sm:pt-6">
        <PaperWindMesh />
      </section>

      {/* Currency Printing Products & Logo Grid Section */}
      <PartnerProductsGrid />

      {/* Coin Minting Section with Background Wireframe Press & Overlaid Text */}
      <CoinMintingSection />

      {/* Security Printing Section with Glowing UV Republic of India Graphic & Overlaid Text */}
      <SecurityPrintingSection />
    </main>
  );
}

