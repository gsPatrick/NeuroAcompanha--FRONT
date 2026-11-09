import styles from './BlockTabs.module.css';

// Momentos do dia em uma faixa que rola para o lado. Tocar troca o momento, sem sair da tela.
// `items`: [{ id, label, count }]; `count` (marcações + respostas) vira um pontinho para saber onde já registrou.
export default function BlockTabs({ items, selectedId, onSelect }) {
  return (
    <div className={styles.strip} role="tablist" aria-label="Momentos do dia">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === selectedId}
          className={`${styles.tab} ${item.id === selectedId ? styles.selected : ''}`}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
          {item.count ? <span className={styles.dot} aria-label={`${item.count} registros`} /> : null}
        </button>
      ))}
    </div>
  );
}
