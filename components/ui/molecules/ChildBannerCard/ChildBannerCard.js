import AppAvatar from '../../atoms/AppAvatar/AppAvatar';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import PuzzleMark from '../../atoms/PuzzleMark/PuzzleMark';
import styles from './ChildBannerCard.module.css';

// Cartão da criança na lista, no estilo do banner da tela inicial: degradê azul-claro com curvas, foto, nome, etiquetas
// e peça de quebra-cabeça. Embaixo, o dia de hoje (atende ou não) e os dias da semana. Tocar abre o perfil.
// `todayLabel`: texto do status de hoje; `attendsToday`: cor do status; `days`: "Atende: Seg · Qua · Sex".
export default function ChildBannerCard({ name, photo, avatar, diagnoses = [], days, todayLabel, attendsToday, onOpen }) {
  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      <span className={styles.top}>
        <svg className={styles.swirl} viewBox="0 0 220 180" fill="none" aria-hidden="true" focusable="false">
          <path d="M170 -20C120 20 215 55 160 105S125 175 160 205" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
          <path d="M215 10C185 45 230 80 200 125" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
        </svg>
        <span className={styles.puzzle}>
          <PuzzleMark size={36} />
        </span>

        <span className={styles.identity}>
          <AppAvatar photo={photo} person={avatar} initials={name.slice(0, 1)} size="xxl" />
          <span className={styles.texts}>
            <span className={styles.name}>{name}</span>
            {diagnoses.length ? (
              <span className={styles.tags}>
                {diagnoses.flatMap((parts) =>
                  parts.map((label, index) => (
                    <span key={`${parts[0]}-${label}`} className={`${styles.tag} ${index === 0 ? styles.tagMain : ''}`}>
                      {label}
                    </span>
                  )),
                )}
              </span>
            ) : null}
          </span>
        </span>
      </span>

      <span className={styles.bottom}>
        <span className={styles.info}>
          <span className={`${styles.today} ${attendsToday ? styles.todayOn : ''}`}>{todayLabel}</span>
          <span className={styles.days}>{days}</span>
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <AppIcon name="chevronRight" size={20} />
        </span>
      </span>
    </button>
  );
}
