import { lightColors, darkColors } from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { lightShadows, darkShadows } from './shadows';
import { gradients, onGradient } from './gradients';

export const motion = {
  fast: '150ms',
  base: '260ms',
  slow: '440ms',
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export const sizes = {
  control: '44px',
  controlLg: '52px',
  gutter: '20px',
};

const toKebab = (key) => key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);

const declare = (prefix, values) =>
  Object.entries(values)
    .map(([key, value]) => `--${prefix}-${toKebab(key)}:${value};`)
    .join('');

// Gera as variáveis CSS (claro + escuro) a partir dos tokens JS.
// Fonte única da verdade: nenhum componente deve usar valores soltos.
export function buildCssVariables() {
  const shared =
    `--font-family:${fontFamily};` +
    declare('font-size', fontSize) +
    declare('font-weight', fontWeight) +
    declare('line-height', lineHeight) +
    declare('space', spacing) +
    declare('radius', radius) +
    declare('motion', motion) +
    declare('size', sizes) +
    declare('gradient', gradients) +
    declare('on-gradient', onGradient);

  const light = declare('color', lightColors) + declare('shadow', lightShadows);
  const dark = declare('color', darkColors) + declare('shadow', darkShadows);

  return `:root{color-scheme:light dark;${shared}${light}}@media (prefers-color-scheme: dark){:root{${dark}}}`;
}
