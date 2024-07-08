import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles/fonts.css";
import "./styles/tailwind.css";

export const loader = async () => {
  try {
    console.log("loader", import.meta.env.NEXT_PUBLIC_SERVER_URL);
    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className="__variable_geistSans __variable_geistMono">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
