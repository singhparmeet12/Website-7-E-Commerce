import type { Metadata } from 'next';
import { Fredoka, Space_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FlyToCartOverlay } from '@/components/layout/FlyToCartOverlay';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GLITCHPOP // Y2K Pop-Culture Collectibles & Rare Merch Drops',
  description:
    'Chaotic-curated pop-culture collectibles: rare trading cards, designer vinyl art toys, Y2K acrylic phone charms, holographic sticker packs, and cyber desk tech.',
  keywords: [
    'pop culture collectibles',
    'blind boxes',
    'designer vinyl toys',
    'phone charms',
    'y2k stickers',
    'anime plushies',
    'trading card drops',
    'cyberpunk desk accessories',
  ],
  authors: [{ name: 'GLITCHPOP' }],
  openGraph: {
    title: 'GLITCHPOP // Y2K Pop-Culture Collectibles & Drops',
    description: 'Shop by vibe: Cybercore, Kawaii, Grunge, Y2K, and Weirdcore collectibles.',
    siteName: 'GLITCHPOP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-white dark:bg-glitch-dark text-glitch-dark dark:text-white antialiased selection:bg-glitch-magenta selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <FlyToCartOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
