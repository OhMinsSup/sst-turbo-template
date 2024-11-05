import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";

import "./styles/tailwind.css";

import type { LinksFunction, SerializeFrom } from "@remix-run/node";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { cn } from "@template/ui";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { GlobalMeta } from "./components/shared/GlobalMeta";
import { ShowToast, Toaster } from "./components/shared/Toast";
import { createRemixBrowserClient } from "./utils/auth";
import { ClientHintCheck } from "./utils/client-hints";
import { getQueryClient } from "./utils/query-client";

export { loader } from "~/.server/routes/root/root.loader";
export { meta } from "~/seo/root.meta";

export const links: LinksFunction = () => {
  return [
    {
      rel: "manifest",
      href: "/site.webmanifest",
      crossOrigin: "use-credentials",
    },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" },
    { rel: "icon", href: "/images/favicon-32.png", sizes: "32x32" },
    { rel: "icon", href: "/images/favicon-128.png", sizes: "128x128" },
    { rel: "icon", href: "/images/favicon-180.png", sizes: "180x180" },
    { rel: "icon", href: "/images/favicon-192.png", sizes: "192x192" },
  ];
};

interface Props {
  children: React.ReactNode;
}

function Document({ children }: Props) {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <html
      lang="en"
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
      <body>
        {children}
        <Toaster closeButton position="top-center" />
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
