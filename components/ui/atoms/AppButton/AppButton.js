import styles from './AppButton.module.css';
import AppIcon from '../AppIcon/AppIcon';

// variant: primary | secondary | outline | tertiary | destructive | icon | accentIcon (ícone em pêssego, avanço de etapas)
// size: lg (padrão, 52px) | md (44px, em formato de pílula, para botões dentro de cards)
// pressed: para botões que ligam/desligam um estado (ex.: Suspenso). Informa true/false; omitido = botão comum.
// Para variantes de ícone (icon, accentIcon), informe `ariaLabel` (obrigatório para acessibilidade).
export default function AppButton({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  ariaLabel,
  loading = false,
  disabled = false,
  fullWidth = false,
  pressed,
  type = 'button',
  onClick,
}) {
  const isIcon = variant === 'icon' || variant === 'accentIcon';
  const classes = [
    styles.button,
    styles[variant],
    size === 'md' ? styles.md : '',
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    pressed ? styles.pressed : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={isIcon ? ariaLabel : undefined}
      aria-busy={loading || undefined}
      aria-pressed={pressed}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {icon ? <AppIcon name={icon} size={isIcon ? 22 : 20} /> : null}
      {isIcon ? null : <span className={styles.label}>{children}</span>}
    </button>
  );
}
