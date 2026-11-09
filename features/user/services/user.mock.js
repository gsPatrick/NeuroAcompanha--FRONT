// DADOS FICTÍCIOS (mock) da pessoa logada (a AT).
// Quando existir backend, este arquivo é removido e o userService passa a chamar a API.
export const userMock = {
  firstName: 'Amanda',
  role: 'Acompanhante terapêutica (AT)',
  // Foto quadrada, já recortada no rosto. Sem ela, vale a ilustração em `avatar`.
  photo: '/images/amanda.jpg',
  // Quando a AT entrou na plataforma (ISO). Usado para mostrar o tempo de casa.
  joinedAt: '2025-03-10',
  avatar: { hair: 'long', hairColor: 'brown', skin: 'tan', clothing: 'peach', tile: 'peach' },
};
