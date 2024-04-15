import { SidebarDesktop } from '~/components/shared/sidebar-desktop';

interface RoutesProps {
  children: React.ReactNode;
}

export default function Layout(props: RoutesProps) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarDesktop />
      {props.children}
    </div>
  );
}
