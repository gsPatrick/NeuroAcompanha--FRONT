// Tamanhos de iPhone em retrato para as telas de abertura (splash) do iOS.
// cssWidth/cssHeight: tamanho da tela em pontos; dpr: densidade de pixels. A imagem tem (cssWidth*dpr) x (cssHeight*dpr).
// O iOS só usa a tela de abertura se uma delas bater exatamente com o aparelho.
export const SPLASH_SIZES = [
  { cssWidth: 440, cssHeight: 956, dpr: 3 }, // iPhone 16 Pro Max
  { cssWidth: 402, cssHeight: 874, dpr: 3 }, // iPhone 16 Pro
  { cssWidth: 430, cssHeight: 932, dpr: 3 }, // iPhone 16 Plus / 15 Plus / 15 Pro Max / 14 Pro Max
  { cssWidth: 393, cssHeight: 852, dpr: 3 }, // iPhone 16 / 15 / 15 Pro / 14 Pro
  { cssWidth: 390, cssHeight: 844, dpr: 3 }, // iPhone 14 / 13 / 13 Pro / 12 / 12 Pro
  { cssWidth: 375, cssHeight: 812, dpr: 3 }, // iPhone 13 mini / 12 mini / 11 Pro / XS / X
  { cssWidth: 414, cssHeight: 896, dpr: 3 }, // iPhone 11 Pro Max / XS Max
  { cssWidth: 414, cssHeight: 896, dpr: 2 }, // iPhone 11 / XR
  { cssWidth: 414, cssHeight: 736, dpr: 3 }, // iPhone 8 Plus
  { cssWidth: 375, cssHeight: 667, dpr: 2 }, // iPhone SE / 8
];

export const splashPixels = ({ cssWidth, cssHeight, dpr }) => ({ width: cssWidth * dpr, height: cssHeight * dpr });

export const splashPath = (size) => {
  const { width, height } = splashPixels(size);
  return `/splash/${width}x${height}`;
};

export const splashMedia = ({ cssWidth, cssHeight, dpr }) =>
  `(device-width: ${cssWidth}px) and (device-height: ${cssHeight}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`;
