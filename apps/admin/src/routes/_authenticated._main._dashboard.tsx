import React from 'react';

import { Layout, LayoutBody, LayoutHeader } from '@template/ui/layout';

import TopNav from '~/components/shared/top-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search />
          <ThemeSwitch />
          <UserNav /> */}
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4">{children}</LayoutBody>
    </Layout>
  );
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
];
