// Ilustração usada quando o aluno não tem foto (ver PersonIllustration). Não identifica a criança.
const AVATARS = [
  { hair: 'curly', hairColor: 'navy', skin: 'tan', clothing: 'blush', tile: 'peach' },
  { hair: 'ponytail', hairColor: 'ginger', skin: 'light', clothing: 'navy', tile: 'peach' },
  { hair: 'short', hairColor: 'brown', skin: 'deep', clothing: 'mist', tile: 'mist' },
  { hair: 'long', hairColor: 'black', skin: 'deep', clothing: 'peach', tile: 'peach' },
  { hair: 'curly', hairColor: 'black', skin: 'medium', clothing: 'navy', tile: 'mist' },
  { hair: 'bun', hairColor: 'brown', skin: 'light', clothing: 'peach', tile: 'peach' },
  { hair: 'short', hairColor: 'navy', skin: 'medium', clothing: 'blush', tile: 'mist' },
  { hair: 'long', hairColor: 'ginger', skin: 'tan', clothing: 'mist', tile: 'peach' },
];

export function pickDefaultAvatar(index) {
  return AVATARS[index % AVATARS.length];
}
