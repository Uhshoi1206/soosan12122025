/**
 * Clean up orphan product folders
 * 
 * This script removes product folders that don't have a corresponding category.
 * 
 * Run: node scripts/cleanup-orphan-folders.cjs
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES_DIR = path.join(__dirname, '../src/content/categories');
const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');

function main() {
    console.log('🧹 Cleaning up orphan product folders...\n');

    // Get all category slugs
    const categoryFiles = fs.readdirSync(CATEGORIES_DIR).filter(f => f.endsWith('.json'));
    const categorySlugs = categoryFiles.map(f => {
        const content = fs.readFileSync(path.join(CATEGORIES_DIR, f), 'utf-8');
        const category = JSON.parse(content);
        return category.slug || category.id;
    });

    console.log(`Found ${categorySlugs.length} categories: ${categorySlugs.join(', ')}\n`);

    // Get all product folders
    const productFolders = fs.readdirSync(PRODUCTS_DIR).filter(f => {
        const stat = fs.statSync(path.join(PRODUCTS_DIR, f));
        return stat.isDirectory();
    });

    // Find orphan folders (folders without matching category)
    let removedCount = 0;
    for (const folder of productFolders) {
        if (!categorySlugs.includes(folder)) {
            const folderPath = path.join(PRODUCTS_DIR, folder);
            const files = fs.readdirSync(folderPath);

            if (files.length === 0) {
                // Remove empty folder
                fs.rmdirSync(folderPath);
                console.log(`🗑️  Removed empty folder: ${folder}/`);
                removedCount++;
            } else {
                // Folder has files - warn but don't delete
                console.log(`⚠️  Orphan folder with products: ${folder}/ (${files.length} files)`);
                console.log(`   Consider moving products or deleting manually.`);
            }
        }
    }

    console.log(`\n📊 Summary: ${removedCount} empty folder(s) removed`);
}

main();
