'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import HeroSlider from '@/components/HeroSlider';

export default function Home() {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/products`);
                const recommended = res.data.filter(p => p.is_recommended);
                setRecommendedProducts(recommended);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            {/* Hero Section */}
            <HeroSlider />

            {/* Featured Products */}
            <section className="w-full py-20 px-4 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center font-sarabun">สินค้าแนะนำ</h2>

                    {loading ? (
                        <div className="text-center text-gray-500">Loading products...</div>
                    ) : recommendedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recommendedProducts.map((product) => (
                                <Link key={product.id} href={`/products/${product.id}`} className="group relative border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white flex flex-col h-full cursor-pointer">
                                    <div className="aspect-square bg-gray-50 w-full relative overflow-hidden">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                                No Image
                                            </div>
                                        )}
                                        {/* Overlay for quick action */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                ดูรายละเอียด
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-sarabun line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 mb-4 text-sm line-clamp-2 flex-grow font-sarabun">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-lg font-bold text-blue-600">฿{Number(product.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl">
                            <p>ยังไม่มีสินค้าแนะนำในขณะนี้</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
