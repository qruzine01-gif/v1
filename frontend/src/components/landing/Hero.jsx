"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, QrCode, Tablet, RotateCcw, LogIn } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFAFA]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)' }} />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(128, 0, 32, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      {/* Top-left Logo - Visible across all breakpoints */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/logo.png"
            alt="Qruzine Logo"
            width={140}
            height={40}
            priority
            className="h-8 w-auto sm:h-10 md:h-12 drop-shadow-md"
            sizes="(min-width: 1024px) 12rem, (min-width: 640px) 10rem, 8rem"
          />
        </Link>
      </div>

      {/* Restaurant Owner Button - Visible across all breakpoints */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
        <Link 
          href="/login" 
          className="group flex items-center gap-2 px-4 py-2 backdrop-blur-sm border-2 rounded-full text-sm font-medium transition-colors duration-200"
          style={{ 
            backgroundColor: 'rgba(255, 250, 250, 0.9)',
            borderColor: 'rgb(212, 175, 55)',
            color: 'rgb(55, 65, 81)'
          }}
        >
          <span>Restaurant Owner</span>
          <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-2 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide mx-auto lg:mx-0 border-2"
              style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgb(212, 175, 55)',
                color: 'rgb(128, 0, 32)'
              }}
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 vw-anim"  />
               QR Ordering System
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              <span className="block">Vigyapanwala's</span>
              <span className="block mt-2" style={{ color: 'rgb(212, 175, 55)' }}>Qruzine Platform</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <span className="block text-xl sm:text-2xl font-medium mb-3" style={{ color: 'rgb(128, 0, 32)' }}>
                Served you connected by you.
              </span>
              Transform your restaurant operations with our all-in-one digital ordering solution. 
              Streamline table service, enhance customer experience, and boost efficiency with 
              our enterprise-grade QR ordering and kitchen management system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <a 
                href="/login" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg text-white transition-colors duration-200 shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #800020 0%, #000000 100%)',
                  borderColor: 'rgb(212, 175, 55)'
                }}
              >
                Request Demo
              </a>
              <a 
                href="#showcase" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg transition-colors duration-200"
                style={{ 
                  borderColor: 'rgb(212, 175, 55)',
                  color: 'rgb(55, 65, 81)',
                  backgroundColor: 'white'
                }}
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
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-2 border-2"
                    style={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      borderColor: 'rgb(212, 175, 55)'
                    }}
                  >
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'rgb(212, 175, 55)' }} />
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-medium text-gray-900">{item.title}</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform lg:translate-x-6 border-2"
              style={{ borderColor: 'rgb(212, 175, 55)' }}
            >
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(212, 175, 55, 0.1), rgba(128, 0, 32, 0.05))' }} />
              <Image
                src="/images/heroo.png"
                alt="Qruzine Platform Dashboard"
                width={800}
                height={600}
                priority
                className="w-full h-auto"
                sizes="(min-width: 1280px) 50vw, 100vw"
              />
              
            </div>
            
            {/* Decorative elements */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-xl -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
            <div className="hidden lg:block absolute -top-6 -right-6 w-40 h-40 rounded-full blur-xl -z-10" style={{ backgroundColor: 'rgba(128, 0, 32, 0.15)' }} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .vw-anim {
          background: linear-gradient(90deg,
            #a67c00 0%,
            #d4af37 20%,
            #fff1a8 40%,
            #d4af37 60%,
            #8b6b00 80%,
            #d4af37 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: vw-shimmer 4s ease-in-out infinite;
          text-decoration-color: rgba(212,175,55,0.9);
          filter: drop-shadow(0 0 1px rgba(212,175,55,0.45));
          letter-spacing: 0.2px;
        }

        .vw-anim:hover {
          filter: drop-shadow(0 0 3px rgba(212,175,55,0.65));
        }

        @keyframes vw-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vw-anim { animation: none; background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}