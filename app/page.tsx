import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function B2BFrontDoor() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-[#f58a42] selection:text-white">
      
      {/* Background Image with Deep Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/LoginPage_SideImage.jpg" 
          alt="Ashok Jewels B2B Portal" 
          fill
          className="object-cover object-center opacity-60 scale-105 animate-in zoom-in duration-1000"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#2a0408]/90 mix-blend-multiply"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Brand Logo or Typography */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
          <Image 
            src="/logo.png" 
            alt="Ashok Jewels" 
            width={200} 
            height={60} 
            className="object-contain filter brightness-0 invert opacity-90" // Makes the logo white for the dark background
            priority
          />
        </div>

        {/* Hero Typography */}
        <h1 className="text-4xl md:text-6xl font-light text-white tracking-[0.1em] mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          Global Wholesale <br className="hidden md:block"/>
          <span className="font-semibold text-[#f58a42]">Partner Network.</span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 font-light tracking-wide max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          Exclusive access to real-time matrix pricing, bespoke manufacturing timelines, and secure Proforma generation. Strictly reserved for verified retail partners and distributors.
        </p>

        {/* Call to Action Button */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 fill-mode-both">
          <Link 
            href="/login"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-white hover:text-[#4e080f] transition-all duration-500 overflow-hidden rounded-none"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter Portal
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>

      </div>

      {/* Footer Details */}
      <div className="absolute bottom-8 w-full text-center z-10 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
        <p className="text-[10px] text-white/40 font-medium tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Ashok Jewels. Strictly Confidential.
        </p>
      </div>

    </div>
  );
}