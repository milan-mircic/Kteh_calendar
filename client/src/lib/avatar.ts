import { API_URL } from '../api';

// Uploaded avatars are stored as server-relative paths (e.g. "/uploads/xyz.png").
export function resolveAvatarUrl(avatarUrl: string | null): string | undefined {
  if (!avatarUrl) return undefined;
  return avatarUrl.startsWith('/') ? `${API_URL}${avatarUrl}` : avatarUrl;
}
