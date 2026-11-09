'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import { insertBlock, recordId } from '@/features/records/services/recordsStore';
import { newBlock } from '@/features/routine/utils/routine';
import { toDateKey } from '@/utils/calendar';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './NewBlockTemplate.module.css';

// Tela para acrescentar um momento ao dia de hoje (outra aula, uma brincadeira a mais...): ela só digita o nome.
// O momento novo entra logo depois do que estava aberto; a tela mostra entre quais momentos ele vai ficar.
export default function NewBlockTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {({ child, record }) => <NewBlockForm child={child} record={record} />}
    </RecordScreen>
  );
}

// Onde o momento novo entra: depois do que estava aberto (o cursor do registro), ou no fim se ela estava no Resumo.
function findPlace(record) {
  // Sem cursor, o registro abriu no primeiro momento; no Resumo (ou com momento que não existe mais), vai para o fim.
  const index = record.cursor ? record.blocks.findIndex((block) => block.id === record.cursor) : 0;
  const afterIndex = index === -1 ? record.blocks.length - 1 : index;
  return {
    afterId: record.blocks[afterIndex]?.id,
    before: record.blocks[afterIndex] ?? null,
    after: record.blocks[afterIndex + 1] ?? null,
  };
}

function NewBlockForm({ child, record }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const title = name.trim();
  const place = findPlace(record);

  const submit = async (event) => {
    event.preventDefault();
    if (!title) return;
    setSaving(true);
    setError('');
    try {
      await insertBlock(recordId(child.id, toDateKey(new Date())), newBlock('other', title), place.afterId);
      // Volta ao registro, que reabre já no momento novo.
      router.back();
    } catch {
      setError('Não foi possível salvar. Tente de novo.');
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.texts}>
        <p className={styles.student}>{child.name}</p>
        <h1 className={styles.title}>Novo momento</h1>
        <p className={styles.description}>Dê um nome, por exemplo: Aula de Inglês, Recreio, Passeio.</p>
      </div>

      <AppInput label="Nome do momento" name="blockName" autoCapitalize="sentences" autoComplete="off" autoFocus value={name} onChange={setName} />

      {/* Onde ele vai ficar na ordem do dia. */}
      <div className={styles.place}>
        <p className={styles.placeTitle}>
          {place.before && place.after
            ? `Vai ficar entre ${place.before.title} e ${place.after.title}`
            : place.before
              ? `Vai ficar depois de ${place.before.title}, no fim do dia`
              : 'Vai ser o primeiro momento do dia'}
        </p>
        <ol className={styles.order}>
          {place.before ? <li className={styles.neighbor}>{place.before.title}</li> : null}
          <li className={styles.fresh}>{title || 'Novo momento'}</li>
          {place.after ? <li className={styles.neighbor}>{place.after.title}</li> : null}
        </ol>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <AppButton type="submit" fullWidth loading={saving} disabled={!title}>
        Adicionar ao dia
      </AppButton>
    </form>
  );
}
