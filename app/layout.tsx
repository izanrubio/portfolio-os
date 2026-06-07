import type { Metadata } from 'next';
import { JetBrains_Mono, Inter, Outfit } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IzanOS — Izan Rubio Portfolio',
  description: 'Full Stack Developer & Cybersecurity Specialist. Interactive OS-inspired portfolio.',
  keywords: ['portfolio', 'full stack', 'cybersecurity', 'developer'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${jetbrainsMono.variable} ${inter.variable} ${outfit.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
