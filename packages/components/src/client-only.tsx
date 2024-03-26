'use client';

import React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const emptySubscribe = () => () => {};

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const value = React.useSyncExternalStore(
    emptySubscribe,
    () => 'client',
    () => 'server',
  );

  return value === 'client' ? <>{children}</> : <>{fallback ?? null}</>;
}
