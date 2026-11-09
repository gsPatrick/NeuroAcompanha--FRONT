import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import WeekdayPicker from '@/components/ui/molecules/WeekdayPicker/WeekdayPicker';
import styles from './ReportDaysSetting.module.css';

// Um dia da semana por criança para o relatório semanal.
export default function ReportDaysSetting({ items, reportDays, defaultDay, onChange }) {
  if (!items.length) {
    return <EmptyState icon="users" title="Nenhuma criança vinculada" description="Quando houver, você escolhe o dia aqui." />;
  }

  return (
    <ul className={styles.list}>
      {items.map((child) => (
        <li key={child.id} className={styles.row}>
          <div className={styles.identity}>
            <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="md" />
            <span className={styles.name}>{child.name}</span>
          </div>
          <WeekdayPicker
            label={`Dia do relatório de ${child.name}`}
            value={reportDays[child.id] ?? defaultDay}
            onChange={(day) => onChange(child.id, day)}
          />
        </li>
      ))}
    </ul>
  );
}
