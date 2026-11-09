'use client';

import { useId, useState } from 'react';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './BlockStepper.module.css';

// Seletor do momento do dia, na ordem da rotina: seta para o anterior, nome do atual ("3 de 6") e seta para o próximo.
// Tocar no nome abre a lista completa (para pular para qualquer momento).
// `items`: [{ id, label, count }]; `count` > 0 = já tem registro (vira um ✓ na lista).
export default function BlockStepper({ items, selectedId, onSelect }) {
  const [listOpen, setListOpen] = useState(false);
  const listId = useId();
  const index = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const current = items[index];
  const previous = items[index - 1];
  const next = items[index + 1];

  const pick = (id) => {
    onSelect(id);
    setListOpen(false);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <button type="button" className={styles.arrow} aria-label="Momento anterior" disabled={!previous} onClick={() => previous && pick(previous.id)}>
          <span className={styles.flip}>
            <AppIcon name="chevronRight" size={22} />
          </span>
        </button>

        <button type="button" className={styles.current} aria-expanded={listOpen} aria-controls={listId} onClick={() => setListOpen((open) => !open)}>
          <span className={styles.position}>
            {index + 1} de {items.length}
          </span>
          <span className={styles.title}>{current.label}</span>
        </button>

        <button type="button" className={styles.arrow} aria-label="Próximo momento" disabled={!next} onClick={() => next && pick(next.id)}>
          <AppIcon name="chevronRight" size={22} />
        </button>
      </div>

      {listOpen ? (
        <ul id={listId} className={styles.list}>
          {items.map((item, position) => (
            <li key={item.id}>
              <button type="button" className={`${styles.row} ${item.id === selectedId ? styles.rowSelected : ''}`} onClick={() => pick(item.id)}>
                <span className={styles.rowNumber}>{position + 1}</span>
                <span className={styles.rowLabel}>{item.label}</span>
                {item.count ? (
                  <span className={styles.check} aria-label="Já tem registro">
                    <AppIcon name="check" size={18} />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
