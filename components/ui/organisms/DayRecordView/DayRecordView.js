import RecordTimeline from '../../molecules/RecordTimeline/RecordTimeline';
import { SUMMARY_FIELDS, describeAnswer, findQuestion } from '@/features/records/data/prancheta';
import { buildTimeline, formatTime } from '@/features/records/utils/recordView';
import styles from './DayRecordView.module.css';

// O registro de um dia, só para ler: cada momento com as marcações (e horários), as respostas da prancheta
// e as anotações, e no fim o Resumo do dia. Tudo aberto, sem menus.
export default function DayRecordView({ record }) {
  const summaryFields = SUMMARY_FIELDS.filter((field) => record.summary?.[field.key]?.trim());

  return (
    <div className={styles.view}>
      {record.blocks.map((block) => {
        const timeline = buildTimeline(record.events, record.blocks, block.id);
        const answers = Object.entries(record.answers?.[block.id] ?? {}).filter(([, item]) => item.answer || item.obs?.trim());
        const empty = !timeline.length && !answers.length;

        return (
          <section key={block.id} className={styles.block}>
            <h2 className={styles.title}>{block.title}</h2>

            {empty ? <p className={styles.empty}>Nada registrado neste momento.</p> : null}

            {timeline.length ? <RecordTimeline items={timeline} formatTime={formatTime} /> : null}

            {answers.length ? (
              <ul className={styles.answers}>
                {answers.map(([key, item]) => {
                  const question = findQuestion(key);
                  return (
                    <li key={key} className={styles.answer}>
                      <span className={styles.question}>{question.label}</span>
                      <span className={styles.value}>
                        {item.answer ? (
                          <span className={`${styles.badge} ${item.answer === 'yes' ? styles.yes : styles.no}`}>{describeAnswer(question, item)}</span>
                        ) : null}
                        {item.obs?.trim() ? <span className={styles.obs}>{item.obs}</span> : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        );
      })}

      <section className={styles.block}>
        <h2 className={styles.title}>Resumo do dia</h2>
        {summaryFields.length ? (
          summaryFields.map((field) => (
            <div key={field.key} className={styles.summaryItem}>
              <span className={styles.summaryLabel}>{field.label}</span>
              <span className={styles.summaryText}>{record.summary[field.key]}</span>
            </div>
          ))
        ) : (
          <p className={styles.empty}>O resumo do dia não foi preenchido.</p>
        )}
      </section>
    </div>
  );
}
