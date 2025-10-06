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
    <section id="features" className="bg-[#FFFAFA] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: 'rgb(212, 175, 55)' }}>
          Built for Restaurants
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
          Qruzine is a full QR-based ordering product by Vigyapanwala, engineered for enterprise reliability and delightful dining experiences.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div 
              key={title} 
              className="p-5 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #800020 0%, #000000 100%)',
                borderColor: 'rgb(212, 175, 55)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="inline-flex items-center justify-center w-11 h-11 rounded-md"
                  style={{ backgroundColor: 'rgb(212, 175, 55)' }}
                >
                  <Icon className="text-black w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
                  <p className="text-sm text-gray-300">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}