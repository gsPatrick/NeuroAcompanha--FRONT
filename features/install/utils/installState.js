import { detectPlatform } from './detectPlatform';

const DISMISSED_KEY = 'neuro-acompanha:install-dismissed';

// O app está aberto instalado (tela cheia, sem barra do navegador)? iOS usa navigator.standalone.
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Tipo de aparelho. Para pré-visualizar a página em outro aparelho, abra /instalar?ver=ios | ios-outro | android | pc
export function readPlatform() {
  const preview = new URLSearchParams(window.location.search).get('ver');
  const previews = {
    ios: { os: 'ios', isMobile: true, isIosSafari: true },
    'ios-outro': { os: 'ios', isMobile: true, isIosSafari: false },
    android: { os: 'android', isMobile: true, isIosSafari: false },
    pc: { os: 'other', isMobile: false, isIosSafari: false },
  };
  if (preview && previews[preview]) return previews[preview];

  return detectPlatform({
    userAgent: window.navigator.userAgent,
    platform: window.navigator.platform,
    maxTouchPoints: window.navigator.maxTouchPoints,
  });
}

// A pessoa escolheu "Continuar no navegador"? (preferência simples, não sensível)
export function isInstallDismissed() {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissInstall() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // Sem armazenamento: a página de instalação volta a aparecer na próxima abertura.
  }
}
