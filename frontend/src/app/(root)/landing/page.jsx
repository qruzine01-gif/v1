import React from "react";
import Hero from "../../../components/landing/Hero";
import Features from "../../../components/landing/Features";
import ScreensShowcase from "../../../components/landing/ScreensShowcase";
import CTA from "../../../components/landing/CTA";
import Footer from "../../../components/landing/Footer";

export const metadata = {
  title: "Qruzine | Enterprise QR Ordering by Vigyapanwala",
  description:
    "Enterprise-grade QR-based ordering system for restaurants. Showcasing Restaurant Admin and Menu screens.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background-primary/5">
      <Hero />
      <Features />
      <ScreensShowcase />
      <CTA />
      <Footer />
    </main>
  );
}
