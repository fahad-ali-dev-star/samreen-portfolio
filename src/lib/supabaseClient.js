import { createClient } from '@supabase/supabase-js';

const runtimeConfig = typeof window !== 'undefined' ? window : {};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || runtimeConfig.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeConfig.SUPABASE_ANON_KEY || '';

const DEFAULT_ADMIN_ALLOWLIST = [
  'uistudio.28@gmail.com',
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function canonicalizeEmail(email) {
  const normalized = normalizeEmail(email);
  const [localPart, domain] = normalized.split('@');

  if (!localPart || !domain) {
    return normalized;
  }

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const localWithoutTags = localPart.split('+')[0].replace(/\./g, '');
    return `${localWithoutTags}@gmail.com`;
  }

  return normalized;
}

const runtimeAllowlist = Array.isArray(runtimeConfig.ADMIN_EMAIL_ALLOWLIST)
  ? runtimeConfig.ADMIN_EMAIL_ALLOWLIST
  : null;

export const ADMIN_EMAIL_ALLOWLIST = (runtimeAllowlist || DEFAULT_ADMIN_ALLOWLIST)
  .map(email => normalizeEmail(email))
  .filter(Boolean);

export const ADMIN_EMAIL_ALLOWLIST_CANONICAL = ADMIN_EMAIL_ALLOWLIST
  .map(email => canonicalizeEmail(email));

export function isAllowedAdminEmail(email) {
  const normalized = normalizeEmail(email);
  const canonical = canonicalizeEmail(email);
  return ADMIN_EMAIL_ALLOWLIST.includes(normalized) || ADMIN_EMAIL_ALLOWLIST_CANONICAL.includes(canonical);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
export const supabaseUrl = SUPABASE_URL;
