import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Measurement Book',
  description: 'Client measurements, recorded in-person or sent in by the client.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plex.variable}`}>
      <body className="font-sans">
        <div className="tape-bar" />
        <div className="max-w-5xl mx-auto px-5 pb-16">
          <div className="flex items-center justify-between py-5 border-b border-line/70">
            <a href="/" className="flex items-center gap-2 text-ink">
              <span className="grid place-items-center w-8 h-8 rounded bg-indigo text-surface2 font-serif text-lg">M</span>
              <span className="font-semibold tracking-tight">Measurement Book</span>
            </a>
            <span className="hidden sm:block text-[11px] tracking-[0.16em] uppercase text-inksoft">Studio records</span>
          </div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
