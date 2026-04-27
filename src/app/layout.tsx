import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";


const CenturyGothic = localFont({
  src: "../../public/centurygothic.ttf",
  variable: "--font-century-gothic",
});

export const metadata: Metadata = {
  title: "JUI GLOBAL",
  description: "A premium futuristic space-themed experience.",
};

import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${CenturyGothic.variable} antialiased selection:bg-accent/30`}
    >
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}


