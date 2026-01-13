import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100 font-sarabun">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
                        Products
                    </Link>
                    <Link href="/admin/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
                        Site Settings
                    </Link>
                    <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 text-gray-400 hover:text-white mt-12 border-t border-slate-700">
                        ← Back to Site
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
