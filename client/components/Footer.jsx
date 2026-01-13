'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Footer() {
    const [title, setTitle] = useState('Product Catalog');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/site-settings`);
                if (res.data.site_title) {
                    setTitle(res.data.site_title);
                }
            } catch (error) {
                console.error('Failed to fetch site settings', error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-white border-t border-gray-100 py-12 font-sarabun">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                <p>© {new Date().getFullYear()} {title}. All rights reserved.</p>
            </div>
        </footer>
    );
}
