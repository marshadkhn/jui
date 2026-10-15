'use client';

import React from 'react';
import CardHeroSection from '@/components/card/CardHeroSection';

export default function CardPage() {
  return (
    <main className="relative w-full min-h-screen bg-black">
      {/* Hero Section Reusing the Card Product Section in Full Detail */}
      <CardHeroSection />
    </main>
  );
}
