/**
 * Auto-generate CMS config.yml from category files
 * 
 * This script reads:
 * - src/content/categories/*.json → generates product collections
 * - src/content/blog-categories/*.json → generates blog collections
 * 
 * Run: node scripts/generate-cms-config.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const CATEGORIES_DIR = path.join(__dirname, '../src/content/categories');
const BLOG_CATEGORIES_DIR = path.join(__dirname, '../src/content/blog-categories');
const OUTPUT_FILE = path.join(__dirname, '../public/loivao/config.yml');
const TEMPLATE_FILE = path.join(__dirname, 'cms-config-base.yml');

// Icon mapping for product categories
const PRODUCT_ICONS = {
    'dau-keo': '🚛',
    'xe-tai': '🚚',
    'mooc': '🚛',
    'xe-cau': '🏗️',
    'xe-lu': '🚜',
    'default': '📦'
};

// Icon mapping for blog categories
const BLOG_ICONS = {
    'tin-tuc-nganh-van-tai': '📰',
    'danh-gia-xe': '⭐',
    'kinh-nghiem-lai-xe': '🚗',
    'bao-duong': '🔧',
    'tu-van-mua-xe': '💡',
    'cong-nghe-va-doi-moi': '🔬',
    'default': '📝'
};

// Blog folder mapping (category slug -> folder name)
const BLOG_FOLDER_MAP = {
    'tin-tuc-nganh-van-tai': 'tin-tuc-nganh-van-tai',
    'danh-gia-xe': 'product-review',
    'kinh-nghiem-lai-xe': 'driver-tips',
    'bao-duong': 'maintenance',
    'tu-van-mua-xe': 'buying-guide',
    'cong-nghe-va-doi-moi': 'technology'
};

/**
 * Read all JSON files from a directory
 */
