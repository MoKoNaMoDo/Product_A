'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
];

export default function HeroSlider() {
    return (
        <div className="w-full h-[500px] overflow-hidden relative bg-gray-900 group">
            {/* Overlay Text */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-sarabun">
                    สินค้าคุณภาพมาตรฐานสากล
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-sarabun">
                    ค้นพบประสบการณ์ใหม่แห่งการเลือกซื้อสินค้า
                </p>
            </div>

            {/* Slider Container */}
            <div className="flex absolute top-0 left-0 h-full animate-scroll hover:pause">
                {/* Doubled images for seamless loop */}
                {[...images, ...images].map((src, idx) => (
                    <div key={idx} className="relative w-screen md:w-[80vw] h-full flex-shrink-0">
                        <Image
                            src={src}
                            alt="Hero Image"
                            fill
                            className="object-cover"
                            priority={idx < 2}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${images.length * 100}%); } 
          /* Note: logic depends on width units. For cleaner CSS we use tailwind arbitrary values in global or here. */
        }
        .animate-scroll {
             animation: scroll 40s linear infinite;
        }
        /* Mobile adjust */
        @media (min-width: 768px) {
             @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${images.length * 80}vw); }
            }
        }
      `}</style>
        </div>
    );
}
