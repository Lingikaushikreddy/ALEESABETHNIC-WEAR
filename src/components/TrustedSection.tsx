'use client'

import React from 'react'
import Image from 'next/image'

const TrustedSection = () => {
  // Brand logos - using placeholders for now as the uploaded image was missing
  // Ideally, this would be a single sprite or multiple images
  const logos = [
    '/trusted/logo-1.jpg',
    '/trusted/logo-2.png',
    '/trusted/logo-3.jpg',
    '/trusted/logo-4.jpg',
    '/trusted/logo-5.jpg',
    '/trusted/logo-1.jpg', // Repeat to ensure smooth scrolling
    '/trusted/logo-2.png',
    '/trusted/logo-3.jpg',
    '/trusted/logo-4.jpg',
    '/trusted/logo-5.jpg',
  ]

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px bg-gray-300 w-12 md:w-24"></div>
          <span className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Trusted to millions of customers worldwide</span>
          <div className="h-px bg-gray-300 w-12 md:w-24"></div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {/* First set of logos */}
          <div className="flex min-w-full shrink-0 justify-around items-center gap-8 md:gap-16 px-4 md:px-8">
            {logos.map((logo, index) => (
              <div key={`logo-1-${index}`} className="relative h-12 w-24 md:h-16 md:w-32 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Image
                  src={logo}
                  alt={`Trusted Brand ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Duplicate set for infinite scroll */}
          <div className="flex min-w-full shrink-0 justify-around items-center gap-8 md:gap-16 px-4 md:px-8">
            {logos.map((logo, index) => (
              <div key={`logo-2-${index}`} className="relative h-12 w-24 md:h-16 md:w-32 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Image
                  src={logo}
                  alt={`Trusted Brand ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedSection
