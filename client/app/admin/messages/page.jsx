'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Trash2, Calendar, User, Phone, CheckCircle } from 'lucide-react';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/contact`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load messages'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this message?',
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
                await axios.delete(`${apiUrl}/api/contact/${id}`);
                setMessages(prev => prev.filter(m => m.id !== id));
                Swal.fire(
                    'Deleted!',
                    'Message has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Failed to delete', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete message'
                });
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Mail className="text-blue-600" /> Inbox
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                        <Mail size={48} className="mb-4 opacity-20" />
                        <p>No messages found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {messages.map((msg) => (
                            <div key={msg.id} className="p-6 hover:bg-gray-50 transition duration-150 group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{msg.subject}</h3>
                                        {!msg.is_read && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">New</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(msg.created_at).toLocaleString('th-TH')}
                                    </span>
                                </div>

                                <div className="flex flex-wrap text-sm text-gray-600 gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span className="font-medium">{msg.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail size={14} />
                                        <span className="hover:text-blue-600 cursor-pointer">{msg.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        <span>{msg.phone}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line border border-gray-100 mb-4">
                                    {msg.message}
                                </div>

                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
