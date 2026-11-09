// Navegadores de iPhone que NÃO instalam o app (só o Safari instala): Chrome, Firefox, Edge, Opera, DuckDuckGo
// e os navegadores embutidos de aplicativos (Instagram, Facebook, WhatsApp, Line, WeChat...).
const IOS_BROWSERS_WITHOUT_INSTALL =
  /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo|GSA\/|FBAN|FBAV|Instagram|Line\/|MicroMessenger|WhatsApp/i;

// Descobre o tipo de aparelho a partir do navegador. Função pura (fácil de testar).
// os: ios | android | other     isMobile: celular ou tablet     isIosSafari: iPhone/iPad no Safari (instala)
export function detectPlatform({ userAgent = '', platform = '', maxTouchPoints = 0 } = {}) {
  const isIphone = /iPhone|iPod/.test(userAgent);
  // iPad recente se identifica como Mac: a diferença é a tela de toque.
  const isIpad = /iPad/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isIos = isIphone || isIpad;
  const isAndroid = /Android/i.test(userAgent);

  return {
    os: isIos ? 'ios' : isAndroid ? 'android' : 'other',
    isMobile: isIos || isAndroid,
    isIosSafari: isIos && /Safari/.test(userAgent) && !IOS_BROWSERS_WITHOUT_INSTALL.test(userAgent),
  };
}
