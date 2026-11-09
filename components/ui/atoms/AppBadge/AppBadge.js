import styles from './AppBadge.module.css';

// tone: neutral | primary | success | warning | danger
export default function AppBadge({ children, tone = 'neutral' }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
