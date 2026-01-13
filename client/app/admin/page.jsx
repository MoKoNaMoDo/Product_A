'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, ShoppingBag, Clock } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        visitCount: 0,
        productCount: 0,
        totalOrders: 0, // Placeholder
        activities: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/dashboard/stats`);
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Product Count */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.productCount}</p>
                    </div>
                </div>

                {/* Visit Count */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Visitors</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.visitCount}</p>
                    </div>
                </div>

                {/* Placeholder Stat */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Orders</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={20} className="text-gray-400" />
                        Recent Activity
                    </h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.activities && stats.activities.length > 0 ? (
                        stats.activities.map((log) => (
                            <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition">
                                <div className="mt-1">
                                    <span className={`inline-block w-2 H-2 rounded-full ${log.action.includes('CREATE') ? 'bg-green-500' :
                                            log.action.includes('UPDATE') ? 'bg-blue-500' :
                                                log.action.includes('DELETE') ? 'bg-red-500' : 'bg-gray-400'
                                        } w-2 h-2`}></span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{log.description}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Action: {log.action} • {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    )
}
