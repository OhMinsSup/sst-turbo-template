import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "~/utils/query-client";

interface TRPCReactProviderProps {
  baseUrl: string;
  children: React.ReactNode;
}

export function QueryProvider(props: TRPCReactProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
