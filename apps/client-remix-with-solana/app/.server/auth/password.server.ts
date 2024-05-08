import crypto from 'node:crypto';
import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

import { prisma } from '~/.server/db/db.server';
import { invariantResponse } from '~/services/misc';

export const hash = (str: string, salt: string) => {
  // web crypto api를 사용하여 해시를 생성합니다.
  const encoder = new TextEncoder();
  const data = encoder.encode(str + salt);
  return crypto.subtle.digest('SHA-256', data);
};

export const hashPassword = async (password: string, salt: string) => {
  const hashed = await hash(password, salt);
  return Array.from(new Uint8Array(hashed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
  salt: string,
) => {
  return (await hashPassword(password, salt)) === hashedPassword;
};

export const generateOneTimePassword = async (
  userId: number,
  signMessage: string,
): Promise<string> => {
  const nonce = crypto.randomUUID();
  await prisma.user.update({
    where: { id: userId },
    data: { nonce },
  });
  return `${signMessage}${nonce}`;
};

export const validateWallet = async (
  userId: number,
  address: string,
  encoding: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  invariantResponse(
    user,
    JSON.stringify({
      status: 'error',
      result: null,
      message: '사용자를 찾을 수 없습니다. 다시 로그인해주세요.',
    }),
    {
      status: 404,
    },
  );

  const oneTimePassword = `${process.env.SIGN_MESSAGE}${user.nonce}`;
  const oneTimePasswordBytes = new TextEncoder().encode(oneTimePassword);

  const publicKeyBytes = bs58.decode(address);
  const signatureBytes = bs58.decode(encoding);

  try {
    const isVerified = nacl.sign.detached.verify(
      oneTimePasswordBytes,
      signatureBytes,
      publicKeyBytes,
    );

    invariantResponse(
      isVerified,
      JSON.stringify({
        status: 'error',
        result: null,
        message: '잘못된 서명입니다. 다시 시도해주세요.',
      }),
      {
        status: 400,
      },
    );

    return true;
  } catch (e) {
    console.error('Failed to construct a Message object: ', e);
  }

  console.log('Trying fallback for the ledger');
  const transaction = Transaction.from(signatureBytes);
  const txHasOnlyOneSigner = transaction.signatures.length === 1;
  const txSignerMatchesPublicKey = transaction.signatures[0].publicKey
    .toBuffer()
    .equals(publicKeyBytes);
  const txInstructionMatchesOTP = transaction.instructions
    ?.at(-1)
    ?.data.equals(oneTimePasswordBytes);

  console.log('before if condition');

  if (
    txHasOnlyOneSigner &&
    txSignerMatchesPublicKey &&
    txInstructionMatchesOTP
  ) {
    const isVerified = transaction.verifySignatures();

    invariantResponse(
      isVerified,
      JSON.stringify({
        status: 'error',
        result: null,
        message: '잘못된 서명입니다. 다시 시도해주세요.',
      }),
      {
        status: 400,
      },
    );

    return true;
  }
};
