import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./styles/fonts.css";
import "./styles/tailwind.css";

import { cn } from "@template/ui";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ShowToast, Toaster } from "./components/shared/Toast";
import { EnvStoreProvider } from "./store/env-store-provider";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "./store/theme-store";
import { TRPCReactProvider } from "./store/trpc-react";

export { loader } from "~/.server/routes/root/root.loader";
export { action } from "~/.server/routes/root/root.action";

interface Props {
  children: React.ReactNode;
}

function Document({ children }: Props) {
  const [theme] = useTheme();
  return (
    <html
      lang="en"
      className={cn("__variable_geistSans __variable_geistMono", theme)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

function App() {
  return <Outlet />;
}

export default function AppWithProviders() {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <EnvStoreProvider apiHost={data.env.NEXT_PUBLIC_SERVER_URL}>
      <TRPCReactProvider baseUrl={data.requestInfo.domainUrl}>
        <App />
      </TRPCReactProvider>
    </EnvStoreProvider>
  );
}
