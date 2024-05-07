import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import '@template/ui/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import '~/styles/globals.css';

import { useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { toast as showToast, Toaster } from 'sonner';

import { cn } from '@template/ui/utils';

import type { RoutesLoaderData } from '~/.server/routes/root.server';
import type { Toast } from '~/.server/utils/toast.server';
import { rootAction, rootLoader } from '~/.server/routes/root.server';
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
} from '~/context/useThemeContext';

export const loader = rootLoader;

export const action = rootAction;

function Routes() {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <html lang="ko" className={cn(data.theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body>
        {data.toast ? <ShowToast toast={data.toast} /> : null}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster closeButton position="bottom-right" />
      </body>
    </html>
  );
}

function ShowToast({ toast }: { toast: Toast }) {
  const { id, type, title, description } = toast;
  useEffect(() => {
    setTimeout(() => {
      showToast[type](title, { id, description });
    }, 0);
  }, [description, id, title, type]);
  return null;
}

export default function App() {
  const data = useLoaderData<RoutesLoaderData>();

  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new PhantomWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider className="wallet-dialog">
          <ThemeProvider specifiedTheme={data.theme}>
            <Routes />
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>오류 발생: {error.message}</p>
    </div>
  );
}
