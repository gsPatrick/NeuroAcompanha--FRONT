// Versão desta publicação: na Vercel é o código do commit (muda a cada deploy); fora dela, a hora do build.
// O app instalado compara a versão que carregou com a que o servidor informa em /api/version: se mudou, atualiza.
const appVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? String(Date.now());

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
};

export default nextConfig;
