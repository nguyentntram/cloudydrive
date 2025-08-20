import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000',
  withCredentials: false,
  timeout: 30000,
});

const unwrap = (p) =>
  p.then(r => r.data).catch(err => {
    console.error('API ERROR ->',
      err?.response?.status,
      err?.response?.statusText,
      err?.response?.data || err?.message
    );
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      JSON.stringify(err?.response?.data || {}) ||
      err?.message || 'Request failed';
    throw new Error(msg);
  });

export const filesApi = {
  // Get all files
  list:      () => unwrap(api.get('/files/list')),
  // Get only document files
  documents: () => unwrap(api.get('/files/documents')),
  // Get only image files
  images:    () => unwrap(api.get('/files/images')),
  // Delete file by ID
  delete:    (id) => unwrap(api.delete(`/files/${id}`)),

  // Request a presigned upload URL for a given fileName
  // Response -> { uploadUrl, s3Key }
  getUploadUrl: (fileName) =>
    unwrap(api.get('/files/upload-url', { params: { fileName } })),

  // Finalize upload: register metadata in backend
  // Payload: { fileName, fileType, fileSize, s3Key }
  finalize: (payload) =>
    unwrap(api.post('/files/register', payload)),

  // Request a presigned download URL for a file by ID
  // Response -> { downloadUrl, filename }
  downloadUrl: (id) => unwrap(api.get(`/files/download-url/${id}`)),

  
  // Fetch preview metadata
  preview: (id) => unwrap(api.get(`/files/${id}/preview`)),
};

export default api;

