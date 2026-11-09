'use client';

import { useCallback, useEffect, useState } from 'react';

const STATE_KEY = 'appStep';

// Etapas de uma tela (ex.: onboarding, login) ligadas ao histórico do navegador.
// Avançar empilha uma entrada no histórico; o gesto/botão de voltar do sistema (iPhone, Android) volta UMA etapa
// em vez de sair da tela. Se a página for recarregada, recomeça na primeira etapa.
// Usa o próprio window.history (o Next.js preserva o estado dele ao receber o nosso).
export function useHistoryStep(initial = 0) {
  const [step, setStep] = useState(initial);

  useEffect(() => {
    // Marca a entrada atual como a primeira etapa, sem criar histórico novo.
    window.history.replaceState({ [STATE_KEY]: initial }, '', window.location.href);

    const onPopState = (event) => {
      const saved = event.state?.[STATE_KEY];
      setStep(typeof saved === 'number' ? saved : initial);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [initial]);

  // Avança para uma etapa (ou volta direto a uma anterior) criando uma entrada no histórico.
  const goTo = useCallback((next) => {
    setStep(next);
    window.history.pushState({ [STATE_KEY]: next }, '', window.location.href);
  }, []);

  // Voltar uma etapa = voltar no histórico (o ouvinte acima atualiza a etapa).
  const goBack = useCallback(() => window.history.back(), []);

  return [step, goTo, goBack];
}
