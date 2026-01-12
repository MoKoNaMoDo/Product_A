import Navbar from '@/components/Navbar';

export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    <p>© 2024 Product Catalog. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
