import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export function generateImageMetadata() {
  return [
    { id: '192', size: { width: 192, height: 192 }, contentType: 'image/png' },
    { id: '512', size: { width: 512, height: 512 }, contentType: 'image/png' },
  ];
}

// Ícone do app: o infinito multicolorido (símbolo da neurodiversidade) sobre fundo branco.
// A imagem é lida do disco e embutida (o gerador de ícones não carrega arquivos da pasta public sozinho).
export default async function Icon({ id }) {
  const size = Number(await id);
  const file = await readFile(join(process.cwd(), 'public/images/neurodiversity-infinity.jpeg'));
  const symbol = `data:image/jpeg;base64,${file.toString('base64')}`;

  const width = Math.round(size * 0.76);
  const height = Math.round(width * (800 / 1528));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={symbol} width={width} height={height} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
