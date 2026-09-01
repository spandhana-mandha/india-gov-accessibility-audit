// api.js - REST API Client - Spandhana Mandha
const API_BASE = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts() {
  try {
    const res = await fetch(${API_BASE}/posts?_limit=20);
    if (!res.ok) throw new Error(API Error: ${res.status});
    const data = await res.json();
    localStorage.setItem('gov-posts', JSON.stringify(data));
    return data;
  } catch (error) {
    const cached = localStorage.getItem('gov-posts');
    if (cached) return JSON.parse(cached);
    throw error;
  }
}

export async function fetchUsers() {
  const res = await fetch(${API_BASE}/users);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
