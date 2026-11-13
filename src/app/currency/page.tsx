"use client";

import React from "react";
import CurrencyHeroSection from "@/components/currency/CurrencyHeroSection";
import PartnerProductsGrid, { defaultMintItems, defaultSecurityItems } from "@/components/currency/PartnerProductsGrid";
import CoinMintingSection from "@/components/currency/CoinMintingSection";
import SecurityPrintingSection from "@/components/currency/SecurityPrintingSection";

export default function CurrencyPage() {
  return (
    <main className="relative w-full flex flex-col bg-transparent min-h-screen pb-16">
      {/* 1. Hero Section with Title & Description on Left, 3D Banknote on Right */}
      <CurrencyHeroSection />

      {/* 2. Currency Printing Products & Logo Grid Section */}
      <PartnerProductsGrid showHeader={false} />

      {/* 3. Coin Minting Section with Background Wireframe Press & Overlaid Text */}
      <CoinMintingSection />

      {/* 4. Mint Partner Products & Logo Grid Section */}
      <PartnerProductsGrid items={defaultMintItems} showHeader={false} />

      {/* 5. Security Printing Section with Glowing UV Republic of India Graphic & Overlaid Text */}
      <SecurityPrintingSection />

      {/* 6. Security Partner Products & Solutions Grid Section */}
      <PartnerProductsGrid items={defaultSecurityItems} showHeader={false} />
    </main>
  );
}
