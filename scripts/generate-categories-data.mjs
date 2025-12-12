#!/usr/bin/env node
/**
 * Generate static categories data for client-side use
 * Reads from src/content/categories/*.json
 * Writes to src/data/generated/categories.ts
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const CATEGORIES_DIR = 'src/content/categories';
const OUTPUT_FILE = 'src/lib/generated/categories.ts';

async function generateCategoriesData() {
  console.log('🔍 Loading categories from', CATEGORIES_DIR);

  const files = await readdir(CATEGORIES_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const categories = [];
  for (const file of jsonFiles) {
    const content = await readFile(join(CATEGORIES_DIR, file), 'utf-8');
    const data = JSON.parse(content);

    categories.push({
      id: data.id,
      name: data.name,
      slug: data.slug || data.id,
      description: data.description || '',
      keywords: data.keywords || [data.name.toLowerCase()],
      isHidden: data.isHidden || false,
      order: data.order || 999,
    });
  }

  categories.sort((a, b) => a.order - b.order);

  console.log(`✅ Found ${categories.length} categories`);

  // Generate TypeScript file
  const tsContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from src/content/categories/*.json
 * Run: npm run cms:sync
 */

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  isHidden: boolean;
  order: number;
}

export const categories: CategoryData[] = ${JSON.stringify(categories, null, 2)};

// Helper functions for client-side use
export function getAllCategories(): CategoryData[] {
  return categories;
}

export function getVisibleCategories(): CategoryData[] {
  return categories.filter(c => !c.isHidden);
}

export function getCategoryById(id: string): CategoryData | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id;
}

export function getEnabledTypes(): string[] {
  return getVisibleCategories().map(c => c.id);
}

export function getTypeKeywords(type: string): string[] {
  const cat = getCategoryById(type);
  return cat?.keywords || [];
}

export function filterVisibleTrucks<T extends { type: string; isHidden?: boolean }>(trucks: T[]): T[] {
  const visibleTypes = new Set(getEnabledTypes());
  return trucks.filter(t => visibleTypes.has(t.type) && !t.isHidden);
}
`;

  // Create directory if not exists
  await mkdir('src/lib/generated', { recursive: true });

  // Write file
  await writeFile(OUTPUT_FILE, tsContent, 'utf-8');

  console.log('✅ Generated', OUTPUT_FILE);
  console.log('\n📦 Categories data is now available for client-side use');
}

generateCategoriesData().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
