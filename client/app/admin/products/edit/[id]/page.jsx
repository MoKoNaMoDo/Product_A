'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditProductPage({ params }) {
    const router = useRouter();
    const { id } = params;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',

        category: '',
        is_recommended: false
    });
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/categories`);
                setCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/products/${id}`);
                const { image_url, ...rest } = res.data;
                setFormData(rest);
                setCurrentImageUrl(image_url);
            } catch (error) {
                console.error(error);
                alert('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
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
        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);

            data.append('category', formData.category);
            data.append('is_recommended', formData.is_recommended);
            if (image) {
                data.append('image', image);
            }

            await axios.put(`${apiUrl}/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Product Updated Successfully!',
                timer: 2000,
                showConfirmButton: false
            });
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update product'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/products" className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" />
                Back to Products
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Product</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input name="name" value={formData.name || ''} required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description || ''} rows="3" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (THB)</label>
                            <input name="price" value={formData.price || ''} type="number" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />

                        {(imagePreview || currentImageUrl) && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">{imagePreview ? 'New Image Preview:' : 'Current Image:'}</p>
                                <img src={imagePreview || currentImageUrl} alt="Product" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_recommended"
                            id="is_recommended"
                            checked={formData.is_recommended || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_recommended" className="ml-2 block text-sm text-gray-900">
                            Show in Recommended Products (Homepage)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg mt-4 transition hover:bg-blue-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? 'Saving...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
