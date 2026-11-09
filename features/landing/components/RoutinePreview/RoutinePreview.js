'use client';

import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import BlockStepper from '@/components/ui/molecules/BlockStepper/BlockStepper';
import AppPreview from '@/components/ui/molecules/AppPreview/AppPreview';

const ITEMS = [
  { id: 'a', label: 'Acolhimento', count: 3 },
  { id: 'b', label: 'Português', count: 5 },
  { id: 'c', label: 'Matemática', count: 0 },
  { id: 'd', label: 'Ciências', count: 0 },
  { id: 'e', label: 'Lanche', count: 0 },
  { id: 'f', label: 'Brincadeiras', count: 0 },
  { id: 'g', label: 'Resumo do dia', count: 0 },
];

// Demonstração da rotina do dia: o seletor de momento do registro, com o botão de avançar.
export default function RoutinePreview() {
  return (
    <AppPreview>
      <BlockStepper items={ITEMS} selectedId="c" onSelect={() => {}} />
      <AppButton fullWidth icon="arrowRight">
        Próximo: Ciências
      </AppButton>
    </AppPreview>
  );
}
