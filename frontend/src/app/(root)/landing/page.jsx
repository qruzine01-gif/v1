import React from "react";
import { redirect } from 'next/navigation';
import Hero from "../../../components/landing/Hero";
import Features from "../../../components/landing/Features";
import ScreensShowcase from "../../../components/landing/ScreensShowcase";
import CTA from "../../../components/landing/CTA";
import Footer from "../../../components/landing/Footer";
import { siteConfig } from './metadata';

// Generate structured data for better SEO
const generateStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Qruzine',
  'url': siteConfig.url,
  'potentialAction': {
    '@type': 'SearchAction',
    'target': `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

// Build Twitter card configuration
const buildTwitterCard = () => {
  const twitterCard = {
    card: 'summary_large_image',
    title: 'Qruzine - Digital Ordering System for Restaurants',
    description: 'Transform your restaurant with our digital ordering system. Increase sales and improve efficiency.',
    images: ['/images/logo.png']
  };
  
  // Only add creator and site if they have values
  if (siteConfig?.twitter) {
    const twitterHandle = siteConfig.twitter.replace('@', '');
    if (twitterHandle) {
      twitterCard.creator = `@${twitterHandle}`;
      twitterCard.site = `@${twitterHandle}`;
    }
  }
  
  return twitterCard;
};

// Export metadata with proper Twitter card configuration
export const metadata = {
  title: 'Digital Ordering System for Restaurants | Qruzine',
  description: 'Transform your restaurant with Qruzine\'s digital ordering system. Increase sales, improve efficiency, and enhance customer experience.',
  keywords: ['restaurant ordering system', 'digital menu', 'online ordering', 'restaurant management', 'QSR software'],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: 'Qruzine - Digital Ordering System for Restaurants',
    description: 'Transform your restaurant with our digital ordering system. Increase sales and improve efficiency.',
    url: siteConfig.url,
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
  twitter: buildTwitterCard()
};

export default function LandingPage() {
  redirect('/');
}