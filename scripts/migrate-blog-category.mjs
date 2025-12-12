#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BLOG_DIR = path.join(rootDir, 'src/content/blog');
const BLOG_DATA_DIR = path.join(rootDir, 'src/data/blog-posts');

function updateCategoryInMarkdownFiles(oldCategoryId, newCategoryId) {
  console.log(`\n🔍 Searching for markdown files with category "${oldCategoryId}"...`);

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const oldPattern = `category: "${oldCategoryId}"`;
    const newPattern = `category: "${newCategoryId}"`;

    if (content.includes(oldPattern)) {
      content = content.replace(new RegExp(oldPattern, 'g'), newPattern);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`  ✓ Updated: ${file}`);
    }
  });

  console.log(`\n📝 Updated ${updatedCount} markdown file(s)`);
  return updatedCount;
}

function updateCategoryInTypeScriptFiles(oldCategoryId, newCategoryId, dir = BLOG_DATA_DIR) {
  console.log(`\n🔍 Searching for TypeScript files with category '${oldCategoryId}'...`);

  let updatedCount = 0;

  function processDirectory(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    items.forEach(item => {
      const fullPath = path.join(directory, item.name);

      if (item.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.name.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');

        const oldPattern = `category: '${oldCategoryId}'`;
        const newPattern = `category: '${newCategoryId}'`;

        if (content.includes(oldPattern)) {
          content = content.replace(new RegExp(oldPattern.replace(/'/g, "\\'"), 'g'), newPattern);
          fs.writeFileSync(fullPath, content, 'utf8');
          updatedCount++;
          console.log(`  ✓ Updated: ${path.relative(BLOG_DATA_DIR, fullPath)}`);
        }
      }
    });
  }

  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }

  console.log(`\n📝 Updated ${updatedCount} TypeScript file(s)`);
  return updatedCount;
}

function getCategoryMapping() {
  const categoriesDir = path.join(rootDir, 'src/content/blog-categories');
  const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));

  const mapping = {};

  files.forEach(file => {
    const fileName = file.replace('.json', '');
    const filePath = path.join(categoriesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (fileName !== content.id) {
      mapping[fileName] = content.id;
    }
  });

  return mapping;
}

function main() {
  console.log('🚀 Blog Category Migration Tool\n');
  console.log('=' .repeat(50));

  const args = process.argv.slice(2);

  if (args.length === 2) {
    const [oldId, newId] = args;
    console.log(`\n📋 Manual Migration: "${oldId}" → "${newId}"`);

    const mdCount = updateCategoryInMarkdownFiles(oldId, newId);
    const tsCount = updateCategoryInTypeScriptFiles(oldId, newId);

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Total files updated: ${mdCount + tsCount}`);
    console.log('='.repeat(50) + '\n');
  } else {
    console.log('\n📋 Auto-detecting category changes...');

    const mapping = getCategoryMapping();
    const mappingCount = Object.keys(mapping).length;

    if (mappingCount === 0) {
      console.log('\n✨ No category ID changes detected. All files match their IDs.');
      console.log('\nℹ️  Usage: node scripts/migrate-blog-category.mjs <old-id> <new-id>');
      return;
    }

    console.log(`\n⚠️  Found ${mappingCount} category ID change(s):\n`);

    let totalMd = 0;
    let totalTs = 0;

    Object.entries(mapping).forEach(([oldId, newId]) => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📝 Migrating: "${oldId}" → "${newId}"`);
      console.log('='.repeat(50));

      const mdCount = updateCategoryInMarkdownFiles(oldId, newId);
      const tsCount = updateCategoryInTypeScriptFiles(oldId, newId);

      totalMd += mdCount;
      totalTs += tsCount;
    });

    console.log('\n' + '='.repeat(50));
    console.log(`✅ All migrations complete!`);
    console.log(`   Markdown files: ${totalMd}`);
    console.log(`   TypeScript files: ${totalTs}`);
    console.log(`   Total: ${totalMd + totalTs}`);
    console.log('='.repeat(50) + '\n');
  }
}

main();
