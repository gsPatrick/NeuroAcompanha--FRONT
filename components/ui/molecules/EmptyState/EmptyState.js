import AppIcon from '../../atoms/AppIcon/AppIcon';
import AppButton from '../../atoms/AppButton/AppButton';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = 'calendar', title, description, actionLabel, onAction }) {
  return (
    <div className={styles.empty} role="status">
      <span className={styles.iconWrap}>
        <AppIcon name={icon} size={26} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {actionLabel ? (
        <AppButton variant="secondary" onClick={onAction}>
          {actionLabel}
        </AppButton>
      ) : null}
    </div>
  );
}
