'use client';

import { Link } from 'framework7-react';
import { usePathname, useRouter } from 'next/navigation';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import { NAV_ITEMS, COMING_SOON_MESSAGE } from '@/constants/navigation';
import { useToast } from '@/hooks/useToast';

// Itens da tab bar. Devem ser renderizados dentro de um <Toolbar tabbar> que seja
// filho direto do <Page> (o Framework7 só posiciona a barra assim): ver AppLayout.
// A navegação entre páginas é do Next.js; o Framework7 fornece só o visual.
export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useToast();

  const handleSelect = (item) => {
    if (!item.available) {
      showToast(COMING_SOON_MESSAGE);
      return;
    }
    // As abas são "irmãs": trocar de aba substitui a tela em vez de empilhar histórico.
    // Assim o gesto de voltar do sistema nunca passa por uma fila de abas já visitadas.
    if (item.href !== pathname) router.replace(item.href);
  };

  // href={false}: sem href="#" o Framework7 não tenta tratar a aba como uma "aba interna" dele
  // (isso gerava um erro de seletor). A navegação é feita só pelo Next.js, no onClick.
  return NAV_ITEMS.map((item) => {
    // Telas dentro de uma aba (ex.: o perfil de uma criança) mantêm a aba acesa.
    const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    return (
      <Link
        key={item.key}
        href={false}
        role="link"
        tabIndex={0}
        aria-current={active ? 'page' : undefined}
        tabLink
        tabLinkActive={active}
        onClick={() => handleSelect(item)}
      >
        <AppIcon name={item.icon} size={24} />
        <span className="tabbar-label">{item.label}</span>
      </Link>
    );
  });
}
