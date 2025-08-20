'use client';

import DocToolbar from '@/components/DocToolbar';
import FileCard from '@/components/FileCard';
import { useDocuments } from '@/hooks/useFiles';
import { fmtBytes } from '@/lib/format';
import { useMemo, useState } from 'react';

export default function DocumentsPage() {
  const { files, isLoading } = useDocuments();
  const [filter, setFilter] = useState({ q: '', sort: 'date_desc' }); // Local filter state (search query + sort type)

  // Map backend fields -> frontend-friendly fields
  const mappedFiles = useMemo(() => {
    return files.map(f => ({
      ...f,
      name: f.filename,   // normalize "filename" -> "name"
      size: f.filesize,   // normalize "filesize" -> "size"
      type: f.filetype,   // normalize "filetype" -> "type"
      uploaded_at: f.upload_time  // normalize "upload_time" -> "uploaded_at"
    }));
  }, [files]);

  // Apply search filter + sorting
  const filtered = useMemo(() => {
    let list = mappedFiles;

    // Apply text search
    if (filter.q) {
      const q = filter.q.toLowerCase();
      list = list.filter(f => (f.name || '').toLowerCase().includes(q));
    }

    // Apply sorting
    switch (filter.sort) {
      case 'date_asc':
        list = [...list].sort((a,b)=> new Date(a.uploaded_at)-new Date(b.uploaded_at));
        break;
      case 'name':
        list = [...list].sort((a,b)=> (a.name||'').localeCompare(b.name||''));
        break;
      case 'size_desc':
        list = [...list].sort((a,b)=> (b.size||0)-(a.size||0));
        break;
      case 'size_asc':
        list = [...list].sort((a,b)=> (a.size||0)-(b.size||0));
        break;
      default:
        list = [...list].sort((a,b)=> new Date(b.uploaded_at)-new Date(a.uploaded_at));
    }
    return list;
  }, [mappedFiles, filter]);

  // Compute total storage used by filtered docs
  const totalBytes = useMemo(
    () => filtered.reduce((s,f)=>s+(f.filesize||0),0),
    [filtered]
  );

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Documents</h1>

      <div className="bg-gray-100/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500">
            Total: <span className="font-semibold">{fmtBytes(totalBytes)}</span>
          </div>
        </div>

        <DocToolbar onFilterChange={setFilter} />

        {filtered.length === 0 ? (
          <div className="text-slate-500 py-16 text-center">No documents found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(f => (
              <FileCard key={f.id} file={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
