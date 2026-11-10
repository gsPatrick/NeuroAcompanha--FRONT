import { clearAllLocal, localAll, localGet, localPut } from './localDb';
import { processOutbox, syncNow } from './outbox';

// Dados locais pertencem a UMA conta. Quem entra neste aparelho adota os dados; se for outra conta, tudo da anterior é apagado.
export async function adoptLocalUser(userId) {
  const owner = await localGet('meta', 'userId');
  if (owner && owner.value !== userId) await clearAllLocal();
  await localPut('meta', { key: 'userId', value: userId });
  processOutbox().catch(() => {}); // voltou a ter sessão: manda o que ficou pendente
}

// Ao sair da conta: tenta enviar o que está pendente e então apaga os dados locais. Se ainda sobrar algo sem enviar
// (sem internet), os dados ficam guardados para não se perderem: saem quando a mesma conta entrar de novo
// (e são apagados se outra conta entrar).
export async function wipeLocalDataOnSignOut() {
  await syncNow(5000);
  const stillPending = (await localAll('outbox')).length > 0;
  if (!stillPending) await clearAllLocal();
}
