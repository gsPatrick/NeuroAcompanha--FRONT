// Informa a versão que está publicada AGORA. O app instalado consulta isto para saber se precisa atualizar.
// Nunca pode ser guardado em cache, senão o app não perceberia a versão nova.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    { version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev' },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
