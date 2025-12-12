// Emergency search fix - loads immediately
(function() {
  'use strict';

  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  let searchData = null;
  let isLoading = false;

  // Load search data
  function loadSearchData() {
    if (searchData || isLoading) return Promise.resolve(searchData);

    isLoading = true;
    return fetch('/api/search-data.json')
      .then(res => res.json())
      .then(data => {
        searchData = data;
        console.log('✅ Search data loaded:', data.products?.length, 'products,', data.blogs?.length, 'blogs');
        return data;
      })
      .catch(err => {
        console.error('❌ Failed to load search data:', err);
        return null;
      })
      .finally(() => {
        isLoading = false;
      });
  }

  function performSearch(query) {
    if (!searchData || !query || query.length < 2) return [];

    const normalizedQuery = removeVietnameseTones(query);
    const results = [];

    // Search products
    (searchData.products || []).forEach(product => {
      const name = removeVietnameseTones(product.name || '');
      const brand = removeVietnameseTones(product.brand || '');
      const model = removeVietnameseTones(product.model || '');
      const description = removeVietnameseTones(product.description || '');

      if (name.includes(normalizedQuery) ||
          brand.includes(normalizedQuery) ||
          model.includes(normalizedQuery) ||
          description.includes(normalizedQuery)) {
        results.push({
          id: product.id,
          title: product.name,
          type: 'product',
          url: `/${product.type}/${product.slug}`,
          excerpt: product.description?.substring(0, 100)
        });
      }
    });

    // Search blogs
    (searchData.blogs || []).forEach(blog => {
      const title = removeVietnameseTones(blog.title || '');
      const description = removeVietnameseTones(blog.description || '');

      if (title.includes(normalizedQuery) || description.includes(normalizedQuery)) {
        results.push({
          id: blog.id,
          title: blog.title,
          type: 'blog',
          url: `/${blog.category}/${blog.slug}`,
          excerpt: blog.description?.substring(0, 100)
        });
      }
    });

    return results.slice(0, 10);
  }

  function displayResults(results, query, container) {
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="p-4 text-center text-gray-500">
          <svg class="h-8 w-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-sm">Không tìm thấy kết quả cho "${query}"</p>
        </div>
      `;
      container.classList.remove('hidden');
      return;
    }

    const html = `
      <div class="p-2 text-xs text-gray-500 font-semibold border-b">
        Tìm thấy ${results.length} kết quả
      </div>
      ${results.map(result => `
        <a href="${result.url}" class="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-1">
              ${result.type === 'product'
                ? '<svg class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>'
                : '<svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
              }
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">${result.title}</div>
              ${result.excerpt ? `<div class="text-sm text-gray-500 mt-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${result.excerpt}</div>` : ''}
              <div class="text-xs text-gray-400 mt-1">${result.type === 'product' ? 'Sản phẩm' : 'Tin tức'}</div>
            </div>
          </div>
        </a>
      `).join('')}
      <a href="/search?q=${encodeURIComponent(query)}" class="block px-4 py-3 text-center text-sm text-red-600 hover:bg-gray-50 font-medium border-t">
        Xem tất cả kết quả cho "${query}"
      </a>
    `;

    container.innerHTML = html;
    container.classList.remove('hidden');
  }

  function initializeSearchInputs() {
    const inputs = document.querySelectorAll('input[placeholder*="Tìm kiếm"], input[placeholder*="tìm kiếm"]');

    inputs.forEach(input => {
      if (input.dataset.searchInitialized) return;
      input.dataset.searchInitialized = 'true';

      // Create or find results container
      let container = input.parentElement?.querySelector('.search-results-dropdown');
      if (!container) {
        container = document.createElement('div');
        container.className = 'search-results-dropdown absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 hidden';

        const parent = input.parentElement;
        if (parent) {
          parent.style.position = 'relative';
          parent.appendChild(container);
        }
      }

      let searchTimeout;

      input.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (!query || query.length < 2) {
          container.classList.add('hidden');
          return;
        }

        searchTimeout = setTimeout(async () => {
          await loadSearchData();
          const results = performSearch(query);
          displayResults(results, query, container);
        }, 300);
      });

      input.addEventListener('focus', (e) => {
        const query = e.target.value.trim();
        if (query && query.length >= 2 && !container.classList.contains('hidden')) {
          // Re-show if has results
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!input.parentElement?.contains(e.target)) {
          container.classList.add('hidden');
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadSearchData();
      initializeSearchInputs();
      // Re-initialize after React hydration
      setTimeout(initializeSearchInputs, 1000);
      setTimeout(initializeSearchInputs, 3000);
    });
  } else {
    loadSearchData();
    initializeSearchInputs();
    setTimeout(initializeSearchInputs, 1000);
    setTimeout(initializeSearchInputs, 3000);
  }

  // Watch for dynamic elements
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      initializeSearchInputs();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
