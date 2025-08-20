// hooks/useFiles.js
import useSWR, { useSWRConfig } from 'swr';
import { filesApi } from '@/lib/api';

export function useFiles() {
  const { data, error, isLoading, mutate } = useSWR('files', filesApi.list);
  const { mutate: globalMutate } = useSWRConfig();

  // Force refresh across all related SWR keys
  const refresh = async () => {
    await Promise.all([
      globalMutate('files'),
      globalMutate('documents'),
      globalMutate('images'),
    ]);
  };

  // Upload file flow:
  // 1. Ask backend for presigned S3 upload URL
  // 2. PUT file to S3
  // 3. Finalize upload by registering metadata in backend
  // 4. Refresh all caches
  const upload = async (file) => {
    if (!file) return;
    const { uploadUrl, s3Key } = await filesApi.getUploadUrl(file.name);

    // Upload directly to S3
    const put = await fetch(uploadUrl, { method: 'PUT', body: file });
    if (!put.ok) {
      const txt = await put.text();
      throw new Error(`S3 PUT failed: ${put.status} ${txt}`);
    }

    // Finalize: save metadata in DB
    await filesApi.finalize({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      s3Key,
    });

    await refresh();
  };

  // Delete file flow:
  // 1. Optimistically update SWR cache for "files"
  // 2. Call backend delete
  // 3. Update related caches (documents/images)
  const remove = async (id) => {
    await mutate(async (curr) => {
      await filesApi.delete(id);
      return (curr || []).filter((f) => f.id !== id);
    }, { revalidate: true });

    await Promise.all([
      globalMutate('documents'),
      globalMutate('images'),
    ]);
  };

  return { files: data || [], error, isLoading, upload, refresh, remove, mutate };
}

// ====== named hooks for Documents/Images ======
export function useDocuments() {
  const { data, error, isLoading, mutate } = useSWR('documents', filesApi.documents);
  return { files: data || [], error, isLoading, mutate };
}

export function useImages() {
  const { data, error, isLoading, mutate } = useSWR('images', filesApi.images);
  return { files: data || [], error, isLoading, mutate };
}

