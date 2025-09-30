"use client";
import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="restaurant-main-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bronze-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-forest-700/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bronze-border text-text-light px-3 py-1 rounded-full text-xs tracking-wider uppercase">
              <Sparkles className="h-4 w-4 text-accent" />
              Enterprise QR Ordering
            </span>

            <h1 className="luxury-title text-4xl sm:text-5xl lg:text-6xl text-shadow-luxury">
              Vigyapanwala&apos;s Qruzine
            </h1>
            <p className="text-large elegant-text-muted max-w-xl">
              A complete QR-based ordering system for restaurants. Seamless table-side ordering, beautiful digital menus, and a powerful restaurant admin — without exposing any super admin layer.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/login" className="btn-primary">Get a Demo</a>
              <a href="#showcase" className="btn-secondary">See Screens</a>
            </div>

            <div className="flex gap-6 pt-4 text-sm modern-ui-text">
              <div>
                <span className="price-display">QR</span>
                <div className="text-forest-dark">Scan & Order</div>
              </div>
              <div>
                <span className="price-display">POS</span>
                <div className="text-forest-dark">Kitchen-Ready KOT</div>
              </div>
              <div>
                <span className="price-display">LIVE</span>
                <div className="text-forest-dark">Menu Updates</div>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl overflow-hidden shadow-luxury"
            style={{
              background:
                "linear-gradient(135deg, #7c2d12 0%, #6b2737 50%, #4a1a1a 100%)",
            }}
          >
            <Image
              src="/images/hero.jpeg"
              alt="Product hero"
              width={1600}
              height={750}
              priority
              className="w-full h-auto"
              sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
