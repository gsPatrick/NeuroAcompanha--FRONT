import AppAvatar from '../../atoms/AppAvatar/AppAvatar';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import PuzzleMark from '../../atoms/PuzzleMark/PuzzleMark';
import styles from './ProfileBanner.module.css';

// Banner do topo dos perfis, no mesmo estilo do cartão do aluno na tela inicial: degradê azul-claro com curvas ao fundo,
// a foto (ou ilustração) um pouco maior e o nome ao lado. `puzzle`: peça de quebra-cabeça no canto (crianças).
// `tags`: [['TEA', 'Nível 2']]; `caption`: linha pequena sob o nome e as etiquetas. Acima do banner, o botão "Voltar".
export default function ProfileBanner({ photo, person, initials, name, subtitle, tags = [], caption, puzzle = false, onBack }) {
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onBack}>
        <AppIcon name="arrowLeft" size={20} />
        Voltar
      </button>

      <header className={styles.banner}>
        <svg className={styles.swirl} viewBox="0 0 220 180" fill="none" aria-hidden="true" focusable="false">
          <path d="M170 -20C120 20 215 55 160 105S125 175 160 205" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
          <path d="M215 10C185 45 230 80 200 125" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
        </svg>

        {puzzle ? (
          <span className={styles.puzzle}>
            <PuzzleMark size={40} />
          </span>
        ) : null}

        <div className={styles.identity}>
          <AppAvatar photo={photo} person={person} initials={initials} size="hero" />
          <div className={styles.texts}>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <h1 className={styles.name}>{name}</h1>
            {tags.length ? (
              <div className={styles.tags}>
                {tags.flatMap((parts) =>
                  parts.map((label, index) => (
                    <span key={`${parts[0]}-${label}`} className={`${styles.tag} ${index === 0 ? styles.tagMain : ''}`}>
                      {label}
                    </span>
                  )),
                )}
              </div>
            ) : null}
            {caption ? <p className={styles.caption}>{caption}</p> : null}
          </div>
        </div>
      </header>
    </div>
  );
}
