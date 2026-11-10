// Entrega um arquivo à AT: no celular abre a folha de compartilhar com o arquivo (WhatsApp, Arquivos...);
// sem ela (computador), ou se o aparelho recusar compartilhar, baixa direto. Retorna 'shared' | 'downloaded'.
// Fechar a folha de compartilhar lança AbortError (quem chama trata como "não é erro").
export async function deliverFile(blob, fileName, title) {
  const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      // O aparelho recusou compartilhar (ex.: sem toque recente): cai no download.
    }
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return 'downloaded';
}
