// DADOS FICTÍCIOS (mock) da pessoa logada (a AT).
// Quando existir backend, este arquivo é removido e o userService passa a chamar a API.
export const userMock = {
  firstName: 'Amanda',
  role: 'Acompanhante terapêutica (AT)',
  // Foto quadrada, já recortada no rosto. Sem ela, vale a ilustração em `avatar`.
  photo: '/images/amanda.jpg',
  avatar: { hair: 'long', hairColor: 'brown', skin: 'tan', clothing: 'peach', tile: 'peach' },
};
