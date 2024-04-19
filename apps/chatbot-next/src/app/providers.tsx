'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@template/ui/toaster';
import { TooltipProvider } from '@template/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
