import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

import { prisma } from '~/.server/utils/db.server';
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
  message: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    invariantResponse(false, '회원을 찾을 수 없습니다. 다시 로그인해주세요.', {
      status: 404,
    });
  }

  const messageBytes = new TextEncoder().encode(message);

  const publicKeyBytes = bs58.decode(address);
  const signatureBytes = bs58.decode(encoding);

  try {
    const isVerified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes,
    );

    if (!isVerified) {
      invariantResponse(false, '잘못된 서명입니다. 다시 시도해주세요.', {
        status: 400,
      });
    }

    return true;
  } catch (e) {
    console.error('Failed to construct a Message object: ', e);
  }

  try {
    const clone = [...signatureBytes];
    const transaction = Transaction.from(signatureBytes);
    const txHasOnlyOneSigner = transaction.signatures.length === 1;
    const txSignerMatchesPublicKey = transaction.signatures[0].publicKey
      .toBuffer()
      .equals(publicKeyBytes);
    const txInstructionMatchesOTP = transaction.instructions
      ?.at(-1)
      ?.data.equals(messageBytes);

    console.log('before if condition');
    if (
      txHasOnlyOneSigner &&
      txSignerMatchesPublicKey &&
      txInstructionMatchesOTP
    ) {
      const isVerified = transaction.verifySignatures();

      if (!isVerified) {
        invariantResponse(false, '잘못된 서명입니다. 다시 시도해주세요.', {
          status: 400,
        });
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to construct a Transaction object: ', e);
    invariantResponse(false, '지갑 연결에 실패했습니다. 다시 시도해주세요.', {
      status: 403,
    });
  }
};
