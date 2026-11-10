import { apiRequest } from '@/core/api/apiClient';
import { cachedRequest } from '@/core/offline/cache';

// Ilustração usada enquanto a AT não tem foto cadastrada.
const DEFAULT_AVATAR = { hair: 'long', hairColor: 'brown', skin: 'tan', clothing: 'peach', tile: 'peach' };

// A pessoa logada (a AT), no formato que as telas usam.
const toUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  fullName: user.fullName,
  role: user.role,
  photo: user.photo ?? undefined,
  avatar: user.avatar ?? DEFAULT_AVATAR,
  joinedAt: user.joinedAt,
});

export async function getUser() {
  return toUser(await cachedRequest('me', () => apiRequest('/auth/me')));
}

// Muda o que a AT pode editar no próprio perfil: { fullName?, role?, photo? } (photo null remove).
export async function updateUser(changes) {
  return toUser(await apiRequest('/auth/me', { method: 'PATCH', body: changes }));
}
