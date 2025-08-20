'use client';

import { useState, useMemo, useEffect } from 'react';
import UploadButton from './UploadButton';

export default function DocToolbar({ onFilterChange }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('date_desc'); // date_desc | date_asc | name | size_desc | size_asc

  useEffect(() => {
    onFilterChange?.({ q, sort });
    }, [q, sort, onFilterChange]);
  return (
    <div className="flex items-center justify-between mb-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="flex-1 rounded-full bg-white shadow-soft px-5 py-3 outline-none border border-gray-100 max-w-xl"
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2 bg-white"
        >
          <option value="date_desc">Date Created (newest)</option>
          <option value="date_asc">Date Created (oldest)</option>
          <option value="name">Name (A→Z)</option>
          <option value="size_desc">Size (largest)</option>
          <option value="size_asc">Size (smallest)</option>
        </select>
        <UploadButton />
      </div>
    </div>
  );
}
