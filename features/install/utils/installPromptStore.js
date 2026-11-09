// No Android/Chrome o navegador avisa (beforeinstallprompt) que o app pode ser instalado, uma única vez e cedo.
// Guardamos esse aviso aqui, desde a abertura do app, para a página de instalação poder usá-lo depois.
let deferredPrompt = null;
let started = false;
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener());

export function startCapturingInstallPrompt() {
  if (started || typeof window === 'undefined') return;
  started = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

export const hasInstallPrompt = () => deferredPrompt !== null;

export function subscribeInstallPrompt(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Abre a janela de instalação do navegador. Retorna true se a pessoa aceitou.
export async function promptInstall() {
  if (!deferredPrompt) return false;

  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  notify();

  promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  return choice.outcome === 'accepted';
}