function readCategories(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    return files.map(file => {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        return JSON.parse(content);
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Ensure folder exists for a category
 */
function ensureCategoryFolder(baseDir, slug) {
    const folderPath = path.join(__dirname, '..', baseDir, slug);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
    }
}

/**
 * Generate type options for products
 */
function generateTypeOptions(categories) {
    return categories.map(cat =>
        `          - { label: "${cat.name}", value: "${cat.slug || cat.id}" }`
    ).join('\n');
}

/**
 * Generate category options for blog
 */
function generateCategoryOptions(categories) {
    return categories.map(cat =>
        `          - { label: "${cat.name}", value: "${cat.slug || cat.id}" }`
    ).join('\n');
}

/**
 * Generate product collection YAML
 */
function generateProductCollection(category, typeOptions) {
    const slug = category.slug || category.id;
    const icon = PRODUCT_ICONS[slug] || PRODUCT_ICONS.default;

    // Ensure folder exists
    ensureCategoryFolder('src/content/products', slug);

    return `
  # =========================================================
  # SẢN PHẨM - ${category.name.toUpperCase()}
  # =========================================================
  - name: "products-${slug}"
    label: "${icon} ${category.name}"
    label_singular: "${category.name}"
    folder: "src/content/products/${slug}"
    create: true
    slug: "{{id}}"
    extension: "json"
    format: "json"
    summary: "{{name}} - {{brand}}"
    sortable_fields: ['name', 'brand', 'price', 'weight']
    fields:
      - { label: "ID", name: "id", widget: "string", required: true }
      - { label: "Tên Sản Phẩm", name: "name", widget: "string", required: true }
      - { label: "Slug", name: "slug", widget: "string", required: true }
      - { label: "Hãng", name: "brand", widget: "string", required: true }
      - label: "Loại Xe"
        name: "type"
        widget: "select"
        options:
${typeOptions}
      - { label: "Giá (VNĐ)", name: "price", widget: "number", required: false }
      - { label: "Giá Hiển Thị", name: "priceText", widget: "string", required: false }
      - { label: "Trọng Tải Hiển Thị", name: "weightText", widget: "string", required: true }
      - { label: "Trọng Tải (tấn)", name: "weight", widget: "number", required: true }
      - { label: "Dài (m)", name: "length", widget: "number", required: true }
      - { label: "Rộng (m)", name: "width", widget: "number", required: true }
      - { label: "Cao (m)", name: "height", widget: "number", required: true }
      - { label: "Kích Thước", name: "dimensions", widget: "string", required: true }
      - { label: "Ảnh Đại Diện", name: "thumbnailUrl", widget: "string", required: true }
      - { label: "Ảnh Sản Phẩm", name: "images", widget: "list", required: true }
      - { label: "Mới", name: "isNew", widget: "boolean", default: false }
      - { label: "Nổi Bật", name: "isHot", widget: "boolean", default: false }
      - { label: "Ẩn", name: "isHidden", widget: "boolean", default: false }
      - label: "Tình Trạng Kho"
        name: "stockStatus"
        widget: "select"
        default: "in-stock"
        options:
          - { label: "Sẵn hàng", value: "in-stock" }
          - { label: "Hết hàng", value: "out-of-stock" }
          - { label: "Đặt trước", value: "pre-order" }
          - { label: "Ngừng kinh doanh", value: "discontinued" }
      - { label: "Xuất Xứ", name: "origin", widget: "string", required: false }
      - { label: "Mô Tả Ngắn", name: "description", widget: "text", required: false }
      - { label: "Mô Tả Chi Tiết", name: "detailedDescription", widget: "markdown", required: false }
      - { label: "Tính Năng", name: "features", widget: "list", required: false }
      - { label: "Model Động Cơ", name: "engineModel", widget: "string", required: false }
      - { label: "Dung Tích Động Cơ", name: "engineCapacity", widget: "string", required: false }
      - { label: "Công Suất Động Cơ", name: "enginePower", widget: "string", required: false }
      - { label: "Mô-men Xoắn", name: "engineTorque", widget: "string", required: false }
      - { label: "Tiêu Chuẩn Khí Thải", name: "emissionStandard", widget: "string", required: false }
      - { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }`;
}

/**
 * Generate blog collection YAML
 */
function generateBlogCollection(category, categoryOptions) {
    const slug = category.slug || category.id;
    const icon = BLOG_ICONS[slug] || BLOG_ICONS.default;
    const folderName = BLOG_FOLDER_MAP[slug] || slug;

    // Ensure folder exists
    ensureCategoryFolder('src/content/blog', folderName);

    return `
  # =========================================================
  # BÀI VIẾT - ${category.name.toUpperCase()}
  # =========================================================
  - name: "blog-${slug}"
    label: "${icon} ${category.name}"
    label_singular: "Bài Viết"
    folder: "src/content/blog/${folderName}"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    summary: "{{title}}"
    sortable_fields: ['title', 'publishDate']
    fields:
      - { label: "ID", name: "id", widget: "string", required: true }
      - { label: "Tiêu Đề", name: "title", widget: "string", required: true }
      - { label: "Slug", name: "slug", widget: "string", required: true }
      - { label: "Mô Tả", name: "description", widget: "text", required: true }
      - label: "Danh Mục"
        name: "category"
        widget: "select"
        options:
${categoryOptions}
      - { label: "Ảnh", name: "images", widget: "list", required: true }
      - { label: "Ngày Đăng (timestamp)", name: "publishDate", widget: "number", required: true }
      - { label: "Thời Gian Đọc (phút)", name: "readTime", widget: "number", required: true }
      - { label: "Tác Giả", name: "author", widget: "string", required: true }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Lượt Xem", name: "views", widget: "number", default: 0 }
      - { label: "Bình Luận", name: "comments", widget: "number", default: 0 }
      - { label: "Ẩn", name: "isHidden", widget: "boolean", default: false }
      - { label: "Nội Dung", name: "body", widget: "markdown", required: true }
      - { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }`;
}

/**
 * Main function
 */
function main() {
    console.log('🔄 Generating CMS config.yml...\n');

    // Read categories
    const productCategories = readCategories(CATEGORIES_DIR);
    const blogCategories = readCategories(BLOG_CATEGORIES_DIR);

    console.log(`Found ${productCategories.length} product categories`);
    console.log(`Found ${blogCategories.length} blog categories\n`);

    // Generate options
    const typeOptions = generateTypeOptions(productCategories);
    const categoryOptions = generateCategoryOptions(blogCategories);

    // Read base template
    if (!fs.existsSync(TEMPLATE_FILE)) {
        console.error(`Template file not found: ${TEMPLATE_FILE}`);
        process.exit(1);
    }
    const baseConfig = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    // Generate product collections
    const productCollections = productCategories
        .filter(cat => !cat.isHidden)
        .map(cat => generateProductCollection(cat, typeOptions))
        .join('\n');

    // Generate blog collections
    const blogCollections = blogCategories
        .filter(cat => !cat.isHidden)
        .map(cat => generateBlogCollection(cat, categoryOptions))
        .join('\n');

    // Combine everything
    const finalConfig = baseConfig
        .replace('{{PRODUCT_COLLECTIONS}}', productCollections)
        .replace('{{BLOG_COLLECTIONS}}', blogCollections);

    // Write output
    fs.writeFileSync(OUTPUT_FILE, finalConfig, 'utf-8');
    console.log(`✅ Generated: ${OUTPUT_FILE}`);
    console.log(`   - ${productCategories.length} product collections`);
    console.log(`   - ${blogCategories.length} blog collections`);
}

main();
