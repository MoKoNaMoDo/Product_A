'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MessageCircle, Share2, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error('Failed to fetch product', err);
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product?.name,
                text: `Check out ${product?.name}`,
                url: window.location.href,
            });
        } catch (error) {
            console.log('Error sharing', error);
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบสินค้า</h1>
            <p className="text-gray-500 mb-6">ขออภัย สินค้าที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่จริง</p>
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                กลับสู่หน้าหลัก
            </Link>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-12 font-sarabun">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/products" className="flex items-center text-gray-500 hover:text-blue-600 transition">
                        <ChevronLeft size={20} />
                        <span className="ml-1">ย้อนกลับไปหน้ารวมสินค้า</span>
                    </Link>
                    {/* Share Button (Mobile friendly) */}
                    <button onClick={handleShare} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition md:hidden">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-12 md:gap-8">

                        {/* Left Column: Image Gallery */}
                        <div className="p-6 md:p-8 bg-white flex items-center justify-center bg-gray-50/50">
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Product Info */}
                        <div className="p-6 md:p-8 flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                                    {product.category || 'General'}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-sm text-gray-400">ID: {product.id}</p>
                            </div>

                            <div className="flex items-center mb-6">
                                <span className="text-3xl font-bold text-blue-600">
                                    ฿{Number(product.price).toLocaleString()}
                                </span>
                                {product.is_recommended && (
                                    <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        แนะนำ
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-slate mb-8 max-w-none text-gray-600 leading-relaxed">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">รายละเอียดสินค้า</h3>
                                <p>{product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto space-y-4">
                                <Link
                                    href={`/contact?subject=สอบถามสินค้า: ${encodeURIComponent(product.name)}`}
                                    className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                                >
                                    <MessageCircle className="group-hover:-translate-x-1 transition-transform" />
                                    <span>ติดต่อสอบถาม / สั่งซื้อ</span>
                                </Link>

                                <button
                                    onClick={handleShare}
                                    className="w-full bg-white text-gray-700 border border-gray-200 font-medium py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    แบ่งปันหน้านี้
                                </button>
                            </div>

                            {/* Additional Info / Trust Badges */}
                            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                                <div className="flex flex-col items-center p-2">
                                    <div className="bg-green-50 text-green-600 p-2 rounded-full mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">สินค้าคุณภาพ</span>
                                </div>
                                <div className="flex flex-col items-center p-2">
                                    <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-2">
                                        <MessageCircle size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">ให้คำปรึกษาฟรี</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
