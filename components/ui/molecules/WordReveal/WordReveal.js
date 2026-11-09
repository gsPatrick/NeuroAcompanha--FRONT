'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './WordReveal.module.css';

// Frase que "acende" palavra por palavra conforme rola pela tela (o momento de rolagem da página).
// Cada palavra liga quando passa de ~78% da altura da tela; ao rolar de volta, apaga. `scrollRoot`: seletor de quem rola.
export default function WordReveal({ text, scrollRoot = '#landing-scroll', className = '' }) {
  const words = text.split(' ');
  const refs = useRef([]);
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    const root = document.querySelector(scrollRoot);
    if (!root) {
      setLitCount(words.length);
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const limit = window.innerHeight * 0.78;
      let count = 0;
      refs.current.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top < limit) count = index + 1;
      });
      setLitCount(count);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollRoot, words.length]);

  return (
    <p className={`${styles.text} ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          ref={(element) => {
            refs.current[index] = element;
          }}
          className={`${styles.word} ${index < litCount ? styles.on : ''}`}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
