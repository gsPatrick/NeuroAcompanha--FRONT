const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// MOCK: aceita qualquer e-mail/senha já validados e simula a latência da rede.
// Quando existir backend, troque por uma chamada à API (autenticação real é do servidor).
export async function login() {
  await wait(800);
  return { ok: true };
}
