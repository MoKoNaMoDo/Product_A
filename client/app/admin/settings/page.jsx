'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import RichTextEditor from '@/components/RichTextEditor';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState({
        site_title: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        social_facebook: '',
        social_line: '',
        contact_title: '',
        contact_subtitle: '',
        home_title: '',
        home_subtitle: '',
        about_title: '',
        about_hero_title: '',
        about_hero_title: '',
        about_hero_subtitle: '',
        about_us: '',
        core_values_title: '',
        core_values_subtitle: '',
        show_logo: 'true'
    });
    const [heroImage, setHeroImage] = useState(null);
    const [aboutImage, setAboutImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [currentImages, setCurrentImages] = useState({ hero: '', about: '', logo: '' });
    const [previews, setPreviews] = useState({ hero: '', about: '', logo: '' });

    // Core Values State
    const [coreValues, setCoreValues] = useState([]);
    const [banners, setBanners] = useState([]); // Home Banners
    const [newValue, setNewValue] = useState({ title: '', description: '', is_visible: true });
    const [newValueImage, setNewValueImage] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('general');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/site-settings`);
            // Merge defaults in case some keys are missing
            const { hero_image, about_image, site_logo, ...rest } = res.data;
            setSettings(prev => ({ ...prev, ...rest }));
            setCurrentImages({ hero: hero_image, about: about_image, logo: site_logo });

            // Fetch Core Values
            // Fetch Core Values
            const valuesRes = await axios.get(`${apiUrl}/api/core-values`);
            setCoreValues(valuesRes.data);

            // Fetch Home Banners
            const bannersRes = await axios.get(`${apiUrl}/api/home-banners`);
            setBanners(bannersRes.data);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked.toString() : e.target.value;
        setSettings({ ...settings, [e.target.name]: value });
    };

    const handleRichTextChange = (name, value) => {
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'hero') {
                setHeroImage(file);
                setPreviews(prev => ({ ...prev, hero: URL.createObjectURL(file) }));
            } else if (type === 'about') {
                setAboutImage(file);
                setPreviews(prev => ({ ...prev, about: URL.createObjectURL(file) }));
            } else if (type === 'logo') {
                setLogoImage(file);
                setPreviews(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
            } else if (type === 'newValue') {
                setNewValueImage(file);
            }
        }
    };

    const handleAddValue = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const formData = new FormData();
            formData.append('title', newValue.title);
            formData.append('description', newValue.description);
            formData.append('is_visible', newValue.is_visible);
            if (newValueImage) {
                formData.append('image', newValueImage);
            }

            await axios.post(`${apiUrl}/api/core-values`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Refresh values
            const res = await axios.get(`${apiUrl}/api/core-values`);
            setCoreValues(res.data);
            setNewValue({ title: '', description: '', is_visible: true });
            setNewValueImage(null);
            alert('Core Value Added');
        } catch (error) {
            console.error(error);
            alert('Failed to add value');
        }
    };

    const handleDeleteValue = async (id) => {
        if (!confirm('Delete this value?')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            await axios.delete(`${apiUrl}/api/core-values/${id}`);
            setCoreValues(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete value');
        }
    };

    const handleToggleVisibility = async (id, currentStatus) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.put(`${apiUrl}/api/core-values/${id}`, {
                is_visible: !currentStatus
            });

            // Update local state
            setCoreValues(prev => prev.map(v =>
                v.id === id ? { ...v, is_visible: !currentStatus } : v
            ));
        } catch (error) {
            console.error('Failed to toggle visibility', error);
            alert('Failed to update visibility');
        }
    };

    const handleAddBanner = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (banners.length >= 5) {
            alert('Maximum 5 banners allowed.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/home-banners`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBanners(prev => [...prev, res.data]);
        } catch (error) {
            console.error(error);
            alert('Failed to upload banner');
        }
    };

    const handleDeleteBanner = async (id) => {
        if (!confirm('Delete this banner?')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            await axios.delete(`${apiUrl}/api/home-banners/${id}`);
            setBanners(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete banner');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const formData = new FormData();
            Object.keys(settings).forEach(key => formData.append(key, settings[key]));

            if (heroImage) formData.append('hero_image', heroImage);
            if (aboutImage) formData.append('about_image', aboutImage);
            if (logoImage) formData.append('site_logo', logoImage);

            await axios.put(`${apiUrl}/api/site-settings`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Settings Updated Successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Site Settings</h1>

            <div className="flex border-b border-gray-200 mb-6">
                {['general', 'content', 'values'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-[2px] ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab === 'general' && 'General Info'}
                        {tab === 'content' && 'Homepage Content'}
                        {tab === 'values' && 'Core Values'}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* General Info */}
                <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">General Information</h2>

                        {/* Navbar Live Preview */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Live Preview</label>
                            <div className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg p-4 font-sarabun shadow-sm">
                                <div className="flex justify-between items-center h-16 max-w-full px-4 border-b border-gray-100 bg-white rounded-md">
                                    <div className="flex items-center space-x-2">
                                        {(previews.logo || currentImages.logo) && settings.show_logo === 'true' ? (
                                            <div className="w-10 h-10 relative overflow-hidden rounded-lg border border-gray-100">
                                                <img src={previews.logo || currentImages.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {(settings.site_title || 'C').charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                                            {settings.site_title || 'Catalog'}
                                        </span>
                                    </div>

                                    {/* Mock Navigation for realism */}
                                    <div className="hidden md:flex items-center space-x-4 opacity-50 scale-90 origin-right">
                                        <span className="text-gray-600 font-medium">Home</span>
                                        <span className="text-gray-600 font-medium">Products</span>
                                        <span className="text-gray-600 font-medium">About Us</span>
                                        <span className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm">Contact Us</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center">This is how your logo and title will appear on the website.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                                <input name="site_title" value={settings.site_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                                        {(previews.logo || currentImages.logo) ? (
                                            <img src={previews.logo || currentImages.logo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-gray-400">N/A</span>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div className="mt-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="show_logo"
                                        name="show_logo"
                                        checked={settings.show_logo === 'true'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="show_logo" className="ml-2 block text-sm text-gray-900">
                                        Show Logo in Navbar (If unchecked, site title text will be used)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                <input name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <input name="contact_email" value={settings.contact_email || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                                <input name="social_facebook" placeholder="https://facebook.com/..." value={settings.social_facebook || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Line ID / URL</label>
                                <input name="social_line" placeholder="@yourlineid" value={settings.social_line || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <RichTextEditor
                                    value={settings.contact_address || ''}
                                    onChange={(val) => handleRichTextChange('contact_address', val)}
                                    placeholder="Enter address..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg ${saving ? 'opacity-70' : ''}`}
                            >
                                {saving ? 'Saving Changes...' : 'Save General Settings'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Homepage Content & Images */}
                <div className={activeTab === 'content' ? 'space-y-6' : 'hidden'}>

                    {/* Card 1: Home Page Hero Slider */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Home Page Hero Slider</h2>
                                <p className="text-sm text-gray-500">Manage up to 5 images for the main homepage slider.</p>
                            </div>
                            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{banners.length} / 5 Images</span>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-wrap gap-4 mb-4">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="relative group w-48 h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => handleDeleteBanner(banner.id)}
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                            title="Delete Banner"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                            ID: {banner.id}
                                        </div>
                                    </div>
                                ))}
                                {banners.length === 0 && (
                                    <div className="w-full h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>No banners added</span>
                                    </div>
                                )}
                            </div>
                            {banners.length < 5 && (
                                <div className="max-w-md">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Add New Banner</label>
                                    <div className="flex gap-2">
                                        <input type="file" accept="image/*" onChange={handleAddBanner} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x1080px (Landscape)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Home Page Text Overlay */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-gray-800">Home Page Text Overlay</h2>
                            <p className="text-sm text-gray-500">Customize the text displayed over the hero slider.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                                <input name="home_title" placeholder="สินค้าคุณภาพมาตรฐานสากล" value={settings.home_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <p className="text-xs text-gray-500 mt-1">Default: "สินค้าคุณภาพมาตรฐานสากล"</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Tagline</label>
                                <RichTextEditor
                                    value={settings.home_subtitle || ''}
                                    onChange={(val) => handleRichTextChange('home_subtitle', val)}
                                    placeholder="ค้นพบประสบการณ์ใหม่..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Default: "ค้นพบประสบการณ์ใหม่แห่งการเลือกซื้อสินค้า"</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Global Page Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-gray-800">Global Page Header</h2>
                            <p className="text-sm text-gray-500">The banner image displayed at the top of internal pages (e.g., About Us).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Global Hero Image</label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-1/2">
                                    {(previews.hero || currentImages.hero) ? (
                                        <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={previews.hero || currentImages.hero} alt="Hero Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        </div>
                                    ) : (
                                        <div className="h-48 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About Page Hero Title</label>
                                        <input name="about_hero_title" placeholder="เกี่ยวกับเรา (Header)" value={settings.about_hero_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        <p className="text-xs text-gray-500 mt-1">Default: "About [Site Title]" (e.g. "About MyShop")</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About Page Hero Subtitle</label>
                                        <RichTextEditor
                                            value={settings.about_hero_subtitle || ''}
                                            onChange={(val) => handleRichTextChange('about_hero_subtitle', val)}
                                            placeholder="มุ่งมั่นนำเสนอสินค้าคุณภาพเยี่ยม..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Default: "มุ่งมั่นนำเสนอสินค้าคุณภาพเยี่ยม เพื่อตอบโจทย์ทุกไลฟ์สไตล์ของคุณ..."</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Hero Image</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        <p className="text-xs text-gray-500 mt-1">This image will appear behind the page title in the header section.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: About Us Content */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-gray-800">About Us Content</h2>
                            <p className="text-sm text-gray-500">Manage the content displayed in the body of the About Us page.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content Image (Our Story)</label>
                                <div className="flex flex-col gap-3">
                                    {(previews.about || currentImages.about) ? (
                                        <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={previews.about || currentImages.about} alt="About Preview" className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-48 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'about')} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About Us Title</label>
                                    <input name="about_title" placeholder="เรื่องราวของเรา" value={settings.about_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <p className="text-xs text-gray-500 mt-1">Default: "เรื่องราวของเรา"</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About Us Description</label>
                                    <RichTextEditor
                                        value={settings.about_us || ''}
                                        onChange={(val) => handleRichTextChange('about_us', val)}
                                        placeholder="Write something about the company..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Default: "ก่อตั้งขึ้นด้วยความตั้งใจที่จะรวบรวมสินค้าที่มีคุณภาพ..."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Contact Page Content */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-gray-800">Contact Page Content</h2>
                            <p className="text-sm text-gray-500">Customize the header text for the Contact Us page.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Page Title</label>
                                <input name="contact_title" placeholder="ติดต่อเรา" value={settings.contact_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <p className="text-xs text-gray-500 mt-1">Default: "ติดต่อเรา"</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Page Subtitle</label>
                                <RichTextEditor
                                    value={settings.contact_subtitle || ''}
                                    onChange={(val) => handleRichTextChange('contact_subtitle', val)}
                                    placeholder="เราพร้อมให้คำปรึกษา..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Default: "เราพร้อมให้คำปรึกษาและบริการคุณ"</p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button for Content Tab */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg ${saving ? 'opacity-70' : ''}`}
                        >
                            {saving ? 'Saving Changes...' : 'Save Content Settings'}
                        </button>
                    </div>

                </div>

                {/* Core Values */}
                <div className={activeTab === 'values' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Core Values Management</h2>
                        <p className="text-sm text-gray-500 mb-6">Manage the core values displayed in the About section.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                <input name="core_values_title" placeholder="ค่านิยมของเรา" value={settings.core_values_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <p className="text-xs text-gray-500 mt-1">Default: "ค่านิยมของเรา"</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                <RichTextEditor
                                    value={settings.core_values_subtitle || ''}
                                    onChange={(val) => handleRichTextChange('core_values_subtitle', val)}
                                    placeholder="สิ่งที่เรายึดมั่น..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Default: "สิ่งที่เรายึดมั่นในการดำเนินงาน เพื่อส่งมอบสิ่งที่ดีที่สุดให้กับคุณ"</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {coreValues.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500">No core values added yet.</p>
                                </div>
                            ) : (
                                coreValues.map(val => (
                                    <div key={val.id} className="flex items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-300 transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border shadow-sm flex items-center justify-center text-gray-400 bg-gray-100">
                                            {val.image_url ? (
                                                <img src={val.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs">No Icon</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-800 truncate">{val.title}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: val.description }}></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleVisibility(val.id, val.is_visible)}
                                                className={`p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1 ${val.is_visible ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                                                title={val.is_visible ? 'Hide Value' : 'Show Value'}
                                            >
                                                {val.is_visible ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteValue(val.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                                title="Delete Value"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t pt-6 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Add New Value</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title</label>
                                        <input
                                            placeholder="e.g. Quality, Integrity"
                                            value={newValue.title}
                                            onChange={e => setNewValue({ ...newValue, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Icon/Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleFileChange(e, 'newValue')}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                                    <RichTextEditor
                                        value={newValue.description}
                                        onChange={(val) => setNewValue({ ...newValue, description: val })}
                                        placeholder="Brief description of the value..."
                                        className="h-32"
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={handleAddValue}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center gap-2"
                                    >
                                        <span>+ Add Value</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
