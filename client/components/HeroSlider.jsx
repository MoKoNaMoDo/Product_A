'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const defaultImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
];

export default function HeroSlider() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [settings, setSettings] = useState({
        home_title: 'สินค้าคุณภาพมาตรฐานสากล',
        home_subtitle: 'ค้นพบประสบการณ์ใหม่แห่งการเลือกซื้อสินค้า'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const [bannersRes, settingsRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/home-banners`),
                    axios.get(`${apiUrl}/api/site-settings`)
                ]);

                setBanners(bannersRes.data.length > 0 ? bannersRes.data : []);
                setSettings(prev => ({
                    ...prev,
                    home_title: settingsRes.data.home_title || prev.home_title,
                    home_subtitle: settingsRes.data.home_subtitle || prev.home_subtitle
                }));

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const displayImages = banners.length > 0 ? banners.map(b => b.image_url) : defaultImages;

    useEffect(() => {
        if (displayImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    if (loading) return <div className="h-[500px] bg-gray-900 animate-pulse"></div>;

    return (
        <div className="w-full h-[500px] overflow-hidden relative bg-gray-900 group">
            {/* Images */}
            {displayImages.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={src}
                        alt="Hero Slide"
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            ))}

            {/* Overlay Text */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-sarabun opacity-0 animate-fade-in-up" key={`text-title-${currentIndex}`}>
                    {settings.home_title}
                </h1>
                <div
                    className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-sarabun drop-shadow-md opacity-0 animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                    key={`text-sub-${currentIndex}`}
                    dangerouslySetInnerHTML={{ __html: settings.home_subtitle }}
                ></div>

                {/* Dots Indicator */}
                <div className="absolute bottom-8 flex gap-3">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                        ></button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
