import 'framework7/css/bundle';
import './globals.css';
import { buildCssVariables } from '@/core/design-system/tokens';
import AppShell from '@/components/layout/AppShell/AppShell';
import { APP_DESCRIPTION, APP_NAME } from '@/constants/brand';
import { SPLASH_SIZES, splashMedia, splashPath } from '@/constants/splash';

export const metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    // 'default': relógio e bateria em preto sobre fundo claro, como o resto do app. ('black-translucent'
    // deixaria o relógio branco sobre a tela branca, e ele sumiria.)
    statusBarStyle: 'default',
    // Telas de abertura do iOS, uma por tamanho de iPhone (ver constants/splash.js).
    startupImage: SPLASH_SIZES.map((size) => ({ url: splashPath(size), media: splashMedia(size) })),
  },
  formatDetection: { telephone: false },
  other: { 'apple-mobile-web-app-capable': 'yes' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
  // Tema único (claro): o navegador não escurece o app, mesmo com o aparelho em modo escuro.
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: o Framework7 e extensões do navegador adicionam classes ao <html>.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Tokens do Design System (JS -> variáveis CSS). */}
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: buildCssVariables() }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
