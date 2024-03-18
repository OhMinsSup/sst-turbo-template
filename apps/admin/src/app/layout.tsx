import '@template/ui/globals.css';

import type { Metadata, Viewport } from 'next';

import { Providers } from '~/app/providers';
import { env } from '~/env';

interface RoutesProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Create T3 Turbo',
  description: 'Simple monorepo with shared backend for web & mobile apps',
  openGraph: {
    title: 'Create T3 Turbo',
    description: 'Simple monorepo with shared backend for web & mobile apps',
    url: 'https://create-t3-turbo.vercel.app',
    siteName: 'Create T3 Turbo',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jullerino',
    creator: '@jullerino',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};
export default function Layout(props: RoutesProps) {
  return (
    <html dir="ltr" lang="ko" suppressHydrationWarning>
      <head>
        <meta
          content="width=device-width,initial-scale=1,maximum-scale=2,shrink-to-fit=no"
          name="viewport"
        />
        <meta
          content="origin-when-cross-origin"
          id="meta_referrer"
          name="referrer"
        />
        <meta content="light" name="color-scheme" />
        <meta content="#FFFFFF" name="theme-color" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__ENV__ = ${JSON.stringify({
              SITE_URL: env.SITE_URL,
              API_HOST: env.API_PREFIX,
            })};`,
          }}
        />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
