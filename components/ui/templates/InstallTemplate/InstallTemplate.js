'use client';

import { Page } from 'framework7-react';
import { useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import InstallStep from '@/components/ui/molecules/InstallStep/InstallStep';
import { useInstall } from '@/features/install/hooks/useInstall';
import { dismissInstall } from '@/features/install/utils/installState';
import { useToast } from '@/hooks/useToast';
import styles from './InstallTemplate.module.css';

const IOS_STEPS = [
  {
    icon: 'share',
    title: 'Toque em Compartilhar',
    description: 'É o botão com um quadrado e uma seta para cima, na barra de baixo do Safari.',
  },
  {
    icon: 'addSquare',
    title: 'Escolha "Adicionar à Tela de Início"',
    description: 'Role a lista de opções para baixo até encontrar.',
  },
  {
    icon: 'check',
    title: 'Toque em "Adicionar"',
    description: 'Fica no canto de cima, à direita. O nome já vem preenchido.',
  },
  {
    icon: 'home',
    title: 'Abra pelo ícone',
    description: 'Procure o infinito colorido na tela inicial e abra o app por ele.',
  },
];

const ANDROID_STEPS = [
  {
    icon: 'menu',
    title: 'Abra o menu do navegador',
    description: 'Toque nos três pontinhos, no canto de cima do Chrome.',
  },
  {
    icon: 'addSquare',
    title: 'Toque em "Instalar app"',
    description: 'Pode aparecer como "Adicionar à tela inicial".',
  },
  {
    icon: 'home',
    title: 'Abra pelo ícone',
    description: 'Procure o infinito colorido na tela inicial e abra o app por ele.',
  },
];

// Página de instalação do PWA: explica, para cada tipo de aparelho, como colocar o app na tela inicial.
export default function InstallTemplate() {
  const router = useRouter();
  const showToast = useToast();
  const { ready, standalone, platform, canPrompt, promptInstall } = useInstall();

  const openApp = () => router.replace('/');

  const continueInBrowser = () => {
    dismissInstall();
    openApp();
  };

  const copyAddress = async () => {
    try {
      await window.navigator.clipboard.writeText(window.location.origin);
      showToast('Endereço copiado. Cole na barra do Safari.');
    } catch {
      showToast('Não foi possível copiar. Digite o endereço no Safari.');
    }
  };

  const installOnAndroid = async () => {
    const accepted = await promptInstall();
    if (accepted) showToast('App instalado. Abra pelo ícone na tela inicial.');
  };

  const isIosSafari = platform?.os === 'ios' && platform.isIosSafari;
  const isIosOther = platform?.os === 'ios' && !platform.isIosSafari;
  const isAndroid = platform?.os === 'android';
  const isComputer = platform !== null && !platform.isMobile;

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <header className={styles.header}>
          <BrandLockup size="sm" />
        </header>

        <section className={styles.body}>
          <div className={styles.texts}>
            <h1 className={styles.title}>Instale o app no seu celular</h1>
            <p className={styles.description}>
              Ele fica na tela inicial, abre em tela cheia e se atualiza sozinho. Não precisa de loja de aplicativos.
            </p>
          </div>

          {ready && standalone ? (
            <div className={styles.notice}>
              <p className={styles.noticeTitle}>O app já está instalado</p>
              <p className={styles.noticeText}>Você está usando a versão instalada.</p>
              <AppButton fullWidth onClick={openApp}>
                Abrir o app
              </AppButton>
            </div>
          ) : null}

          {ready && !standalone && isIosSafari ? (
            <ol className={styles.steps}>
              {IOS_STEPS.map((step, index) => (
                <InstallStep key={step.title} number={index + 1} {...step} />
              ))}
            </ol>
          ) : null}

          {ready && !standalone && isIosOther ? (
            <div className={styles.notice}>
              <span className={styles.noticeIcon}>
                <AppIcon name="smartphone" size={26} />
              </span>
              <p className={styles.noticeTitle}>Abra no Safari para instalar</p>
              <p className={styles.noticeText}>
                No iPhone, só o Safari consegue instalar o app. Copie o endereço, abra o Safari e cole na barra.
              </p>
              <p className={styles.address}>{typeof window === 'undefined' ? '' : window.location.origin}</p>
              <AppButton icon="copy" fullWidth onClick={copyAddress}>
                Copiar endereço
              </AppButton>
            </div>
          ) : null}

          {ready && !standalone && isAndroid ? (
            <>
              {canPrompt ? (
                <AppButton icon="download" fullWidth onClick={installOnAndroid}>
                  Instalar app
                </AppButton>
              ) : null}
              <ol className={styles.steps}>
                {ANDROID_STEPS.map((step, index) => (
                  <InstallStep key={step.title} number={index + 1} {...step} />
                ))}
              </ol>
            </>
          ) : null}

          {ready && !standalone && isComputer ? (
            <div className={styles.notice}>
              <span className={styles.noticeIcon}>
                <AppIcon name="smartphone" size={26} />
              </span>
              <p className={styles.noticeTitle}>Abra no celular</p>
              <p className={styles.noticeText}>
                A instalação é feita no celular: no iPhone, pelo Safari; no Android, pelo Chrome. Abra este endereço lá:
              </p>
              <p className={styles.address}>{typeof window === 'undefined' ? '' : window.location.origin}</p>
            </div>
          ) : null}
        </section>

        <footer className={styles.footer}>
          <AppButton variant="tertiary" fullWidth onClick={continueInBrowser}>
            {isComputer ? 'Ir para o app' : 'Continuar no navegador'}
          </AppButton>
        </footer>
      </main>
    </Page>
  );
}
