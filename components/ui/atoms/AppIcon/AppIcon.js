import { extraIcons } from './extraIcons';
import { packIcons } from './packIcons';

// Conjunto único de ícones: pacote oficial (packIcons) + complementares no mesmo estilo (extraIcons).
// Traço 1.8 e cantos arredondados, como no pacote, para manter consistência visual.
const ICONS = { ...extraIcons, ...packIcons };

export default function AppIcon({ name, size = 24, strokeWidth = 1.8, className }) {
  const content = ICONS[name];
  if (!content) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}
