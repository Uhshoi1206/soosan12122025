// Enhanced search functionality - loads immediately
(function() {
  console.log('[SearchEnhanced] Initializing...');

  let searchData = null;
  let isLoading = false;

  // Remove Vietnamese tones
  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  // Load search data
  async function loadSearchData() {
    if (searchData || isLoading) return;

    isLoading = true;
    console.log('[SearchEnhanced] Loading search data...');

    try {
      const response = await fetch('/api/search-data.json');
      console.log('[SearchEnhanced] API response:', response.status);

      if (response.ok) {
        searchData = await response.json();
        console.log('[SearchEnhanced] Data loaded:', {
          products: searchData.products?.length || 0,
          blogs: searchData.blogs?.length || 0
        });
        window.__SEARCH_DATA__ = searchData;
      } else {
        console.error('[SearchEnhanced] API failed:', response.status);
      }
    } catch (error) {
      console.error('[SearchEnhanced] Load error:', error);
    } finally {
      isLoading = false;
    }
  }

  // Search function
  function performSearch(query) {
    if (!searchData) {
      console.log('[SearchEnhanced] Data not loaded');
      return [];
    }

    const normalizedQuery = removeVietnameseTones(query);
    console.log('[SearchEnhanced] Searching:', {original: query, normalized: normalizedQuery});
    const results = [];

    // Search products
    if (searchData.products) {
      searchData.products.forEach(product => {
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
    }

    // Search blogs
    if (searchData.blogs) {
      searchData.blogs.forEach(blog => {
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
    }

    console.log('[SearchEnhanced] Found', results.length, 'results');
    return results.slice(0, 10);
  }

  // Initialize on DOM ready
  function init() {
    console.log('[SearchEnhanced] DOM ready');

    // Load data immediately
    loadSearchData();

    // Expose search function globally
    window.performSearch = performSearch;
    window.loadSearchData = loadSearchData;

    console.log('[SearchEnhanced] Ready - Use window.performSearch(query)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
