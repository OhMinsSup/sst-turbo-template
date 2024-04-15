'use client';

import React from 'react';

import { ClientOnly } from '@template/react-components/client-only';
import { Layout, LayoutBody, LayoutHeader } from '@template/ui/layout';

import BreadcrumbGroup from '~/components/shared/breadcrumb-group';
import InputSearch from '~/components/shared/input-search';
import ThemeSwitch from '~/components/shared/theme-switch';
import UserNav from '~/components/shared/user-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Layout>
      <LayoutHeader>
        <ClientOnly fallback={<></>}>
          <InputSearch />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <UserNav />
          </div>
        </ClientOnly>
      </LayoutHeader>

      <LayoutBody className="space-y-4">
        <BreadcrumbGroup />
        {children}
      </LayoutBody>
    </Layout>
  );
}
