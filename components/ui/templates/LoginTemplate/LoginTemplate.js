'use client';

import { Page } from 'framework7-react';
import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import IllustrationGrid from '@/components/ui/molecules/IllustrationGrid/IllustrationGrid';
import LoginForm from '@/features/auth/components/LoginForm/LoginForm';
import LoginGate from '@/features/auth/components/LoginGate/LoginGate';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useToast } from '@/hooks/useToast';
import { COMING_SOON_MESSAGE } from '@/constants/navigation';
import styles from './LoginTemplate.module.css';

// Duas áreas: ilustrações (espaço restante, ~70%) + painel inferior (~30%).
// O painel começa como "gate" e cresce ao confirmar, mostrando o formulário.
export default function LoginTemplate() {
  const login = useLogin();
  const showToast = useToast();
  const isForm = login.step === 'form';

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <section className={styles.art}>
          <div className={styles.brand}>
            <BrandLockup />
          </div>
          <div className={styles.gridArea}>
            <IllustrationGrid compact={isForm} />
          </div>
        </section>

        <section className={`${styles.panel} ${isForm ? styles.panelForm : ''}`} aria-live="polite">
          <div key={login.step} className={styles.step}>
            {isForm ? (
              <LoginForm
                values={login.values}
                errors={login.errors}
                submitError={login.submitError}
                submitting={login.submitting}
                onChange={login.changeField}
                onSubmit={login.submit}
                onBack={login.backToGate}
                onForgotPassword={() => showToast(COMING_SOON_MESSAGE)}
              />
            ) : (
              <LoginGate
                onConfirm={login.openForm}
                onSkip={login.skip}
                onFaceId={login.faceIdAvailable ? login.signInWithFaceId : undefined}
                enteringWithFaceId={login.enteringWithFaceId}
              />
            )}
          </div>
        </section>
      </main>
    </Page>
  );
}
