import React from 'react';

import DashboardLayout from '~/routes/_authenticated._main._dashboard';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
