"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { gsap } from "gsap";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800"] });

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const zentrixRef = useRef(null);

  useEffect(() => {
    gsap.to(zentrixRef.current, {
      backgroundPositionX: "200%",
      duration: 6,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  const footerLinks = [
    {
      title: "Owner Details",
      links: [
        { name: "Ashutosh Kumar Singh", className: "font-medium text-white" },
        {
          name: "Radhika Mansion Rd, M. P Bagh",
          icon: <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />,
          className: "flex items-start",
        },
        { name: "Arrah, Bihar 802301", className: "flex items-start" },
        {
          name: "+91 8210334312",
          href: "tel:+918210334312",
          icon: <Phone className="h-4 w-4 mr-2" />,
          className: "flex items-center mt-2",
        },
        {
          name: "Visit Website",
          href: "https://www.vigyapanwala.com/",
          icon: <Globe className="h-4 w-4 mr-2" />,
          className:
            "flex items-center mt-1 hover:text-bronze-400 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "/landing/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/landing/privacy" },
        { name: "Terms of Service", href: "/landing/terms" },
        { name: "Cookie Policy", href: "/landing/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-forest-900 text-gray-300 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="modern-ui-text flex items-baseline gap-2">
              <span
                className={`${playfair.className} restaurant-gradient-text-strong text-outline-dark text-3xl md:text-4xl font-extrabold tracking-wide`}
              >
                Qruzine
              </span>
              <span className="restaurant-gradient-text-strong text-outline-dark text-sm md:text-base font-semibold">
                by Vigyapanwala
              </span>
            </div>
            <p className="font-medium leading-relaxed">
              <span className="block text-white font-bold text-lg mb-1">
                Built for Restaurants
              </span>
              <span className="elegant-text-muted">
                Qruzine is a full QR-based ordering product by Vigyapanwala,
                engineered for enterprise reliability and delightful dining
                experiences.
              </span>
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-bronze-400 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-bronze-400 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-bronze-400 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className={`text-gray-400 hover:text-bronze-400 transition-colors flex items-center ${
                          link.className || ""
                        }`}
                        target={link.target}
                        rel={link.rel}
                      >
                        {link.icon || null}
                        <span className={link.icon ? "mt-0.5" : ""}>
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <div
                        className={`text-gray-400 flex items-center ${
                          link.className || ""
                        }`}
                      >
                        {link.icon || null}
                        <span className={link.icon ? "mt-0.5" : ""}>
                          {link.name}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Qruzine by Vigyapanwala. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link
                href="/landing/privacy"
                className="text-sm text-gray-400 hover:text-bronze-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/landing/terms"
                className="text-sm text-gray-400 hover:text-bronze-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/landing/privacy"
                className="text-sm text-gray-400 hover:text-bronze-400 transition-colors"
              >
                Cookie Policy
              </Link>
              <span className="text-sm text-gray-400 border border-gray-700 rounded-full px-3 py-1 leading-none">
                Made by{" "}
                <span
                  ref={zentrixRef}
                  className="bg-[linear-gradient(90deg,#1E3A8A,#2563EB,#3B82F6,#06B6D4,#14B8A6,#0EA5E9,#2563EB,#1E3A8A)] bg-[length:200%_auto] text-transparent bg-clip-text font-semibold"
                >
                  Zentrix
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
