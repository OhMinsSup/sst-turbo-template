import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./styles/tailwind.css";

import type { LinksFunction } from "@remix-run/node";

import { cn } from "@template/ui";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ShowToast, Toaster } from "./components/shared/Toast";
import { AppProvider } from "./store/app";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "./store/theme";
import { TRPCReactProvider } from "./store/trpc";

export { loader } from "~/.server/routes/root/root.loader";
export { action } from "~/.server/routes/root/root.action";
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
  const [theme] = useTheme();
  return (
    <html
      lang="en"
      itemScope
      itemType="http://schema.org/WebSite"
      className={cn(theme)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href={data.requestInfo.domainUrl} />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(theme)} />
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

export function Layout({ children }: Props) {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <ThemeProvider specifiedTheme={data.userPrefs.theme}>
      <Document>
        {children}
        {data.toast ? <ShowToast toast={data.toast} /> : null}
      </Document>
    </ThemeProvider>
  );
}

export default function App() {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <AppProvider>
      <TRPCReactProvider baseUrl={data.requestInfo.domainUrl}>
        <Outlet />
      </TRPCReactProvider>
    </AppProvider>
  );
}
