// O infinito colorido da marca (símbolo da neurodiversidade), desenhado em SVG: não é imagem, escala sem perder nitidez
// e funciona sobre qualquer fundo. `className` define o tamanho.
export default function InfinityMark({ className }) {
  // O mesmo id em todas as marcas da página: o degradê é idêntico, então compartilhar a definição não muda nada.
  const id = 'infinity-mark-gradient';
  return (
    <svg className={className} viewBox="0 0 120 64" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="4" y1="20" x2="116" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E2E83A" />
          <stop offset="0.18" stopColor="#F2A52A" />
          <stop offset="0.36" stopColor="#E8452C" />
          <stop offset="0.55" stopColor="#7B2FBE" />
          <stop offset="0.75" stopColor="#4D74C9" />
          <stop offset="1" stopColor="#7CC7EA" />
        </linearGradient>
      </defs>
      <path
        d="M60 32C48 14 34 8 22 8C11 8 4 18 4 32S11 56 22 56C34 56 48 50 60 32C72 14 86 8 98 8C109 8 116 18 116 32S109 56 98 56C86 56 72 50 60 32Z"
        stroke={`url(#${id})`}
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
