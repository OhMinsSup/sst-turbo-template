import { useCallback, useEffect, useMemo } from 'react';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BaseWalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

import { ClientOnly } from '@template/react-components/client-only';
import { Button } from '@template/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@template/ui/card';

import type { RoutesActionData as R2 } from '~/routes/api.v1.auth.wallet.connect';
import type { RoutesLoaderData as R1 } from '~/routes/api.v1.auth.wallet.request-password.$address';
import { type RoutesLoaderData as R0 } from '~/.server/routes/connect-wallet.loader';
import { navigation } from '~/constants/navigation';
import { WALLET_LABELS } from '~/constants/wallets';
import { getPath as getR2Path } from '~/routes/api.v1.auth.wallet.connect';
import { getPath } from '~/routes/api.v1.auth.wallet.request-password.$address';

export default function TabWalletForm() {
  const { result } = useLoaderData<R0>();
  const navigate = useNavigate();
  const connectedWalletAddresses = useMemo(
    () => result?.wallets?.map((wallet) => wallet.address) ?? [],
    [result],
  );
  const $requestPassword = useFetcher<R1>();
  const $connectWallet = useFetcher<R2>();

  const { wallet, publicKey, signMessage, signTransaction, connected } =
    useWallet();

  const { connection } = useConnection();

  const walletAddress = publicKey?.toBase58();

  const onAuthorizeWallet = async () => {
    const { data, state } = $requestPassword;
    if (state === 'idle' && data !== null && walletAddress) {
      const signature = data?.result?.signature;
      if (signature) {
        const message = new TextEncoder().encode(signature);

        let encoding = '';
        // 지갑 서명을 지원하는 경우
        if (signMessage && wallet?.adapter.name !== 'Ledger') {
          const signedMessage = await signMessage(message);
          encoding = bs58.encode(signedMessage);
        } else if (signTransaction) {
          // 지갑 서명을 지원하지 않는 경우 트랜잭션 서명
          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();

          const transaction = new Transaction({
            feePayer: publicKey,
            blockhash,
            lastValidBlockHeight,
          }).add({
            keys: [],
            programId: PublicKey.default,
            data: Buffer.from(message),
          });

          const signedTransaction = await signTransaction(transaction);
          encoding = bs58.encode(signedTransaction.serialize());
        } else {
          throw new Error(
            '지갑이 메시지 또는 트랜잭션 서명을 지원하지 않습니다.',
          );
        }

        const formData = new FormData();
        formData.append('address', walletAddress);
        formData.append('encoding', encoding);
        formData.append('signature', signature);

        $connectWallet.submit(formData, {
          navigate: false,
          action: getR2Path(),
          method: 'post',
        });
      }
    }
  };

  const onSignatures = useCallback(async () => {
    if (!walletAddress) {
      return;
    }
    $requestPassword.load(getPath(walletAddress));
  }, [$requestPassword, walletAddress]);

  const isSignature =
    $requestPassword.state === 'idle' &&
    $requestPassword.data?.result?.signature &&
    walletAddress !== null;

  useEffect(() => {
    if (!!walletAddress && connectedWalletAddresses.includes(walletAddress)) {
      navigate(navigation.emailVerification);
    }
  }, [connectedWalletAddresses, walletAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>지갑연결</CardTitle>
        <CardDescription>
          좋아하는 Solana 지갑과 연결하여 지갑을 통해 토큰을 보내고 받을 수
          있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="wallet-form flex justify-between">
        <ClientOnly fallback={<></>}>
          <BaseWalletMultiButton labels={WALLET_LABELS} />
        </ClientOnly>
        <div className="space-x-2">
          {walletAddress && connected ? (
            <>
              {isSignature ? (
                <Button type="button" size="sm" onClick={onAuthorizeWallet}>
                  연결하기
                </Button>
              ) : (
                <Button type="button" size="sm" onClick={onSignatures}>
                  서명하기
                </Button>
              )}
            </>
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              navigate(navigation.emailVerification);
            }}
          >
            건너뛰기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
