import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@template/ui";
import { Toaster } from "@template/ui/toaster";

import "~/app/globals.css";

import { headers } from "next/headers";

import { ThemeToggle } from "@template/ui/theme";
import { getRequestInfo } from "@template/utils/request";

import { SITE_CONFIG } from "~/constants/constants";
import { RootProvider } from "~/store";

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata(): Promise<Metadata> {
  const info = getRequestInfo(headers());
  const metadataBase = new URL(info.domainUrl);
  const manifestURL = new URL(SITE_CONFIG.manifest, metadataBase);

  return {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    icons: {
      icon: SITE_CONFIG.favicon,
    },
    metadataBase,
    manifest: manifestURL,
    alternates: {
      canonical: metadataBase,
    },
    openGraph: {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      url: metadataBase.href,
      siteName: SITE_CONFIG.title,
      images: [
        {
          url: SITE_CONFIG.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      site: "@Lalossol",
      creator: "@Lalossol",
      card: "summary_large_image",
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout(props: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <RootProvider>
          {props.children}
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
