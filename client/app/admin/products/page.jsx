'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/products`);
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRecommended = async (product) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            // Optimistic update
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, is_recommended: !product.is_recommended } : p
            ));

            await axios.put(`${apiUrl}/api/products/${product.id}`, {
                ...product,
                is_recommended: !product.is_recommended
            });

            // Optional: Silent success or small toast
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: !product.is_recommended ? 'Added to Recommended' : 'Removed from Recommended'
            });

        } catch (error) {
            console.error('Failed to toggle', error);
            // Revert on error
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, is_recommended: product.is_recommended } : p
            ));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update status'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                await axios.delete(`${apiUrl}/api/products/${id}`);
                fetchProducts();
                Swal.fire(
                    'Deleted!',
                    'Your product has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Failed to delete', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete product'
                });
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
                <Link
                    href="/admin/products/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                >
                    <Plus size={20} />
                    Add New Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${product.image_url})` }}></div>
                                </td>
                                <td className="p-4 cursor-pointer font-medium text-slate-700">{product.name}</td>
                                <td className="p-4 text-gray-500">{product.category}</td>
                                <td className="p-4 font-semibold text-slate-800">฿{product.price}</td>
                                <td className="p-4 text-center cursor-pointer" onClick={() => toggleRecommended(product)}>
                                    {product.is_recommended ? (
                                        <Star size={20} className="inline text-yellow-500 fill-yellow-500 hover:scale-110 transition-transform" />
                                    ) : (
                                        <Star size={20} className="inline text-gray-300 hover:text-yellow-400 transition-colors" />
                                    )}
                                </td>
                                <td className="p-4 flex justify-center gap-2">
                                    <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No products found. Add one to get started.</div>
                )}
            </div>
        </div>
    );
}
