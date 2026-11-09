// Versão do app que ESTA aba carregou (definida na hora do build, ver next.config.mjs).
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev';

// Telas com formulário: nelas a atualização nunca recarrega sozinha (só avisa), para ninguém perder o que digitou.
export const NO_AUTO_RELOAD_PATHS = ['/login', '/onboarding'];

// Na Vercel a versão é o código do commit (ex.: "85b07f4"); no computador é só a hora do build.
export function formatVersion(version = APP_VERSION) {
  return /^\d{10,}$/.test(version) ? 'em desenvolvimento' : version;
}
