'use client';

import { useState } from 'react';
import { useFiles } from '@/hooks/useFiles';

export default function RecentItem({ file }) {
  const { remove } = useFiles();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = file.filename ?? file.fileName ?? file.name ?? '';
  const uploadedAt = file.upload_time ?? file.uploadedAt ?? file.created_at ?? '';

  const onDelete = async () => {
    setMenuOpen(false);
    const ok = confirm(`Delete "${name}"?`);
    if (!ok) return;
    try {
      await remove(file.id);
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  return (
    <div className="group relative py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium hover:underline cursor-default">
            {name}
          </div>
          <div className="text-xs opacity-60">
            {uploadedAt ? new Date(uploadedAt).toLocaleString() : ''}
          </div>
        </div>

        {/* menu ... */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="opacity-60 hover:opacity-100 px-2"
          aria-label="More"
        >
          &#8230;&#8230; {/* or ... */}
        </button>

        {/* menu */}
        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-10 w-36 rounded-xl border bg-black text-white shadow-lg"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={onDelete}
              className="w-full text-left px-4 py-2 hover:bg-white/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 h-px bg-white/10" />
    </div>
  );
}
