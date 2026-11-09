import Image from 'next/image';
import PersonIllustration from '../PersonIllustration/PersonIllustration';
import styles from './AppAvatar.module.css';

// Avatar com foto (`photo`), ilustração (`person`: ver PersonIllustration) ou, sem nenhum dos dois, iniciais.
// A foto só é usada quando existe (e quando há autorização do responsável); a ilustração é o padrão.
// size: sm | md | lg | xl | xxl     shape: rounded | circle
export default function AppAvatar({ photo, person, initials, size = 'md', shape = 'rounded' }) {
  const classes = [
    styles.avatar,
    styles[size],
    styles[shape],
    photo ? styles.withPhoto : '',
    photo || person ? '' : styles.initials,
  ]
    .filter(Boolean)
    .join(' ');

  let content = initials;
  if (photo) {
    content = <Image className={styles.photo} src={photo} alt="" fill sizes="120px" />;
  } else if (person) {
    content = <PersonIllustration {...person} />;
  }

  return (
    <span className={classes} aria-hidden="true">
      {content}
    </span>
  );
}
