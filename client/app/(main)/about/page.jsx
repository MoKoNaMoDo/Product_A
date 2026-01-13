'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function AboutPage() {
    const [settings, setSettings] = useState(null);
    const [coreValues, setCoreValues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const [settingsRes, valuesRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/site-settings`),
                    axios.get(`${apiUrl}/api/core-values`)
                ]);
                setSettings(settingsRes.data);
                const visibleValues = valuesRes.data.filter(val => val.is_visible !== false);
                setCoreValues(visibleValues);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                {settings?.hero_image && (
                    <div className="absolute inset-0 z-0">
                        <Image src={settings.hero_image} alt="About Hero" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                    </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90 z-10 ${settings?.hero_image ? 'hidden' : ''}`}></div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-sarabun text-white drop-shadow-md">
                        {settings?.about_hero_title || (settings?.site_title ? `About ${settings.site_title}` : 'เกี่ยวกับเรา')}
                    </h1>
                    <div
                        className="text-lg md:text-xl text-gray-200 font-sarabun max-w-2xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: settings?.about_hero_subtitle || 'มุ่งมั่นนำเสนอสินค้าคุณภาพเยี่ยม เพื่อตอบโจทย์ทุกไลฟ์สไตล์ของคุณ ด้วยความใส่ใจและบริการที่เป็นเลิศ' }}
                    ></div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
                            {settings?.about_image ? (
                                <Image src={settings.about_image} alt="About Us" fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                    <span className="font-semibold text-lg">Our Office / Team Photo</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-sarabun">
                                {settings?.about_title || 'เรื่องราวของเรา'}
                            </h2>
                            <div
                                className="text-gray-600 text-lg mb-6 leading-relaxed font-sarabun rich-text-content"
                                dangerouslySetInnerHTML={{ __html: settings?.about_us || 'ก่อตั้งขึ้นด้วยความตั้งใจที่จะรวบรวมสินค้าที่มีคุณภาพ...' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sarabun">
                            {settings?.core_values_title || 'ค่านิยมของเรา'}
                        </h2>
                        <div
                            className="text-gray-600 max-w-2xl mx-auto font-sarabun"
                            dangerouslySetInnerHTML={{ __html: settings?.core_values_subtitle || 'สิ่งที่เรายึดมั่นในการดำเนินงาน เพื่อส่งมอบสิ่งที่ดีที่สุดให้กับคุณ' }}
                        ></div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative">
                        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {coreValues.length > 0 ? (
                                coreValues.map((val) => (
                                    <div key={val.id} className="min-w-[280px] md:min-w-[320px] bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow snap-start flex-shrink-0 border border-gray-100">
                                        <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
                                            {val.image_url ? (
                                                <Image src={val.image_url} alt={val.title} fill className="object-cover" />
                                            ) : (
                                                <div className="text-primary-600 font-bold text-xl">{val.title.charAt(0)}</div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-sarabun">{val.title}</h3>
                                        <div
                                            className="text-gray-600 font-sarabun min-h-[4.5rem]"
                                            dangerouslySetInnerHTML={{ __html: val.description }}
                                        ></div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full w-full text-center text-gray-500 py-8">
                                    ยังไม่มีข้อมูลค่านิยม
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
