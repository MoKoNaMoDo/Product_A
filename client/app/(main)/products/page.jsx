'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/products`);

                if (response.status === 200) {
                    setProducts(response.data);
                    setStatus(200);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                if (err.response) {
                    setStatus(err.response.status);
                } else {
                    setStatus('Network Error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 flex flex-col items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-md text-center" role="alert">
                    <strong className="font-bold">Error Occurred!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <span className="block text-sm mt-2">Status Code: {status}</span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-sarabun">สินค้าทั้งหมด (All Products)</h1>
                    <p className="text-gray-500 mt-2">เลือกชมสินค้าคุณภาพที่เราคัดสรรมาเพื่อคุณ</p>
                </div>

                {/* Filters (Mock) */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {['All', 'Electronics', 'Furniture', 'Clothing'].map((cat) => (
                        <button key={cat} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-colors whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((item) => (
                            <Link key={item.id} href={`/products/${item.id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-[4/3] bg-gray-200 relative">
                                    {/* Placeholder for real image since backend might not have image URL yet */}
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-bold text-lg text-primary-600">฿ {item.price}</span>
                                        <span className="text-xs text-gray-400">In Stock: {item.stock_quantity}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
