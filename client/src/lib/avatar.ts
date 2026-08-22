import { API_URL } from '../api';

// Prikazuje sacuvanu profilnu sliku, ukoliko nije pronadjena prikazuje se genericna ikonica
export function resolveAvatarUrl(avatarUrl: string | null): string | undefined {
  if (!avatarUrl) return undefined;
  return avatarUrl.startsWith('/') ? `${API_URL}${avatarUrl}` : avatarUrl;
}
