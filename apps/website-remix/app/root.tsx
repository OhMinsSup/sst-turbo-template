import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./styles/tailwind.css";

import { cn } from "@template/ui";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ShowToast, Toaster } from "./components/shared/Toast";
import AppProvider from "./store/app";
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
    <html lang="en" className={cn(theme)}>
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
    <AppProvider>
      <TRPCReactProvider baseUrl={data.requestInfo.domainUrl}>
        <App />
      </TRPCReactProvider>
    </AppProvider>
  );
}
