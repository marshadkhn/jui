import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JUI - Futuristic Space Design",
  description: "A premium futuristic space-themed experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent/30`}
    >
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden snap-y snap-proximity scroll-smooth">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

