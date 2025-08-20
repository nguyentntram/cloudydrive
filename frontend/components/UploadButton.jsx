"use client";

import { useRef } from "react";
import { useFiles } from "@/hooks/useFiles";

export default function UploadButton() {
  const fileInputRef = useRef(null);
  const { upload, refresh } = useFiles();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await upload(file); // Upload the selected file
      await refresh?.();  // Refresh file list after successful upload
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    } finally {
      e.target.value = ""; // Reset input value so the same file can be selected again
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="rounded-full px-5 py-3 bg-brand shadow-soft hover:opacity-90 transition"
      >
        Upload
      </button>
    </>
  );
}
