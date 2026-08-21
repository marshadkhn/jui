"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

const Hero = dynamic(() => import("@/components/hero/Hero"), { ssr: false });
const ProductSections = dynamic(() => import("@/components/sections/ProductSections"), { ssr: false });

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if site loader has already completed in this browser session
    const hasLoadedInSession = sessionStorage.getItem("jui_has_loaded");
    if (!hasLoadedInSession) {
      setLoadingDone(false); // Show loader only on first visit in session
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("jui_has_loaded", "true");
    setLoadingDone(true);
  };

  return (
    <main ref={mainRef} className="relative w-full flex flex-col bg-black">
      {/* Sections */}
      <Hero />
      <ProductSections />

      {/* Loader — Shows only ONCE per browser session */}
      {!loadingDone && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
    </main>
  );
}
