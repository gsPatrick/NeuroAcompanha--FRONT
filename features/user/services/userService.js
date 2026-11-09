import { userMock } from './user.mock';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// MOCK: simula a latência da rede. Troque por uma chamada à API mantendo o mesmo retorno.
export async function getUser() {
  await wait(200);
  return structuredClone(userMock);
}
