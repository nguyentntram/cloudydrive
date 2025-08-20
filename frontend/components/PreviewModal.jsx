'use client';

import { useEffect, useState } from 'react';
import { filesApi } from '@/lib/api';

const ext = (n='') => (n.split('.').pop() || '').toLowerCase(); // Extract file extension (lowercase)
const isImg = (t='', n='') => t.startsWith('image/') || /^(png|jpe?g|gif|webp|svg)$/.test(ext(n));
const isPdf = (t='', n='') => t.includes('pdf') || ext(n) === 'pdf';
const isText = (t='', n='') => t.startsWith('text/') || /^(txt|csv|log)$/i.test(ext(n));

export default function PreviewModal({ file, onClose }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [textPreview, setTextPreview] = useState('');

    useEffect(() => {
    let alive = true;
    (async () => {
        setLoading(true);
        setTextPreview('');
        try {
        // Request a presigned GET URL for the file
        const { downloadUrl } = await filesApi.downloadUrl(file.id);
        if (!alive) return;
        setUrl(downloadUrl);

        // If file is text, fetch its contents for preview
        if (isText(file.filetype || '', file.filename)) {
            const r = await fetch(downloadUrl);
            const txt = await r.text();
            if (alive) setTextPreview(txt.slice(0, 5000)); // Limit preview size
        }
        } catch (e) {
        console.error(e);
        } finally {
        if (alive) setLoading(false);
        }
    })();
    return () => { alive = false; };
    }, [file]);

    const name = file.filename ?? file.fileName ?? file.name ?? '';

    return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
        {/* Top bar (filename, download, close) */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/30 text-white">
        <div className="truncate">{name}</div>
        <div className="flex items-center gap-2">
            {url && (
            <a
                href={url}
                download={name}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
            >
                Download
            </a>
            )}
            <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
            >
            Close
            </button>
        </div>
        </div>

        {/* Content preview */}
        <div className="flex-1 flex items-center justify-center p-4">
        {loading && <div className="text-white/80">Loading preview…</div>}
        
        {/* Image preview */}
        {!loading && url && isImg(file.filetype || '', name) && (
            <img src={url} alt={name} className="max-h-full max-w-full object-contain" />
        )}

        {/* PDF preview */}
        {!loading && url && isPdf(file.filetype || '', name) && (
            <iframe
            title="PDF preview"
            src={url}
            className="w-full h-full rounded-lg border-0"
            />
        )}

        {/* Text preview */}
        {!loading && textPreview && (
            <pre className="w-full h-full overflow-auto bg-black/40 text-white/90 p-4 rounded-lg">
            {textPreview}
            </pre>
        )}

        {/* Fallback for unsupported file types */}
        {!loading && !isImg(file.filetype || '', name) && !isPdf(file.filetype || '', name) && !textPreview && (
            <div className="text-white/80">
            No in-app preview for this file type. Use <span className="underline">Download</span>.
            </div>
        )}
        </div>
    </div>
    );
}
