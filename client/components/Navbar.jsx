'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [settings, setSettings] = useState({
        site_title: 'Catalog',
        site_logo: '',
        show_logo: 'true'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/site-settings`);
                setSettings(prev => ({ ...prev, ...res.data }));
            } catch (error) {
                console.error('Failed to fetch site settings', error);
            }
        };
        fetchSettings();
    }, [pathname]);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 font-sarabun">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        {settings.site_logo && settings.show_logo === 'true' ? (
                            <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                                <Image src={settings.site_logo} alt="Logo" fill className="object-contain" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {settings.site_title.charAt(0) || 'C'}
                            </div>
                        )}
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            {settings.site_title || 'Catalog'}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/products" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            Products
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            About Us
                        </Link>
                        <Link href="/contact" className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-sm hover:shadow-md font-medium">
                            Contact Us
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
