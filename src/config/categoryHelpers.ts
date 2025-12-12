/**
 * Server-side Category Helpers
 * Use ONLY in .astro files!
 *
 * This file uses astro:content which is server-only
 */

import type { VehicleType } from '@/models/TruckTypes';
import type { CategoryData } from '@/lib/generated/categories';
import {
  getVisibleCategories,
  getAllCategories as getAllCategoriesFromContent,
  getCategoryById,
  isTypeEnabled as isTypeEnabledFromContent,
  filterVisibleTrucks as filterVisibleTrucksFromContent,
} from '@/utils/contentCollections';
import type { Truck } from '@/models/TruckTypes';

export type CategoryKey = VehicleType;
export type CategoryConfig = CategoryData;

/**
 * Load all visible categories
 */
export async function loadCategories(): Promise<CategoryConfig[]> {
  const entries = await getVisibleCategories();

  return entries.map(entry => ({
    id: entry.data.id as CategoryKey,
    name: entry.data.name,
    slug: entry.data.slug || entry.data.id,
    isHidden: entry.data.isHidden,
    keywords: entry.data.keywords || [entry.data.name.toLowerCase()],
    description: entry.data.description || '',
    order: entry.data.order || 999,
  }));
}

/**
 * Get category by key
 */
export async function getCategoryByKey(key: CategoryKey): Promise<CategoryConfig | undefined> {
  const entry = await getCategoryById(key);
  if (!entry) return undefined;

  return {
    id: entry.data.id as CategoryKey,
    name: entry.data.name,
    slug: entry.data.slug || entry.data.id,
    isHidden: entry.data.isHidden,
    keywords: entry.data.keywords || [entry.data.name.toLowerCase()],
    description: entry.data.description || '',
    order: entry.data.order || 999,
  };
}

/**
 * Get category name
 */
export async function getCategoryName(type: CategoryKey): Promise<string> {
  const cat = await getCategoryByKey(type);
  return cat?.name || type;
}

/**
 * Get category slug
 */
export async function getCategorySlug(type: CategoryKey): Promise<string> {
  const cat = await getCategoryByKey(type);
  return cat?.slug || type;
}

/**
 * Get keywords for a type
 */
export async function getTypeKeywords(type: CategoryKey): Promise<string[]> {
  const cat = await getCategoryByKey(type);
  return cat?.keywords || [(await getCategoryName(type)).toLowerCase()];
}

/**
 * Check if category is enabled
 */
export async function isTypeEnabled(type: CategoryKey): Promise<boolean> {
  return isTypeEnabledFromContent(type);
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<CategoryConfig[]> {
  const entries = await getAllCategoriesFromContent();
  return entries.map(entry => ({
    id: entry.data.id as CategoryKey,
    name: entry.data.name,
    slug: entry.data.slug || entry.data.id,
    isHidden: entry.data.isHidden,
    keywords: entry.data.keywords || [entry.data.name.toLowerCase()],
    description: entry.data.description || '',
    order: entry.data.order || 999,
  }));
}

/**
 * Get all enabled category types
 */
export async function getEnabledTypes(): Promise<VehicleType[]> {
  const cats = await loadCategories();
  return cats.map(c => c.key as VehicleType);
}

/**
 * Filter visible trucks
 */
export async function filterVisibleTrucks<T extends Truck>(list: T[]): Promise<T[]> {
  return filterVisibleTrucksFromContent(list);
}
