'use client';
import * as React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptySubscribe = () => () => {};

export function ClientOnly({ children }: ClientOnlyProps) {
  const value = React.useSyncExternalStore(
    emptySubscribe,
    () => 'client',
    () => 'server',
  );

  return value === 'client' ? <>{children}</> : null;
}
