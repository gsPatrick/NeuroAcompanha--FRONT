import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './InstallStep.module.css';

// Um passo da instalação: número, ícone do que a pessoa vai tocar, título e uma dica curta.
export default function InstallStep({ number, icon, title, description }) {
  return (
    <li className={styles.step}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <div className={styles.texts}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <span className={styles.icon} aria-hidden="true">
        <AppIcon name={icon} size={26} />
      </span>
    </li>
  );
}
