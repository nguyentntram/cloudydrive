'use client';

import { useMemo, useState } from 'react';
import Topbar from '@/components/Topbar';
import RecentList from '@/components/RecentList';
import { useFiles } from '@/hooks/useFiles';

const isImage = (type = '', name = '') =>
  type.toLowerCase().startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
const isDocument = (type = '', name = '') => {
  const t = type.toLowerCase(), n = name.toLowerCase();
  return t.includes('pdf') || t.includes('msword') || t.includes('officedocument')
    || /\.(pdf|docx?|txt|csv|xlsx?)$/i.test(n);
};

export default function Page() {
  const { files = [], isLoading } = useFiles();
  const [typeFilter, setTypeFilter] = useState('all');      // 'all' | 'images' | 'documents'
  const [sortBy, setSortBy] = useState('newest');           // 'newest' | 'oldest' | 'az' | 'za'

  const normalized = useMemo(
    () => files.map(f => ({
      id: f.id,
      name: f.filename ?? f.fileName ?? f.name ?? '',
      size: Number(f.filesize ?? f.fileSize ?? f.size ?? 0),
      type: (f.filetype ?? f.type ?? '').toString(),
      uploaded_at: f.upload_time ?? f.uploadedAt ?? f.created_at ?? '',
      ...f,
    })),
    [files]
  );

  const view = useMemo(() => {
    let arr = normalized;
    if (typeFilter === 'images') arr = arr.filter(f => isImage(f.type, f.name));
    else if (typeFilter === 'documents') arr = arr.filter(f => isDocument(f.type, f.name));
    return [...arr].sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        case 'oldest': return new Date(a.uploaded_at) - new Date(b.uploaded_at);
        case 'az':     return a.name.localeCompare(b.name);
        case 'za':     return b.name.localeCompare(a.name);
        default:       return 0;
      }
    });
  }, [normalized, typeFilter, sortBy]);

  const baseTab = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200';
  const activeTab = 'bg-green-50 text-green-600 border-green-200 ring-1 ring-green-100';
  const idleTab   = 'text-slate-700 border-slate-200 hover:bg-green-50 hover:text-green-600';

  return (
    <div className="space-y-6">
      <Topbar />

      <div className="flex items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            className={`${baseTab} ${typeFilter === 'all' ? activeTab : idleTab}`}
            onClick={() => setTypeFilter('all')}
          >
            All
          </button>
          <button
            className={`${baseTab} ${typeFilter === 'images' ? activeTab : idleTab}`}
            onClick={() => setTypeFilter('images')}
          >
            Images
          </button>
          <button
            className={`${baseTab} ${typeFilter === 'documents' ? activeTab : idleTab}`}
            onClick={() => setTypeFilter('documents')}
          >
            Documents
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort</span>
          <select
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-soft p-6">
        {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <>
            <div className="text-xl font-semibold mb-4">Files</div>
            <RecentList files={view} />
          </>
        )}
      </div>
    </div>
  );
}
