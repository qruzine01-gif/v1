"use client";
import React from "react";
import { ShieldCheck, QrCode, UtensilsCrossed, LayoutDashboard, Smartphone, Printer } from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR-first Ordering",
    desc: "Scan on the table, browse the live menu, and order in seconds.",
  },
  {
    icon: LayoutDashboard,
    title: "Restaurant Admin",
    desc: "Manage categories, items, pricing, availability, and KOTs.",
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchen-ready KOT",
    desc: "Optimized order tickets to keep the kitchen flowing.",
  },
  {
    icon: Smartphone,
    title: "Responsive UX",
    desc: "Beautiful on mobile and desktop — designed for speed.",
  },
  {
    icon: Printer,
    title: "Thermal Printer",
    desc: "Optional thermal printer support for KOT/Bill prints.",
  },
  {
    icon: ShieldCheck,
    title: "Role Scoped",
    desc: "No super admin exposure. Restaurant-only admin included.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background-primary/10 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="heading-2 restaurant-gradient-text-strong text-outline-dark mb-2">Built for Restaurants</h2>
        <p className="elegant-text-muted max-w-2xl mb-10">
          Qruzine is a full QR-based ordering product by Vigyapanwala, engineered for enterprise reliability and delightful dining experiences.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="menu-item-card p-5 hover:shadow-luxury">
              <div className="flex items-start gap-4">
                <div className="bronze-bg inline-flex items-center justify-center w-11 h-11 rounded-md">
                  <Icon className="text-forest-dark" />
                </div>
                <div>
                  <h3 className="heading-4 mb-1">{title}</h3>
                  <p className="text-small elegant-text-muted">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

