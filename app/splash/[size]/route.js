import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SPLASH_SIZES, splashPixels } from '@/constants/splash';

// Telas de abertura do iOS: fundo branco com o infinito no centro. Uma imagem por tamanho de iPhone.
// Geradas na hora do build (uma por tamanho listado em constants/splash.js).
export const dynamicParams = false;

export function generateStaticParams() {
  return SPLASH_SIZES.map((size) => {
    const { width, height } = splashPixels(size);
    return { size: `${width}x${height}` };
  });
}

export async function GET(_request, { params }) {
  const { size } = await params;
  const [width, height] = size.split('x').map(Number);

  const file = await readFile(join(process.cwd(), 'public/images/neurodiversity-infinity.jpeg'));
  const symbol = `data:image/jpeg;base64,${file.toString('base64')}`;

  const symbolWidth = Math.round(width * 0.42);
  const symbolHeight = Math.round(symbolWidth * (800 / 1528));

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
        <img src={symbol} width={symbolWidth} height={symbolHeight} alt="" />
      </div>
    ),
    { width, height },
  );
}
