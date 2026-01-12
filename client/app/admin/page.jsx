export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">124</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Active Products</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">110</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Views</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">1,024</p>
                </div>
            </div>
        </div>
    )
}
