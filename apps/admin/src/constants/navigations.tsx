import { Icons } from '~/components/icons';

export interface NavigationLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface Navigation extends NavigationLink {
  sub?: NavigationLink[];
}

export const navigations: Navigation[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <Icons.dashboard className="size-6" />,
  },
];
