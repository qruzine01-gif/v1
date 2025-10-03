import { Inter, Playfair_Display, Poppins } from 'next/font/google';
import { Layout } from '../../../components/layout/Layout';
import { siteConfig } from './metadata';
import Image from 'next/image';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  ...siteConfig,
  title: {
    template: '%s | Qruzine',
    default: siteConfig.title,
  },
};

export default function LandingLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* Fixed logo in top-left, matching splash screen final position */}
        <div className="fixed top-6 left-6 z-20">
          <div className="w-14 h-14 relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain filter drop-shadow-lg"
              priority
            />
          </div>
        </div>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
