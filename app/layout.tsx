import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'OpenInterview Coach',
  description:
    'A privacy-first, multilingual, open-source interview practice website with reusable question decks and AI-generated audio.',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'OpenInterview Coach',
    description: 'Practice interviews in Japanese, English, and Chinese with privacy-safe prompts and AI-generated audio.',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenInterview Coach',
    description: 'Practice interviews in Japanese, English, and Chinese with privacy-safe prompts and AI-generated audio.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
