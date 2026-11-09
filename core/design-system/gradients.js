// Cores do símbolo da neurodiversidade (infinito multicolorido).
// Uso: faixa de marca, infinito em SVG e blocos de estado (atrasado / hoje / em dia).

// Do amarelo-limão ao azul-claro, na ordem em que aparecem no símbolo.
export const infinityStops = [
  { offset: 0, color: '#DDFC3C' },
  { offset: 20, color: '#F0802A' },
  { offset: 38, color: '#F22020' },
  { offset: 54, color: '#8A1C8F' },
  { offset: 66, color: '#5B26A8' },
  { offset: 80, color: '#4A5FB8' },
  { offset: 100, color: '#7EC4E8' },
];

const toCss = (stops) => stops.map(({ color, offset }) => `${color} ${offset}%`).join(', ');

export const gradients = {
  infinity: `linear-gradient(90deg, ${toCss(infinityStops)})`,
  // Estados do relatório semanal.
  alert: 'linear-gradient(135deg, #F22020 0%, #F0802A 100%)',
  today: 'linear-gradient(135deg, #F0802A 0%, #F9C833 100%)',
  ok: 'linear-gradient(135deg, #2FA84F 0%, #3FA796 55%, #7EC4E8 100%)',
};

// Cor do texto sobre cada degradê (contraste).
export const onGradient = {
  alert: '#FFFFFF',
  today: '#203D70',
  ok: '#FFFFFF',
};
