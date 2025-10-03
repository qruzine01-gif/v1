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
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata = {
  title: {
    template: '%s | Qruzine',
    default: 'Qruzine - Digital QR Menu & Ordering System',
  },
  description:
    "Qruzine is a modern digital ordering system for restaurants. Create QR menus, manage orders, and boost customer experience with ease.",
  keywords: [
    "Qruzine",
    "digital menu",
    "QR code menu",
    "restaurant ordering system",
    "online food ordering",
    "contactless dining",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://qruzine.com"),
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Qruzine - Digital Ordering System for Restaurants",
    description:
      "Qruzine helps restaurants go digital with QR menus and smart ordering. Improve efficiency and enhance customer experience.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://qruzine.com",
    siteName: "Qruzine",
    images: [
      {
        url: "/images/og-image.jpg", // Create a clean OG image with your logo + tagline
        width: 1200,
        height: 630,
        alt: "Qruzine - Digital QR Menu",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qruzine - Digital QR Menu & Ordering System",
    description:
      "Go contactless with Qruzine. Digital QR menus for restaurants with smart ordering.",
    images: ["/images/og-image.jpg"],
    creator: "@qruzine", // if you make a Twitter handle
  },
};


export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
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