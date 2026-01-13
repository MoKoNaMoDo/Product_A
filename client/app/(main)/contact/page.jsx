'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useSearchParams } from 'next/navigation';



export default function ContactPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/site-settings`);
                setSettings(res.data);
            } catch (error) {
                console.error('Failed to fetch settings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        const subjectParam = searchParams.get('subject');
        if (subjectParam) {
            setFormData(prev => ({ ...prev, subject: subjectParam }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/contact`, formData);

            Swal.fire({
                icon: 'success',
                title: 'Sent!',
                text: 'Your message has been sent successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send message. Please try again.'
            });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    {/* Optional: Add a subtle pattern or reusing hero image if available */}
                    {settings?.hero_image && <Image src={settings.hero_image} alt="" fill className="object-cover" />}
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sarabun">
                        {settings?.contact_title || 'ติดต่อเรา'}
                    </h1>
                    <div
                        className="text-xl text-gray-300 font-sarabun"
                        dangerouslySetInnerHTML={{ __html: settings?.contact_subtitle || 'เราพร้อมให้คำปรึกษาและบริการคุณ' }}
                    ></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Address */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">ที่อยู่</h3>
                                <div
                                    className="text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: settings?.contact_address || 'ยังไม่มีข้อมูลที่อยู่' }}
                                ></div>
                            </div>
                        </div>

                        {/* Phone & Email */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-2">เบอร์โทรศัพท์</h3>
                                <p className="text-gray-600 mb-4">{settings?.contact_phone || '-'}</p>

                                <div className="border-t pt-4 mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="font-bold text-gray-800">อีเมล</h3>
                                    </div>
                                    <p className="text-gray-600">{settings?.contact_email || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">ช่องทางออนไลน์</h3>
                            <div className="space-y-3">
                                {settings?.social_facebook && (
                                    <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                        <span className="font-medium">Facebook Page</span>
                                    </a>
                                )}
                                {settings?.social_line && (
                                    <a href={settings.social_line} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 4.02C7.302 4.02 3.5 7.065 3.5 10.81c0 3.393 3.09 6.223 7.07 6.69 0.278 0.06 0.655 0.187 0.773 0.428 0.088 0.178 0.057 0.457 0.033 0.638 -0.07 0.528 -0.45 1.74 -0.627 2.378 -0.198 0.713 -0.527 1.83 2.126 0.99 3.037 -0.963 8.163 -2.71 11.127 -7.508 1.488 -2.406 0.922 -5.733 0.922 -5.733 -0.46 -2.49 -2.572 -4.673 -5.336 -4.673H12V4.02zM12.016 13.918h-1.63v-3.87H8.848v3.87H7.218V7.79h1.63v2.79h1.538V7.79h1.63V13.918zM14.73 13.918h-1.628V7.79h1.63V13.918zM18.89 13.918h-1.464l-2.31 -3.176 v3.176h-1.45V7.79h1.465 l2.308 3.16V7.79h1.45v6.128z" /></svg>
                                        <span className="font-medium">Add Line Friend</span>
                                    </a>
                                )}
                                {!settings?.social_facebook && !settings?.social_line && (
                                    <p className="text-gray-400 text-sm">ยังไม่ได้ระช่องทางโซเชียลมีเดีย</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sarabun">ส่งข้อความถึงเรา</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ - นามสกุล</label>
                                        <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุชื่อของคุณ" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุเบอร์โทรศัพท์" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                                    <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="example@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อติดต่อ</label>
                                    <input name="subject" value={formData.subject} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุหัวข้อเรื่อง" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="พิมพ์ข้อความของคุณที่นี่..."></textarea>
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg w-full md:w-auto">
                                    ส่งข้อความ
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
