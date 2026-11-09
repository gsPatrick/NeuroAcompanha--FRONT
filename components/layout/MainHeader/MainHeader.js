'use client';

import { useUser } from '@/features/user/hooks/useUser';
import AppHeader from '../AppHeader/AppHeader';
import ProfileButton from '../ProfileButton/ProfileButton';

// Topo das telas principais (Hoje, Crianças, Agenda): logo + nome do app e o botão do perfil da AT.
// Busca a AT sozinho; enquanto carrega, mostra só a logo.
export default function MainHeader() {
  const { user } = useUser();

  return <AppHeader right={user ? <ProfileButton name={user.firstName} photo={user.photo} person={user.avatar} /> : null} />;
}
