import { supabaseUrl } from './supabaseClient';

export function getImageUrl(path) {
  if (!path) {
    return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80';
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${supabaseUrl}/storage/v1/object/public/project-images/${path}`;
}
