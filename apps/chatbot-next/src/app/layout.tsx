import '@template/ui/globals.css';

import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { cn } from '@template/ui/utils';

import { Providers } from '~/app/providers';
import { env } from '~/env';

interface RoutesProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Next.js Gemini Chatbot',
    template: `%s - Next.js Gemini Chatbot`,
  },
  description:
    'Build your own generative UI chatbot using the Vercel AI SDK and Google Gemini',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
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
