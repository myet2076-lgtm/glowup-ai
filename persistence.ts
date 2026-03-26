import { get, set, del, keys, entries } from 'idb-keyval';
import { MakeupAnalysis, Product } from './types';

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  source: 'quiz' | 'celebrity' | 'inspiration';
  analysis: MakeupAnalysis;
  userPhoto: string | null;
  inspoPhoto: string | null;
  tryOnImage: string | null;
}

const ANALYSES_PREFIX = 'analysis_';
const PROFILE_KEY = 'master_profile_photo';

export async function saveAnalysis(data: SavedAnalysis): Promise<void> {
  await set(ANALYSES_PREFIX + data.id, data);
}

export async function updateAnalysisTryOn(id: string, tryOnImage: string): Promise<void> {
  const existing = await get<SavedAnalysis>(ANALYSES_PREFIX + id);
  if (existing) {
    existing.tryOnImage = tryOnImage;
    await set(ANALYSES_PREFIX + id, existing);
  }
}

export async function loadAllAnalyses(): Promise<SavedAnalysis[]> {
  const allEntries = await entries();
  return allEntries
    .filter(([key]) => (key as string).startsWith(ANALYSES_PREFIX))
    .map(([, value]) => value as SavedAnalysis)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function loadAnalysis(id: string): Promise<SavedAnalysis | null> {
  return (await get<SavedAnalysis>(ANALYSES_PREFIX + id)) || null;
}

export async function deleteAnalysis(id: string): Promise<void> {
  await del(ANALYSES_PREFIX + id);
}

export async function saveProfilePhoto(photo: string): Promise<void> {
  await set(PROFILE_KEY, photo);
}

export async function loadProfilePhoto(): Promise<string | null> {
  return (await get<string>(PROFILE_KEY)) || null;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Inventory Persistence ---

const INVENTORY_PREFIX = 'inventory_';

export async function saveInventoryItem(product: Product & { id: string }): Promise<void> {
  await set(INVENTORY_PREFIX + product.id, product);
}

export async function loadAllInventory(): Promise<(Product & { id: string })[]> {
  const allEntries = await entries();
  return allEntries
    .filter(([key]) => (key as string).startsWith(INVENTORY_PREFIX))
    .map(([, value]) => value as Product & { id: string });
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await del(INVENTORY_PREFIX + id);
}
