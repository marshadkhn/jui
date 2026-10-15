import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Card Industry Technology | JUI Global - RT Print Technology',
  description:
    'Indenting and trading of specialised raw materials for the banking and ID card industry, including card-grade plastics such as PVC, ABS and PC, magnetic tapes, inlays, spares, and smart card components.',
  keywords: [
    'Card Industry Technology',
    'RT Print Technology',
    'Smart card raw materials Mumbai',
    'PVC Core sheets for card industry',
    'PVC-ABS card material',
    'SMARTRAC RFID inlays',
    'Coated overlays',
    'Magnetic tapes',
    'Tipping foils',
  ],
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
