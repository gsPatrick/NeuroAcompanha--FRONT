// Versão desta publicação: na Vercel é o código do commit (muda a cada deploy); fora dela, a hora do build.
// O app instalado compara a versão que carregou com a que o servidor informa em /api/version: se mudou, atualiza.
const appVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? String(Date.now());

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera um servidor mínimo em .next/standalone (usado pela imagem Docker).
  output: 'standalone',
  // O service worker nunca pode ficar em cache: senão uma versão nova do app não chegaria ao aparelho.
  async headers() {
    return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }, { key: 'Service-Worker-Allowed', value: '/' }] }];
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
};

export default nextConfig;
