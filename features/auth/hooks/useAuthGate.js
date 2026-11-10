'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasSession, needsPasswordChange } from '../services/sessionService';
import { DEFINE_PASSWORD_ROUTE } from '../utils/afterLogin';

const PUBLIC_ROUTES = ['/login', '/instalar', '/apresentacao'];

// Quem ainda não passou pela tela de entrada (pergunta de login) cai nela, em qualquer rota;
// quem entrou com senha provisória cai na tela de definir a senha.
export function useAuthGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;
    if (!hasSession()) router.replace('/login');
    // Senha provisória: nada do app abre antes de a AT definir a própria senha.
    else if (needsPasswordChange() && pathname !== DEFINE_PASSWORD_ROUTE) router.replace(DEFINE_PASSWORD_ROUTE);
    else if (!needsPasswordChange() && pathname === DEFINE_PASSWORD_ROUTE) router.replace('/');
  }, [pathname, router]);
}
