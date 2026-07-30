'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface JuiLogoProps {
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
}

export default function JuiLogo({
  width = 90,
  height = 40,
  className = '',
  imageClassName = 'h-16 w-auto',
}: JuiLogoProps) {
  return (
    <Link href="/" className={`relative group inline-block rounded-md overflow-hidden p-1 ${className}`}>
      {/* 4 CMYK Background Color Quadrants: Hidden (opacity-0) by default, Visible (opacity-100) on Hover */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0 pointer-events-none rounded-md overflow-hidden">
        {/* Top-Left: Cyan (#00aeef) */}
        <div className="bg-[#00aeef]" />
        {/* Top-Right: Magenta (#ec008c) */}
        <div className="bg-[#ec008c]" />
        {/* Bottom-Left: Yellow (#fff200) */}
        <div className="bg-[#fff200]" />
        {/* Bottom-Right: Dark Gray (#231f20) */}
        <div className="bg-[#231f20]" />
      </div>

      {/* White "jui" Logo Image Overlaid on Top */}
      <Image
        src="/logo.png"
        alt="JUI Logo"
        width={width}
        height={height}
        className={`relative z-10 object-contain brightness-110 transition-transform duration-300 group-hover:scale-105 ${imageClassName}`}
        priority
      />
    </Link>
  );
}
