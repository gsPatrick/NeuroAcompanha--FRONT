let trigger = null;

// Vibração curta. Android/Chrome: navigator.vibrate. iPhone: o Safari não tem essa API, mas ligar um
// <input type="checkbox" switch> durante um toque dá o "tique" do sistema (iOS 17.4 ou mais novo).
// Em aparelhos sem nenhum dos dois, não acontece nada. Precisa ser chamada dentro de um clique/toque.
export function haptic() {
  if (typeof document === 'undefined') return;

  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(8);
      return;
    }

    if (!trigger) {
      const label = document.createElement('label');
      label.className = 'haptic-switch';
      label.setAttribute('aria-hidden', 'true');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      input.tabIndex = -1;

      label.append(input);
      document.body.append(label);
      trigger = label;
    }
    trigger.click();
  } catch {
    // Sem suporte: segue sem vibração.
  }
}

// O que conta como "algo tocável": botões, opções, itens de menu, abas e links.
const INTERACTIVE = 'button, a[href], .tab-link, [role="button"], [role="radio"], [role="menuitem"], [role="tab"]';

// Instala UM ouvinte para o app inteiro: todo toque em algo interativo vibra, sem cada componente ter de lembrar.
// Controles desativados não vibram. Retorna a função que remove o ouvinte.
export function installHaptics() {
  if (typeof document === 'undefined') return () => {};

  const onClick = (event) => {
    const { target } = event;
    if (!(target instanceof Element)) return;
    // O clique que a própria vibração dispara no interruptor invisível não pode gerar outra vibração.
    if (target.closest('.haptic-switch')) return;

    const control = target.closest(INTERACTIVE);
    if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;

    haptic();
  };

  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
