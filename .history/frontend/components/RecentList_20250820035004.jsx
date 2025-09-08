"use client";

import { useState } from "react";
import { useFiles } from "@/hooks/useFiles";
import { filesApi } from "@/lib/api";
import PreviewModal from "@/components/PreviewModal";

export default function RecentList({ files }) {
  const { remove } = useFiles();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleDelete = async (id, name) => {
    setOpenMenuId(null);
    if (!confirm(`Delete "${name}"?`)) return;
    try { await remove(id); } catch (e) { console.error(e); alert("Delete failed"); }
  };

  const handleDownload = async (id, name) => {
    setOpenMenuId(null);
    try {
      const { downloadUrl } = await filesApi.downloadUrl(id);
      const a = document.createElement("a");
      a.href = downloadUrl; a.download = name || "download"; document.body.appendChild(a);
      a.click(); a.remove();
    } catch (e) { console.error(e); alert("Download failed"); }
  };

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {files.map((f) => {
          const name = f.filename ?? f.fileName ?? f.name ?? "";
          const uploadedAt = f.upload_time ?? f.uploadedAt ?? f.created_at ?? "";
          return (
            <li key={f.id} className="relative py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-slate-500">
                  {uploadedAt ? new Date(uploadedAt).toLocaleString() : ""}
                </div>
              </div>

              <button
                onClick={() => setOpenMenuId(openMenuId === f.id ? null : f.id)}
                className="text-slate-400 hover:text-slate-600 px-2"
              >
                •••
              </button>

              {openMenuId === f.id && (
                <div
                  className="absolute right-0 top-10 z-10 w-36 rounded-md border bg-white shadow-md"
                  onMouseLeave={() => setOpenMenuId(null)}
                >
                  <button
                    onClick={() => { setOpenMenuId(null); setPreviewFile(f); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(f.id, name)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(f.id, name)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}
