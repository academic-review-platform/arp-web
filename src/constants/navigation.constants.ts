import { ROUTES } from './routes.constants';

// Único ítem de navegación directa en el sidebar
export interface NavLink {
  kind: 'link';
  label: string;
  path: string;
  iconName: string;
}

// Separador / encabezado de grupo de cursos (no navega, solo agrupa)
export interface NavGroup {
  kind: 'group';
  label: string;
}

export type NavItem = NavLink | NavGroup;

// Ítem estático de navegación principal
export const MAIN_NAV: NavLink = {
  kind: 'link',
  label: 'Página Principal',
  path: ROUTES.DASHBOARD,
  iconName: 'home',
};

// Etiquetas fijas de agrupación en el sidebar
export const NAV_GROUP_OWNED: NavGroup = {
  kind: 'group',
  label: 'Cursos que dicto',
};

export const NAV_GROUP_ENROLLED: NavGroup = {
  kind: 'group',
  label: 'Cursos en los que estoy',
};

// Dimensiones del layout
export const SIDEBAR_WIDTH = 355;
export const TOPBAR_HEIGHT = 60;
