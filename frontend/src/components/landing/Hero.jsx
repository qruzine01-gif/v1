"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, QrCode, Tablet, RotateCcw, LogIn } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="restaurant-main-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-bronze-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full bg-forest-700/20 blur-3xl" />
      </div>

      {/* Restaurant Owner Button - Hidden on smallest screens, visible from sm breakpoint */}
      <div className="hidden sm:block absolute top-6 right-6 z-10">
        <Link 
          href="/login" 
          className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors duration-200"
        >
          <span>Restaurant Owner</span>
          <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      {/* Mobile-friendly button - visible only on small screens */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Link 
          href="/login" 
          className="flex items-center justify-center w-14 h-14 rounded-full bg-bronze-600 text-white shadow-lg hover:bg-bronze-700 transition-colors duration-200"
          aria-label="Restaurant Owner Login"
        >
          <LogIn className="h-6 w-6" />
        </Link>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide mx-auto lg:mx-0">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
              Enterprise QR Ordering System
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Vigyapanwala's</span>
              <span className="text-bronze-400 block mt-2">Qruzine Platform</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <span className="block text-xl sm:text-2xl text-bronze-300 font-medium mb-3">Served you connected by you.</span>
              Transform your restaurant operations with our all-in-one digital ordering solution. 
              Streamline table service, enhance customer experience, and boost efficiency with 
              our enterprise-grade QR ordering and kitchen management system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <a 
                href="/login" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-bronze-600 hover:bg-bronze-700 transition-colors duration-200 shadow-lg"
              >
                Request Demo
              </a>
              <a 
                href="#showcase" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-white bg-white/5 hover:bg-white/10 transition-colors duration-200"
              >
                View Features
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 pt-6 sm:pt-8 max-w-md mx-auto lg:mx-0">
              {[
                { icon: QrCode, title: 'QR Ordering', desc: 'Contactless Menu Access' },
                { icon: Tablet, title: 'POS Integration', desc: 'Seamless KOT Flow' },
                { icon: RotateCcw, title: 'Live Updates', desc: 'Real-time Sync' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 mb-2">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-bronze-400" />
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-medium text-white">{item.title}</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-300">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform lg:translate-x-6">
              <div className="absolute inset-0 bg-gradient-to-br from-bronze-900/30 to-forest-900/30" />
              <Image
                src="/images/hero.jpeg"
                alt="Qruzine Platform Dashboard"
                width={800}
                height={600}
                priority
                className="w-full h-auto"
                sizes="(min-width: 1280px) 50vw, 100vw"
              />
              
            </div>
            
            {/* Decorative elements */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-bronze-500/20 blur-xl -z-10" />
            <div className="hidden lg:block absolute -top-6 -right-6 w-40 h-40 rounded-full bg-forest-600/20 blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
