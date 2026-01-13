'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'color', 'background'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'color', 'background'
];

export default function RichTextEditor({ value, onChange, placeholder, className }) {
    return (
        <div className={`rich-text-editor ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white rounded-lg"
            />
            <style jsx global>{`
                .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    border-color: #e5e7eb !important;
                }
                .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    border-color: #e5e7eb !important;
                    min-height: 120px;
                    font-size: 1rem;
                    font-family: 'Sarabun', sans-serif;
                }
                .ql-editor {
                    min-height: 120px;
                }
            `}</style>
        </div>
    );
}
