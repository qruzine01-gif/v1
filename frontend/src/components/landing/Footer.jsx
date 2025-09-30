"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-forest-gradient text-text-light">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="modern-ui-text">
            <span className="restaurant-name text-2xl">Qruzine</span>
            <span className="ml-3 bronze-accent">by Vigyapanwala</span>
          </div>
          <div className="text-small elegant-text-muted">
            © {new Date().getFullYear()} Vigyapanwala. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
