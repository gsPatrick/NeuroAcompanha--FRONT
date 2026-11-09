import styles from './DemoScreens.module.css';

// Tela de demonstração: o registro de um momento (marcações com contador e o que já foi marcado).
export default function RecordDemo() {
  return (
    <>
      <div className={styles.stepper}>
        <span className={styles.arrow}>‹</span>
        <span className={styles.current}>
          <span className={styles.position}>3 de 7</span>
          <span className={styles.title}>Matemática</span>
        </span>
        <span className={styles.arrow}>›</span>
      </div>

      <p className={styles.groupTitle}>Como está agora</p>
      <div className={styles.chips}>
        <span className={styles.chip}>Calmo(a)<span className={styles.count}>2</span></span>
        <span className={styles.chip}>Animado(a)</span>
        <span className={styles.chip}>Ansioso(a)</span>
        <span className={styles.chip}>Cansado(a)</span>
      </div>

      <p className={styles.groupTitle}>Ocorrências</p>
      <div className={styles.chips}>
        <span className={`${styles.chip} ${styles.chipBad}`}>Recusa / birra<span className={styles.count}>1</span></span>
        <span className={`${styles.chip} ${styles.chipBad}`}>Sobrecarga sensorial</span>
      </div>

      <p className={styles.groupTitle}>Conquistas</p>
      <div className={styles.chips}>
        <span className={`${styles.chip} ${styles.chipGood}`}>Pediu ajuda<span className={styles.count}>1</span></span>
        <span className={`${styles.chip} ${styles.chipGood}`}>Concluiu a atividade</span>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timeRow}><span className={styles.time}>09:12</span><span className={`${styles.dot} ${styles.dotGood}`} />Pediu ajuda</div>
        <div className={styles.timeRow}><span className={styles.time}>09:05</span><span className={`${styles.dot} ${styles.dotBad}`} />Recusa / birra</div>
        <div className={styles.timeRow}><span className={styles.time}>08:58</span><span className={styles.dot} />Calmo(a)</div>
      </div>
    </>
  );
}
