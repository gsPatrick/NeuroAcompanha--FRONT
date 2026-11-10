import { apiRequest } from '@/core/api/apiClient';

// Ilustração usada enquanto a AT não tem foto cadastrada.
const DEFAULT_AVATAR = { hair: 'long', hairColor: 'brown', skin: 'tan', clothing: 'peach', tile: 'peach' };

// A pessoa logada (a AT), no formato que as telas usam.
export async function getUser() {
  const user = await apiRequest('/auth/me');
  return {
    id: user.id,
    firstName: user.firstName,
    fullName: user.fullName,
    role: user.role,
    photo: user.photo ?? undefined,
    avatar: user.avatar ?? DEFAULT_AVATAR,
    joinedAt: user.joinedAt,
  };
}
