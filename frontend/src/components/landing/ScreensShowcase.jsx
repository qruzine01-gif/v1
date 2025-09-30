"use client";
import React from "react";
import Image from "next/image";

export default function ScreensShowcase() {
  const adminShots = [
    { src: "/Advertisment.jpg", alt: "Admin dashboard" },
    { src: "/Advertisment.jpg", alt: "Manage menu categories" },
    { src: "/Advertisment.jpg", alt: "Orders & KOT" },
  ];
  const menuShots = [
    { src: "/Advertisment.jpg", alt: "Menu home" },
    { src: "/Advertisment.jpg", alt: "Item details" },
    { src: "/Advertisment.jpg", alt: "Cart & checkout" },
  ];

  return (
    <section id="showcase" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="heading-2 bronze-accent mb-2">Screens Showcase</h2>
        <p className="elegant-text-muted mb-10 max-w-2xl">
          Six slots reserved: three for the Restaurant Admin and three for the customer-facing Menu. Replace the placeholders with your real screenshots in `public/`.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="menu-category-title">Restaurant Admin</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {adminShots.map((shot, i) => (
                <div key={i} className="menu-item-card p-2">
                  <Image 
                    src={shot.src}
                    alt={shot.alt}
                    width={800}
                    height={600}
                    className="w-full h-52 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="menu-category-title">Menu Screens</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {menuShots.map((shot, i) => (
                <div key={i} className="menu-item-card p-2">
                  <Image 
                    src={shot.src}
                    alt={shot.alt}
                    width={800}
                    height={600}
                    className="w-full h-52 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
