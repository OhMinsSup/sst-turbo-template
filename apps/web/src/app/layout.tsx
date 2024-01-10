import '~/assets/css/globals.css';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getHeaderInDomainInfo } from '@template/libs';
import { env } from 'env.mjs';
import { PAGE_ENDPOINTS, SITE_CONFIG } from '~/constants/constants';
import { Providers } from '~/app/providers';
import { cn } from '~/utils/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

interface RoutesProps {
  children: React.ReactNode;
}

// Lazy load headers
const getHeaders = cache(() => Promise.resolve(headers()));

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await getHeaders();
  const info = getHeaderInDomainInfo(headersList);
  const metadataBase = new URL(info.domainUrl);
  return {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    icons: {
      icon: SITE_CONFIG.favicon,
    },
    metadataBase,
    manifest: SITE_CONFIG.manifest,
    alternates: {
      canonical: PAGE_ENDPOINTS.ROOT,
    },
    openGraph: {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      url: metadataBase.href,
      siteName: SITE_CONFIG.title,
      locale: 'ko_KR',
      type: 'article',
    },
  };
}

export default async function Layout(props: RoutesProps) {
  const headersList = await getHeaders();
  const info = getHeaderInDomainInfo(headersList);
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
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__ENV__ = ${JSON.stringify({
              SITE_URL: env.SITE_URL,
              API_HOST: env.API_PREFIX,
            })};
            window.__DOMAIN_INFO__ = ${JSON.stringify(info)}`,
          }}
        />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
