import Link from 'next/link';

export default function ProductsPage() {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Link key={item} href={`/products/${item}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Product Image {item}</div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Product Name {item}</h3>
                                <p className="text-sm text-gray-500 mt-1">Short description...</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="font-bold text-lg text-primary-600">฿ 1,290</span>
                                    <span className="text-xs text-gray-400">In Stock</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
