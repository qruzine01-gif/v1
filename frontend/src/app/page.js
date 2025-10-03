import React from 'react';
import { Layout } from '../components/layout/Layout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ScreensShowcase from '../components/landing/ScreensShowcase';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import { siteConfig } from './(root)/landing/metadata';

export const metadata = {
  title: 'Digital Ordering System for Restaurants | Qruzine',
  description: "Transform your restaurant with Qruzine's digital ordering system. Increase sales, improve efficiency, and enhance customer experience.",
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
  twitter: {
    card: 'summary_large_image',
    title: 'Qruzine - Digital Ordering System for Restaurants',
    description: 'Transform your restaurant with our digital ordering system. Increase sales and improve efficiency.',
    images: ['/images/logo.png'],
  },
};

export default function Page() {
  return (
    <Layout>
      <main className="min-h-screen bg-background-primary/5">
        <Hero />
        <Features />
        <ScreensShowcase />
        <CTA />
        {/* Anchors for footer quick links */}
        <div id="pricing" className="h-0" aria-hidden="true" />
        <div id="contact" className="h-0" aria-hidden="true" />
        <Footer />
      </main>
    </Layout>
  );
}