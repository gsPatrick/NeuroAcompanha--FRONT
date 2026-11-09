'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Splash from '@/components/layout/Splash/Splash';

// Páginas públicas, fora do app: renderizam direto no servidor (ficam completas para busca e compartilhamento),
// sem o Framework7, a tela de abertura nem os avisos de login e instalação.
const PUBLIC_PAGES = ['/apresentacao'];

// O Framework7 acessa window/document ao iniciar, então só roda no navegador.
// A tela de abertura já vai no HTML (aparece antes de qualquer JavaScript, sem piscada em branco).
const AppShellClient = dynamic(() => import('./AppShellClient'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function AppShell({ children }) {
  const pathname = usePathname();
  if (PUBLIC_PAGES.includes(pathname)) return children;
  return <AppShellClient>{children}</AppShellClient>;
}
