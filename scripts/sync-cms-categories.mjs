#!/usr/bin/env node
/**
 * Auto-sync categories to CMS config
 * Automatically updates public/loivao/config.yml with category options
 *
 * Run manually: node scripts/sync-cms-categories.mjs
 * Or add to package.json: "cms:sync": "node scripts/sync-cms-categories.mjs"
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CATEGORIES_DIR = 'src/content/categories';
const CMS_CONFIG_PATH = 'public/loivao/config.yml';

async function loadCategories() {
  const files = await readdir(CATEGORIES_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const categories = [];
  for (const file of jsonFiles) {
    const content = await readFile(join(CATEGORIES_DIR, file), 'utf-8');
    const data = JSON.parse(content);

    // Include all categories (CMS will handle visibility)
    categories.push({
      label: data.name,
      value: data.id || data.slug,
      order: data.order || 999,
    });
  }

  return categories.sort((a, b) => a.order - b.order);
}

async function updateCMSConfig() {
  console.log('🔍 Scanning categories...');
  const categories = await loadCategories();

  console.log(`✅ Found ${categories.length} categories:`);
  categories.forEach(cat => console.log(`   - ${cat.label} (${cat.value})`));

  console.log('\n📝 Updating CMS config...');
  const configContent = await readFile(CMS_CONFIG_PATH, 'utf-8');

  // Find and replace the type field options
  const typeFieldRegex = /(- label: "Loại Xe"[\s\S]*?widget: "select"[\s\S]*?options:\s*\n)([\s\S]*?)(\n\s*- \{)/;

  const optionsYaml = categories
    .map(cat => `          - { label: "${cat.label}", value: "${cat.value}" }`)
    .join('\n');

  const newConfig = configContent.replace(
    typeFieldRegex,
    `$1${optionsYaml}$3`
  );

  await writeFile(CMS_CONFIG_PATH, newConfig, 'utf-8');

  console.log('✅ CMS config updated!');
  console.log(`\n📦 ${categories.length} category options now available in CMS dropdown`);
  console.log('\n💡 Tip: Category visibility is controlled by "isHidden" field in each category JSON');
}

updateCMSConfig().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err);
  process.exit(1);
});
