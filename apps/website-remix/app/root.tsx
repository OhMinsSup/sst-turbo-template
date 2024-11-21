import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";

import "@template/ui/globals.css";
import "./styles.css";

import type { LinksFunction, SerializeFrom } from "@remix-run/node";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { cn } from "@template/ui/lib";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { GlobalMeta } from "./components/shared/GlobalMeta";
import { ShowToast } from "./components/shared/Toast";
import { SITE_CONFIG } from "./constants/constants";
import { createRemixBrowserClient } from "./utils/auth";
import { ClientHintCheck } from "./utils/client-hints";
import { getQueryClient } from "./utils/query-client";

export { loader } from "~/.server/routes/root/root.loader";
export { meta } from "~/utils/seo/root.meta";

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    {
      rel: "manifest",
      href: SITE_CONFIG.manifest,
      crossOrigin: "use-credentials",
    },
    { rel: "icon", type: "image/svg+xml", href: SITE_CONFIG.favicon },
    { rel: "icon", href: SITE_CONFIG.favicon32x32, sizes: "32x32" },
  ];
};

interface Props {
  children: React.ReactNode;
}

function Document({ children }: Props) {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <html
      lang="kr"
      itemScope
      itemType="http://schema.org/WebSite"
      className={cn(data.requestInfo.userPrefs.theme)}
    >
      <head>
        <ClientHintCheck />
        <GlobalMeta />
        <Meta />
        <Links />
      </head>
      <body className="overscroll-none whitespace-pre-line bg-background antialiased">
        {children}
        <Toaster
          theme={data.requestInfo.userPrefs.theme ?? undefined}
          toastOptions={{
            classNames: {
              toast:
                "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton:
                "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton:
                "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

interface AppWithProviderProps {
  session?: SerializeFrom<RoutesLoaderData>["session"];
  children: React.ReactNode;
}

function AppWithProvider({ children, session }: AppWithProviderProps) {
  const queryClient = getQueryClient();

  const revalidator = useRevalidator();

  const authClient = createRemixBrowserClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = authClient.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        revalidator.revalidate();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default function App() {
  const data = useLoaderData<RoutesLoaderData>();

  return (
    <Document>
      <AppWithProvider session={data.session}>
        <Outlet />
      </AppWithProvider>
      {data.toast ? <ShowToast toast={data.toast} /> : null}
    </Document>
  );
}
