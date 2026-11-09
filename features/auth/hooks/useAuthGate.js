'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasSession } from '../services/sessionService';

const PUBLIC_ROUTES = ['/login', '/instalar'];

// Quem ainda não passou pela tela de entrada (pergunta de login) cai nela, em qualquer rota.
export function useAuthGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!PUBLIC_ROUTES.includes(pathname) && !hasSession()) router.replace('/login');
  }, [pathname, router]);
}
