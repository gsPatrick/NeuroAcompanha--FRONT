'use client';

import { useChildren } from './useChildren';

// Uma criança pelo id. status: loading | success | error | missing (não existe ou não é desta AT). `reload` busca de novo.
export function useChild(childId) {
  const { status, children, reload } = useChildren();
  const child = children.find((item) => item.id === childId) ?? null;
  return { status: status === 'success' && !child ? 'missing' : status, child, reload };
}
