// lib/fetcher.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetcher = async (url) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) {
    throw new Error(`Fetch error: ${res.statusText}`);
  }
  return res.json();
};
