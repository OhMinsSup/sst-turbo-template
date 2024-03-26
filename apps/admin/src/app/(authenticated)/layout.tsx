import React from 'react';

import MainLayout from '~/routes/_authenticated._main';
import DashboardLayout from '~/routes/_authenticated._main._dashboard';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <MainLayout>
      <DashboardLayout>{children}</DashboardLayout>
    </MainLayout>
  );
}
