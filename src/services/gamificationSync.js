import { supabase } from '../lib/supabaseClient.js';
import { createInitialGamificationState, mergeGamificationStates, normalizeGamificationState } from '../engine/gamification.js';

const GUEST_OWNER = 'guest';

function storageKey(ownerId = GUEST_OWNER) {
  const safeOwner = String(ownerId || GUEST_OWNER).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `basyir-agency:gamification:${safeOwner}:s1`;
}

export function loadLocalGamification(ownerId = GUEST_OWNER) {
  try {
    const raw = window.localStorage.getItem(storageKey(ownerId));
    return raw ? normalizeGamificationState(JSON.parse(raw)) : createInitialGamificationState();
  } catch {
    return createInitialGamificationState();
  }
}

export function saveLocalGamification(state, ownerId = GUEST_OWNER) {
  try {
    window.localStorage.setItem(storageKey(ownerId), JSON.stringify(normalizeGamificationState(state)));
    return true;
  } catch {
    return false;
  }
}

export function mergePlayerGamification(...states) {
  return mergeGamificationStates(...states);
}

function isMissingGamificationTable(error) {
  return error?.code === '42P01'
    || error?.code === 'PGRST205'
    || /player_gamification|schema cache|does not exist/i.test(error?.message ?? '');
}

export async function fetchCloudGamification(userId) {
  if (!userId) return { available: false, state: createInitialGamificationState(), reason: 'no-user' };
  const { data, error } = await supabase
    .from('player_gamification')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (isMissingGamificationTable(error)) {
      return { available: false, state: createInitialGamificationState(), reason: 'migration-required' };
    }
    throw error;
  }

  return { available: true, state: normalizeGamificationState(data?.state) };
}

export async function saveCloudGamification(userId, state) {
  if (!userId) return { available: false, reason: 'no-user' };
  const current = await supabase
    .from('player_gamification')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();
  if (current.error) {
    if (isMissingGamificationTable(current.error)) return { available: false, reason: 'migration-required' };
    throw current.error;
  }

  const mergedState = mergeGamificationStates(current.data?.state, state);
  const { error } = await supabase
    .from('player_gamification')
    .upsert({
      user_id: userId,
      state: mergedState,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) {
    if (isMissingGamificationTable(error)) {
      return { available: false, reason: 'migration-required' };
    }
    throw error;
  }
  return { available: true, state: mergedState };
}
