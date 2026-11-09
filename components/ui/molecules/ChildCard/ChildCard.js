import AppAvatar from '../../atoms/AppAvatar/AppAvatar';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './ChildCard.module.css';

// Linha da lista de crianças: foto, nome, diagnósticos e os dias em que é atendida. Tocar abre o perfil.
// `days`: texto pronto (ex.: "Seg · Qua · Sex"); `diagnoses`: [['TEA', 'Nível 2']].
export default function ChildCard({ name, photo, avatar, diagnoses = [], days, onOpen }) {
  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      <AppAvatar photo={photo} person={avatar} initials={name.slice(0, 1)} size="xl" />
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
        {days ? <span className={styles.days}>{days}</span> : null}
      </span>
      <span className={styles.chevron} aria-hidden="true">
        <AppIcon name="chevronRight" size={20} />
      </span>
    </button>
  );
}
