let trigger = null;

// Vibração curta ao tocar. O Safari do iPhone não tem navigator.vibrate, mas ligar um
// <input type="checkbox" switch> durante um toque dá o "tique" do sistema (iOS 17.4 ou mais novo).
// Em aparelhos sem esse recurso, não acontece nada. Chame sempre dentro de um evento de toque/clique.
export function haptic() {
  if (typeof document === 'undefined') return;

  try {
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
