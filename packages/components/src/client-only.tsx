'use client';

import React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

export function ClientOnly({ children }: ClientOnlyProps) {
  const value = React.useSyncExternalStore(
    emptySubscribe,
    () => 'client',
    () => 'server',
  );

  return value === 'client' ? <>{children}</> : null;
}
