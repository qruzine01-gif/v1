"use client";
import React from "react";

export default function CTA() {
  return (
    <section className="py-20 bg-burgundy-gradient text-text-light">
      <div className="mx-auto max-w-7xl px-6">
        <div className="content-panel p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="heading-2">Ready to modernize your ordering?</h2>
            <p className="text-large elegant-text-muted mt-3">
              Launch a QR-first menu and a powerful restaurant admin with Qruzine by Vigyapanwala.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <a href="/login" className="btn-primary">Book a Demo</a>
            <a href="#showcase" className="btn-secondary">View Screens</a>
          </div>
        </div>
      </div>
    </section>
  );
}
