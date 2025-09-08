'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { fmtBytes, fmtTime, extFromName } from '@/lib/format';
import { filesApi } from '@/lib/api';
import PreviewModal from '@/components/PreviewModal';

const badgeColor = (ext) => {
  if (['PDF'].includes(ext)) return 'bg-red-100 text-red-700';
  if (['DOC','DOCX'].includes(ext)) return 'bg-blue-100 text-blue-700';
  if (['XLS','XLSX','CSV'].includes(ext)) return 'bg-green-100 text-green-700';
  if (['PPT','PPTX'].includes(ext)) return 'bg-orange-100 text-orange-700';
  if (['TXT','MD'].includes(ext)) return 'bg-slate-100 text-slate-700';
  return 'bg-brand-100 text-brand';
};

export default function FileCard({ file }) {
  const ext = extFromName(file.name);
  const { mutate } = useSWRConfig();
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!confirm(`Delete "${file.name}"?`)) return;
    await filesApi.delete(file.id);
    await Promise.all([mutate('files'), mutate('documents'), mutate('images')]);
  };

  const handleDownload = async () => {
    setMenuOpen(false);
    const { downloadUrl } = await filesApi.downloadUrl(file.id);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name || 'download';
    a.click();
  };

  const handlePreview = () => {
    setMenuOpen(false);
    setPreviewing(true);
  };

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-soft p-4 hover:shadow-lg transition flex flex-col relative">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-full grid place-items-center font-semibold ${badgeColor(ext)}`}>
            {ext.slice(0,3)}
          </div>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="text-slate-400 hover:text-slate-600"
          >
            •••
          </button>
          {menuOpen && (
            <div className="absolute right-3 top-10 z-10 w-40 rounded-xl border bg-white shadow-lg">
              <button onClick={handlePreview} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Preview</button>
              <button onClick={handleDownload} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Download</button>
              <button onClick={handleDelete} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">Delete</button>
            </div>
          )}
        </div>
        <div className="mt-3 font-medium line-clamp-1">{file.name}</div>
        <div className="mt-1 text-slate-500 text-sm">{fmtBytes(file.size)}</div>
        <div className="mt-auto pt-3 text-slate-400 text-xs">{fmtTime(file.uploaded_at)}</div>
      </div>

      {previewing && (
        <PreviewModal file={file} onClose={() => setPreviewing(false)} />
      )}
    </>
  );
}
