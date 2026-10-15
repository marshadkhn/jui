import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | JUI Global - Banknote, Card & Security Engineering',
  description:
    'Get in touch with JUI Global headquarters in Mumbai, Turbhe Works, and Bhiwandi logistics facility. Direct bridge for currency printing, smart card manufacturing, minting, and industrial materials.',
  keywords: [
    'JUI Global Contact',
    'RT Print Technology Mumbai',
    'Banknote printing equipment India',
    'Smart card raw material supplier',
    'Security paper mills supplier Mumbai',
    'Coin minting machinery',
    'Andheri East Mumbai',
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
