import { APP_NAME } from '@/constants/brand';

// Parâmetros globais do Framework7.
// A navegação entre telas é do Next.js (App Router); o Framework7 cuida só da UI.
export const framework7Params = {
  name: APP_NAME,
  theme: 'ios',
  // Sem modo escuro: o app é sempre claro, mesmo que o aparelho esteja no modo escuro.
  darkMode: false,
};
