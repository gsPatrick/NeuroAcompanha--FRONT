import { f7 } from 'framework7-react';
import { enableFaceId, isFaceIdEnabledHere, isFaceIdSupported, rememberFaceIdOffered, wasFaceIdOffered } from '../services/faceIdService';

const ask = () =>
  new Promise((resolve) => {
    f7.dialog
      .create({
        title: 'Entrar com Face ID?',
        text: 'Nas próximas vezes você entra só com o rosto, sem digitar a senha.',
        buttons: [
          { text: 'Agora não', onClick: () => resolve(false) },
          { text: 'Ativar', bold: true, onClick: () => resolve(true) },
        ],
      })
      .open();
  });

// Oferece o Face ID uma única vez por aparelho (depois dá para ligar/desligar no perfil). Nunca trava o fluxo:
// se ela recusar, cancelar ou o aparelho falhar, a entrada segue normalmente.
export async function offerFaceId() {
  try {
    if (wasFaceIdOffered() || isFaceIdEnabledHere() || !(await isFaceIdSupported())) return;
    rememberFaceIdOffered();
    if (await ask()) await enableFaceId();
  } catch {
    // Cancelou o Face ID ou o aparelho recusou: ela pode tentar de novo pelo perfil.
  }
}
