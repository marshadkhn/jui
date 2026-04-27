import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";


const Montserrat = localFont({
  src: "../../public/montserrat.regular.otf",
  variable: "--font-montserrat",
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
      className={`${Montserrat.variable} antialiased selection:bg-accent/30`}
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


