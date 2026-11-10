import { isOfflineError } from '@/core/api/apiClient';
import { localGet, localPut } from './localDb';

// Leitura com rede de segurança: busca na API e guarda a resposta no aparelho; se estiver sem internet (ou o servidor
// fora do ar), devolve a última resposta guardada. Sem nada guardado, o erro segue para quem chamou.
export async function cachedRequest(key, fetcher) {
  try {
    const value = await fetcher();
    await localPut('cache', { key, value, at: Date.now() });
    return value;
  } catch (error) {
    if (!isOfflineError(error)) throw error;
    const hit = await localGet('cache', key);
    if (hit) return hit.value;
    throw error;
  }
}
