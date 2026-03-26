import { Product } from './types';
import { SavedAnalysis } from './persistence';
import { supabase } from './supabaseClient';

const getUserId = async (): Promise<string> => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user?.id) throw new Error('No authenticated user.');
  return data.user.id;
};

export async function upsertCloudAnalysis(data: SavedAnalysis): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('analyses').upsert(
    {
      id: data.id,
      user_id: userId,
      timestamp: data.timestamp,
      source: data.source,
      analysis: data.analysis,
      user_photo_url: data.userPhoto,
      inspo_photo_url: data.inspoPhoto,
      tryon_image_url: data.tryOnImage,
    },
    { onConflict: 'id' }
  );

  if (error) throw error;
}

export async function updateCloudTryOn(id: string, tryOnImage: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('analyses')
    .update({ tryon_image_url: tryOnImage })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function loadAllCloudAnalyses(): Promise<SavedAnalysis[]> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('analyses')
    .select('id, timestamp, source, analysis, user_photo_url, inspo_photo_url, tryon_image_url')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    source: row.source,
    analysis: row.analysis,
    userPhoto: row.user_photo_url,
    inspoPhoto: row.inspo_photo_url,
    tryOnImage: row.tryon_image_url,
  })) as SavedAnalysis[];
}

export async function loadCloudAnalysis(id: string): Promise<SavedAnalysis | null> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('analyses')
    .select('id, timestamp, source, analysis, user_photo_url, inspo_photo_url, tryon_image_url')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    timestamp: data.timestamp,
    source: data.source,
    analysis: data.analysis,
    userPhoto: data.user_photo_url,
    inspoPhoto: data.inspo_photo_url,
    tryOnImage: data.tryon_image_url,
  } as SavedAnalysis;
}

export async function deleteCloudAnalysis(id: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('analyses').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function upsertCloudInventoryItem(item: Product & { id: string }): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('inventory').upsert(
    {
      id: item.id,
      user_id: userId,
      name: item.name,
      brand: item.brand ?? null,
      category: item.category,
      description: item.description ?? null,
    },
    { onConflict: 'id' }
  );

  if (error) throw error;
}

export async function loadAllCloudInventory(): Promise<(Product & { id: string })[]> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('inventory')
    .select('id, name, brand, category, description')
    .eq('user_id', userId);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category,
    description: row.description ?? undefined,
  }));
}

export async function deleteCloudInventoryItem(id: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('inventory').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function upsertCloudProfilePhoto(masterPhotoUrl: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, master_photo_url: masterPhotoUrl }, { onConflict: 'user_id' });

  if (error) throw error;
}

export async function loadCloudProfilePhoto(): Promise<string | null> {
  const userId = await getUserId();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('profiles')
    .select('master_photo_url')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.master_photo_url ?? null;
}
