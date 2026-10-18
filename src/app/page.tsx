"use client";
import { useState, useEffect, useRef } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import { scrollToPaintSection } from "@/components/Navbar";

const Hero = dynamic(() => import("@/components/hero/Hero"), { ssr: false });
const ProductSections = dynamic(() => import("@/components/sections/ProductSections"), { ssr: false });

function PaintScrollWatcher({ loadingDone }: { loadingDone: boolean }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loadingDone) return;
    const isPaintsTarget = searchParams.get("section") === "paints" || (typeof window !== "undefined" && window.location.hash === "#paints");
    if (isPaintsTarget) {
      const timer = setTimeout(() => {
        scrollToPaintSection();
        window.history.replaceState({}, "", "/");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams, loadingDone]);

  return null;
}

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
      <Suspense fallback={null}>
        <PaintScrollWatcher loadingDone={loadingDone} />
      </Suspense>

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
