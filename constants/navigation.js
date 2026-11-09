// `available: false` = tela ainda não construída nesta etapa do mock.
export const NAV_ITEMS = [
  { key: 'today', label: 'Hoje', href: '/', icon: 'home', available: true },
  { key: 'patients', label: 'Crianças', href: '/patients', icon: 'users', available: false },
  { key: 'agenda', label: 'Agenda', href: '/agenda', icon: 'calendar', available: false },
  { key: 'sessions', label: 'Registros', href: '/sessions', icon: 'clipboard', available: false },
  { key: 'settings', label: 'Ajustes', href: '/settings', icon: 'settings', available: true },
];

export const COMING_SOON_MESSAGE = 'Esta tela chega na próxima etapa do mock';
