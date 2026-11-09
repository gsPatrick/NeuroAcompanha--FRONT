'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';

// Faz o conteúdo subir e aparecer quando entra na tela (uma vez só). `delay`: 0 a 4, escalona vários itens juntos.
// Sem JavaScript ou com "reduzir movimento", o conteúdo já aparece normal.
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${styles.reveal} ${styles[`delay${delay}`]} ${shown ? styles.shown : ''} ${className}`}>
      {children}
    </Tag>
  );
}
