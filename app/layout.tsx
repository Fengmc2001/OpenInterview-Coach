import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'OpenInterview Coach',
  description:
    'A multilingual interview practice template with editable question decks, sample answers, and generated audio.',
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
    description: 'Practice with question decks, sample answers, and audio in Japanese, English, and Chinese.',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenInterview Coach',
    description: 'Practice with question decks, sample answers, and audio in Japanese, English, and Chinese.',
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
