import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Ícone da tela inicial do iPhone (o iOS arredonda os cantos sozinho): o infinito sobre fundo branco.
export default async function AppleIcon() {
  const file = await readFile(join(process.cwd(), 'public/images/neurodiversity-infinity.jpeg'));
  const symbol = `data:image/jpeg;base64,${file.toString('base64')}`;

  const width = Math.round(size.width * 0.76);
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
    size,
  );
}
