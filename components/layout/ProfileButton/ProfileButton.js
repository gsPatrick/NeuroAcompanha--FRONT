'use client';

import { useRouter } from 'next/navigation';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import styles from './ProfileButton.module.css';

// Foto do perfil no topo: maior, com borda e uma setinha. Ao tocar, abre a PÁGINA de perfil.
export default function ProfileButton({ name, photo, person }) {
  const router = useRouter();

  return (
    <button type="button" className={styles.button} aria-label={`Abrir o perfil de ${name}`} onClick={() => router.push('/profile')}>
      <span className={styles.frame}>
        <AppAvatar photo={photo} person={person} size="lg" shape="circle" />
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <AppIcon name="chevronRight" size={14} strokeWidth={2.4} />
      </span>
    </button>
  );
}
