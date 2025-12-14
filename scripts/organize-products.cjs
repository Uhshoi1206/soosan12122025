/**
 * Auto-organize products by category
 * 
 * This script reads all product files and moves them to the folder
 * that matches their "type" field.
 * 
 * Example:
 * - If product has type: "xe-nang" but is in mooc/ folder
 * - Script will move it to xe-nang/ folder
 * 
 * Run: node scripts/organize-products.cjs
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');

/**
 * Get all product files recursively
 */
function getAllProductFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllProductFiles(fullPath));
        } else if (item.endsWith('.json')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Get folder name from file path
 */
function getFolderName(filePath) {
    const relativePath = path.relative(PRODUCTS_DIR, filePath);
    const parts = relativePath.split(path.sep);
    return parts.length > 1 ? parts[0] : null;
}

/**
 * Main function
 */
function main() {
    console.log('📦 Organizing products by category...\n');

    const productFiles = getAllProductFiles(PRODUCTS_DIR);
    let movedCount = 0;

    for (const filePath of productFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const product = JSON.parse(content);

            // Get current folder and product type
            const currentFolder = getFolderName(filePath);
            const productType = product.type;

            // Skip if type is not set
            if (!productType) {
                console.log(`⚠️  No type set: ${path.basename(filePath)}`);
                continue;
            }

            // Check if product is in wrong folder
            if (currentFolder && currentFolder !== productType) {
                // Create target folder if not exists
                const targetFolder = path.join(PRODUCTS_DIR, productType);
                if (!fs.existsSync(targetFolder)) {
                    fs.mkdirSync(targetFolder, { recursive: true });
                    console.log(`📁 Created folder: ${productType}/`);
                }

                // Move file
                const fileName = path.basename(filePath);
                const targetPath = path.join(targetFolder, fileName);

                fs.renameSync(filePath, targetPath);
                console.log(`✅ Moved: ${fileName}`);
                console.log(`   ${currentFolder}/ → ${productType}/`);
                movedCount++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    console.log(`\n📊 Summary: ${movedCount} file(s) moved`);
}

main();
