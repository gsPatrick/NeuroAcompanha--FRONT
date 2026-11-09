'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import BlockCard from '@/components/ui/molecules/BlockCard/BlockCard';
import RecordTimeline from '@/components/ui/molecules/RecordTimeline/RecordTimeline';
import SectionHeader from '@/components/ui/molecules/SectionHeader/SectionHeader';
import { BLOCK_KINDS } from '@/features/records/data/prancheta';
import { buildTimeline, describeBlockProgress, formatTime } from '@/features/records/utils/recordView';
import { formatLongDate } from '@/utils/formatDate';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './RecordTemplate.module.css';

const KIND_LABELS = { welcome: 'Acolhimento', class: 'Aula', snack: 'Lanche', play: 'Brincadeira', other: 'Momento' };

// Registro do dia de um aluno: a rotina do dia em blocos (Acolhimento, Aulas, Lanche, Brincadeiras...).
// Toque num bloco para registrar o que acontece nele. Dá para acrescentar blocos e, no fim, escrever o resumo do dia.
export default function RecordTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {(day) => <RecordContent {...day} />}
    </RecordScreen>
  );
}

function RecordContent({ child, record, addBlock, removeEvent }) {
  const router = useRouter();
  const timeline = buildTimeline(record.events, record.blocks);
  const summaryFilled = Object.values(record.summary).some((text) => text?.trim());

  return (
    <>
      <section className={styles.identity}>
        <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="xl" />
        <div className={styles.identityTexts}>
          <h1 className={styles.name}>{child.name}</h1>
          <p className={styles.date}>{formatLongDate()}</p>
        </div>
      </section>

      <section className={styles.group}>
        <SectionHeader title="Rotina de hoje" ruled />
        {record.blocks.length ? (
          <div className={styles.blocks}>
            {record.blocks.map((block) => (
              <BlockCard
                key={block.id}
                kicker={block.kind === 'class' ? 'Aula' : undefined}
                title={block.title}
                progress={describeBlockProgress(record, block.id)}
                onOpen={() => router.push(`/registro/${child.id}/${block.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Este dia não tem rotina cadastrada. Adicione um momento abaixo.</p>
        )}
        <AddBlock onAdd={addBlock} />
      </section>

      <section className={styles.group}>
        <SectionHeader title="Resumo do dia" ruled />
        <BlockCard
          title="Como foi o dia"
          progress={summaryFilled ? 'Preenchido' : ''}
          onOpen={() => router.push(`/registro/${child.id}/resumo`)}
        />
      </section>

      <section className={styles.group}>
        <SectionHeader title="Hoje até agora" ruled />
        {timeline.length ? (
          <RecordTimeline items={timeline} formatTime={formatTime} onRemove={removeEvent} showBlock />
        ) : (
          <p className={styles.empty}>Nada marcado ainda. Abra um momento da rotina e toque nas opções.</p>
        )}
      </section>
    </>
  );
}

// Acrescentar um momento ao dia (outra aula, uma brincadeira a mais...).
function AddBlock({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState(BLOCK_KINDS[0]);
  const [name, setName] = useState('');

  const close = () => {
    setOpen(false);
    setName('');
    setKind(BLOCK_KINDS[0]);
  };

  const submit = () => {
    const title = kind.askName ? name.trim() : kind.defaultTitle;
    if (!title) return;
    onAdd(kind.kind, title);
    close();
  };

  if (!open) {
    return (
      <AppButton variant="outline" icon="plus" fullWidth onClick={() => setOpen(true)}>
        Adicionar momento
      </AppButton>
    );
  }

  return (
    <div className={styles.add}>
      <div className={styles.kinds} role="radiogroup" aria-label="Tipo de momento">
        {BLOCK_KINDS.map((option) => (
          <button
            key={option.kind}
            type="button"
            role="radio"
            aria-checked={option.kind === kind.kind}
            className={`${styles.kind} ${option.kind === kind.kind ? styles.kindSelected : ''}`}
            onClick={() => setKind(option)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {kind.askName ? (
        <AppInput label={kind.placeholder} name="blockName" autoCapitalize="sentences" autoComplete="off" value={name} onChange={setName} />
      ) : null}

      <div className={styles.addActions}>
        <AppButton variant="outline" size="md" onClick={close}>
          Cancelar
        </AppButton>
        <AppButton size="md" disabled={kind.askName && !name.trim()} onClick={submit}>
          Adicionar
        </AppButton>
      </div>
    </div>
  );
}
