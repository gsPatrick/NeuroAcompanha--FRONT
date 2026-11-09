const DEFAULT_SIZE = 480;
const JPEG_QUALITY = 0.85;
// Em fotos de pessoas o rosto fica na parte de cima: o recorte quadrado sobe um pouco em vez de centralizar.
const TOP_BIAS = 0.2;

async function decode(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return createImageBitmap(file);
  }
}

// Recorta a foto escolhida em um quadrado e reduz (leve para guardar no aparelho). Retorna uma data URL JPEG.
export async function cropToSquare(file, size = DEFAULT_SIZE) {
  const bitmap = await decode(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sourceX = (bitmap.width - side) / 2;
  const sourceY = (bitmap.height - side) * TOP_BIAS;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.getContext('2d').drawImage(bitmap, sourceX, sourceY, side, side, 0, 0, size, size);
  bitmap.close?.();

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
