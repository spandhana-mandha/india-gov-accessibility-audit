// app.js - Dynamic DOM Logic - Spandhana Mandha
import { fetchPosts } from './api.js';

let allData = [];
let filteredData = [];

const searchInput = document.getElementById('search');
const statusFilter = document.getElementById('status-filter');
const tableBody = document.getElementById('audit-tbody');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-banner');

// Load with skeleton
async function init() {
  try {
    loadingEl.style.display = 'block';
    errorEl.hidden = true;

    allData = await fetchPosts();
    filteredData = [...allData];
    renderTable(filteredData);

    // Save user preference
    const savedSearch = localStorage.getItem('search-pref');
    if (savedSearch && searchInput) {
      searchInput.value = savedSearch;
      handleSearch({ target: searchInput });
    }
  } catch (err) {
    errorEl.textContent = Failed to load data: ${err.message}. Showing cached data.;
    errorEl.hidden = false;
  } finally {
    loadingEl.style.display = 'none';
  }
}

// Real-time search filtering without reload
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  localStorage.setItem('search-pref', query);

  filteredData = allData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.body.toLowerCase().includes(query)
  );
  renderTable(filteredData);
}

// Category tabs filtering
function filterByCategory(category) {
  if (category === 'all') {
    filteredData = [...allData];
  } else {
    filteredData = allData.filter(item => item.userId == category);
  }
  renderTable(filteredData);
  localStorage.setItem('category-pref', category);
}

// Sorting logic
function sortData(key, order = 'asc') {
  filteredData.sort((a, b) => {
    if (order === 'asc') return a[key] > b[key]? 1 : -1;
    return a[key] < b[key]? 1 : -1;
  });
  renderTable(filteredData);
}

function renderTable(data) {
  if (!tableBody) return;
  tableBody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.title.slice(0,40)}</td>
      <td><span class="badge">${item.userId}</span></td>
      <td>${new Date().toLocaleDateString()}</td>
    </tr>
  `).join('');
}

// Event listeners
if (searchInput) searchInput.addEventListener('input', handleSearch);
window.filterByCategory = filterByCategory;
window.sortData = sortData;

document.addEventListener('DOMContentLoaded', init);
