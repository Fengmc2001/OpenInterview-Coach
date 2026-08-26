import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenInterview Coach',
  description:
    'A privacy-first, multilingual, open-source interview practice website with reusable question decks and AI-generated audio.',
  metadataBase: new URL('https://fengmc2001.github.io/OpenInterview-Coach/'),
  icons: { icon: '/OpenInterview-Coach/favicon.png' },
  openGraph: {
    title: 'OpenInterview Coach',
    description: 'Practice interviews in Japanese, English, and Chinese with privacy-safe prompts and AI-generated audio.',
    images: ['/OpenInterview-Coach/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenInterview Coach',
    description: 'Practice interviews in Japanese, English, and Chinese with privacy-safe prompts and AI-generated audio.',
    images: ['/OpenInterview-Coach/og.png'],
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
