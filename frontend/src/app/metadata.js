// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://qruzine.com';

export const siteConfig = {
  name: 'Qruzine',
  description: 'Digital Ordering System for Restaurants',
  url: SITE_URL,
  ogImage: `${SITE_URL}/images/og-image.jpg`,
  links: {
    twitter: 'https://twitter.com/qruzine',
    github: 'https://github.com/your-org/qruzine',
  },
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Features',
      href: '/#features',
    },
    {
      title: 'Pricing',
      href: '/#pricing',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ],
};

// Base metadata configuration
export const metadata = {
  title: 'Qruzine - Digital Ordering System',
  description: 'Revolutionize your restaurant with Qruzine\'s digital ordering and management system. Fresh, Fast, and Delicious!',
  metadataBase: new URL(SITE_URL),
  
  // OpenGraph metadata
  openGraph: {
    title: 'Qruzine - Digital Ordering System',
    description: 'Revolutionize your restaurant with Qruzine\'s digital ordering and management system.',
    url: SITE_URL,
    siteName: 'Qruzine',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Qruzine Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter metadata - simplified to minimum required fields
  twitter: {
    card: 'summary_large_image',
    title: 'Qruzine - Digital Ordering System',
    description: 'Revolutionize your restaurant with Qruzine\'s digital ordering system.',
    images: ['/images/logo.png']
  },
  
  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Other metadata
  manifest: '/site.webmanifest',
};

export default metadata;