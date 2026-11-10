// Paleta: azul-marinho (primary) + pêssego (accent) sobre fundo claro.
// O app tem um único tema (claro): não existe modo escuro.
// Todos os valores de cor do app devem vir daqui (via variáveis CSS --color-*).

export const colors = {
  primary: '#203D70',
  primaryRgb: '32, 61, 112',
  primaryStrong: '#162C55',
  primaryLight: '#D5E0F1',
  onPrimary: '#FFFFFF',

  accent: '#EE9F7E',
  accentStrong: '#B4532D',
  accentLight: '#FBEAE5',
  onAccent: '#203D70',

  background: '#FFFFFF',
  backgroundRgb: '255, 255, 255',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F7',

  textPrimary: '#1B2A4A',
  textSecondary: '#4F5D78',
  textTertiary: '#7C879C',

  border: 'rgba(27, 42, 74, 0.10)',

  // Cinza neutro das marcações do registro (bolinha com X).
  gray: '#4A4F57',
  grayLight: '#EEEFF1',
  grayBorder: '#9AA0A8',

  success: '#2E8F63',
  successLight: '#E2F3EA',
  warning: '#B26F10',
  warningLight: '#FBEFD9',
  danger: '#C8443B',
  dangerLight: '#FBE6E3',
  onDanger: '#FFFFFF',

  // Roxo do símbolo da neurodiversidade: marca "hoje" no calendário.
  today: '#5B26A8',
  onToday: '#FFFFFF',
};
