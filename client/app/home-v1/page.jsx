import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            {/* Hero Section */}
            <section className="w-full h-[80vh] bg-primary-50 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-500 opacity-10 animate-pulse"></div>
                <div className="z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-primary-900 mb-6 drop-shadow-sm font-sarabun">
                        สินค้าคุณภาพเพื่อคุณ
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-sarabun">
                        Discover our premium collection designed for your lifestyle.
                    </p>
                    <Link
                        href="/products"
                        className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl"
                    >
                        ดูสินค้าทั้งหมด
                    </Link>
                </div>
            </section>

            {/* Featured Products (Placeholder) */}
            <section className="w-full py-20 px-4 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center font-sarabun">สินค้าแนะนำ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Product Card Placeholder */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="group relative border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-square bg-gray-200 w-full relative">
                                    {/* Image placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">Image {item}</div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Name {item}</h3>
                                    <p className="text-gray-500 mb-4">Short description of the product.</p>
                                    <span className="text-lg font-bold text-primary-600">฿ 1,290</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
