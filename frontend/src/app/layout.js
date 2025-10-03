import { 
  Inter, 
  Playfair_Display, 
  Poppins,
  Montserrat,
  Dancing_Script,
  JetBrains_Mono 
} from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "./(root)/landing/metadata";

// Primary font for body text - excellent readability
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Elegant serif for headings and restaurant name
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Modern sans-serif alternative
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Versatile font for UI elements
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Script font for special occasions/signatures
const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font for code and technical elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Define basic metadata in layout - Twitter card will be handled in page components
export const metadata = {
  title: {
    template: '%s | Qruzine',
    default: 'Qruzine - Digital Ordering System',
  },
  description: 'Transform your restaurant with Qruzine\'s digital ordering system. Increase sales, improve efficiency, and enhance customer experience.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://qruzine.com'),
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Qruzine - Digital Ordering System for Restaurants',
    description: 'Transform your restaurant with our digital ordering system. Increase sales and improve efficiency.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://qruzine.com',
    siteName: 'Qruzine',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'Qruzine Digital Ordering System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
        {modal}
      </body>
    </html>
  );
}