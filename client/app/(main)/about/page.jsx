import Image from 'next/image';

export const metadata = {
    title: 'About Us | My Awesome Catalog',
    description: 'Learn more about our story and values.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90 z-10"></div>
                {/* Abstract background pattern/image could go here */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-sarabun text-white drop-shadow-md">
                        เกี่ยวกับเรา
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 font-sarabun max-w-2xl mx-auto">
                        มุ่งมั่นนำเสนอสินค้าคุณภาพเยี่ยม เพื่อตอบโจทย์ทุกไลฟ์สไตล์ของคุณ ด้วยความใส่ใจและบริการที่เป็นเลิศ
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                <span className="font-semibold text-lg">Our Office / Team Photo</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-sarabun">เรื่องราวของเรา</h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed font-sarabun">
                                ก่อตั้งขึ้นด้วยความตั้งใจที่จะรวบรวมสินค้าที่มีคุณภาพและมีเอกลักษณ์จากทั่วทุกมุมโลก มาให้คุณได้เลือกสรร เราเชื่อว่าสินค้าที่ดีไม่ใช่แค่ของใช้ แต่เป็นส่วนหนึ่งที่ช่วยเติมเต็มความสุขและไลฟ์สไตล์ให้กับผู้ใช้งาน
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed font-sarabun">
                                ตลอดระยะเวลาที่ผ่านมา เรามุ่งมั่นพัฒนาการบริการและคัดสรรสินค้าอย่างพิถีพิถัน เพื่อให้มั่นใจว่าลูกค้าทุกคนจะได้รับประสบการณ์ที่ดีที่สุดจากเรา
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sarabun">ค่านิยมของเรา</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto font-sarabun">
                            สิ่งที่เรายึดมั่นในการดำเนินงาน เพื่อส่งมอบสิ่งที่ดีที่สุดให้กับคุณ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-sarabun">คุณภาพ (Quality)</h3>
                            <p className="text-gray-600 font-sarabun">
                                เราคัดสรรเฉพาะสินค้าที่มีคุณภาพสูง ทนทาน และใช้งานได้จริง เพื่อความคุ้มค่าสูงสุดของคุณ
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-sarabun">ความซื่อสัตย์ (Integrity)</h3>
                            <p className="text-gray-600 font-sarabun">
                                เราดำเนินธุรกิจด้วยความโปร่งใส จริงใจ และเป็นธรรมต่อลูกค้าและคู่ค้าทุกฝ่าย
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-sarabun">นวัตกรรม (Innovation)</h3>
                            <p className="text-gray-600 font-sarabun">
                                เราไม่หยุดที่จะเรียนรู้และหาสิ่งใหม่ๆ เพื่อนำเสนอประสบการณ์ที่ดียิ่งขึ้นอยู่เสมอ
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
