import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | JUI Global - Banknote, Security Printing & Card Industry',
  description:
    'Established in 1997 in Mumbai. Handling high-security and high-value tender business in India. Representing world-renowned global manufacturers in Banknote & Security Printing, Mint Industry, Security Paper Mills, and Smart Card Industry.',
  keywords: [
    'JUI Global About Us',
    'JUI Group Mumbai',
    'Banknote and Security Printing India',
    'Smart Card Industry Raw Materials',
    'Mint Industry India',
    'Security Paper Mills Supplier',
    'RT Print Technology',
    'Everest Grande Mumbai',
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
