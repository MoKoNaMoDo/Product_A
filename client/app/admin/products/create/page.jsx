'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            if (image) {
                data.append('image', image);
            }

            await axios.post(`${apiUrl}/api/products`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Product Created Successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/products" className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" />
                Back to Products
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Product</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input name="name" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="e.g. Wireless Headphones" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows="3" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Product details..."></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (THB)</label>
                            <input name="price" type="number" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input name="category" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="e.g. Electronics" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        {imagePreview && (
                            <div className="mt-4">
                                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg mt-4 transition hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
