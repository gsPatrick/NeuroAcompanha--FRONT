'use client';

import dynamic from 'next/dynamic';
import Splash from '@/components/layout/Splash/Splash';

// O Framework7 acessa window/document ao iniciar, então só roda no navegador.
// A tela de abertura já vai no HTML (aparece antes de qualquer JavaScript, sem piscada em branco).
const AppShellClient = dynamic(() => import('./AppShellClient'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function AppShell({ children }) {
  return <AppShellClient>{children}</AppShellClient>;
}
