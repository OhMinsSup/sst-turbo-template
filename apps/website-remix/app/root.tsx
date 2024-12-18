import "reflect-metadata";

import type { LinksFunction } from "@remix-run/node";
import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Toaster } from "sonner";

import type { Session } from "@template/auth";
import globalStyleCssUrl from "@template/ui/globals.css?url";
import { cn } from "@template/ui/lib";

import type { RoutesLoaderData } from "~/.server/loaders/root.loader";
import { QueryProviders } from "~/providers/query.provider";
import { GlobalMeta } from "./components/shared/GlobalMeta";
import { ShowToast } from "./components/shared/Toast";
import { SITE_CONFIG } from "./constants/constants";
import { remixAuthBrowser } from "./libs/auth";
import { ClientHintCheck } from "./libs/client-hints";
import styleCssUrl from "./styles.css?url";

export { loader } from "~/.server/loaders/root.loader";
export { meta } from "~/libs/meta-tags/root.meta";

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: globalStyleCssUrl },
    { rel: "stylesheet", href: styleCssUrl },
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
  const {
    requestInfo: { userPrefs },
  } = useLoaderData<RoutesLoaderData>();
  return (
    <html
      lang="kr"
      itemScope
      itemType="http://schema.org/WebSite"
      className={cn(userPrefs.theme)}
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
          theme={userPrefs.theme ?? undefined}
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
  session?: Session | undefined;
  children: React.ReactNode;
}

function AppWithProvider({ children, session }: AppWithProviderProps) {
  const fetcher = useFetcher();

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = remixAuthBrowser.onAuthStateChange((_, newSession) => {
      if (
        newSession?.access_token !== serverAccessToken &&
        fetcher.state === "idle"
      ) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        fetcher.submit(null, {
          method: "post",
          action: "/revalidate-auth",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [serverAccessToken, fetcher]);

  return <QueryProviders>{children}</QueryProviders>;
}

export default function App() {
  const { session, toast } = useLoaderData<RoutesLoaderData>();

  return (
    <Document>
      <AppWithProvider session={session}>
        <Outlet />
      </AppWithProvider>
      {toast ? <ShowToast toast={toast} /> : null}
    </Document>
  );
}
