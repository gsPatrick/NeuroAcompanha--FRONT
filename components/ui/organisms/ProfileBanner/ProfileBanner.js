import Image from 'next/image';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import PersonIllustration from '../../atoms/PersonIllustration/PersonIllustration';
import styles from './ProfileBanner.module.css';

// Banner grande do topo dos perfis: a foto ocupa o fundo todo, com o nome por cima (e etiquetas e uma linha de apoio).
// Sem foto, usa a ilustração do avatar sobre o azul da marca. O botão de voltar fica sobre a imagem, no canto.
// `tags`: [['TEA', 'Nível 2']]; `caption`: linha pequena sob as etiquetas.
export default function ProfileBanner({ photo, person, initials, name, subtitle, tags = [], caption, onBack }) {
  return (
    <header className={styles.banner}>
      {photo ? (
        <Image className={styles.photo} src={photo} alt="" fill priority sizes="(max-width: 480px) 100vw, 480px" />
      ) : (
        <div className={styles.illustration} aria-hidden="true">
          {person ? <PersonIllustration {...person} /> : <span className={styles.initials}>{initials}</span>}
        </div>
      )}
      <div className={styles.shade} />

      <button type="button" className={styles.back} aria-label="Voltar" onClick={onBack}>
        <AppIcon name="arrowLeft" size={22} />
      </button>

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
    </header>
  );
}
