"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import IndiaSection from "@/components/sections/IndiaSection";
import Footer from "@/components/Footer";
import { useScroll } from "framer-motion";

const Hero = dynamic(() => import("@/components/hero/Hero"), { ssr: false });
const ProductSections = dynamic(() => import("@/components/sections/ProductSections"), { ssr: false });
const ModelScene = dynamic(() => import("@/components/shared-3d/ModelScene"), { ssr: false });

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const indiaSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  return (
    <main ref={mainRef} className="relative w-full flex flex-col bg-black">
      {/* Global 3D Background */}
      <ModelScene globalScroll={scrollYProgress} indiaRef={indiaSectionRef} />

      {/* Sections */}
      <Hero indiaRef={indiaSectionRef} />
      <ProductSections />
      <IndiaSection ref={indiaSectionRef} />
      <Footer />

      {/* Loader */}
      {!loadingDone && (
        <LoadingScreen onComplete={() => setLoadingDone(true)} />
      )}
    </main>
  );
}
