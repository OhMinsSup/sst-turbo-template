import 'dotenv/config';

import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const keypair = getKeypairFromEnvironment('SECRET_KEY');

const address = keypair.publicKey;
console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`,
);

const connection = new Connection(clusterApiUrl('devnet'));
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${keypair.publicKey.toBase58()} is ${balanceInSol}!`,
);

const LAMPORTS_TO_SEND = 5000;

const toPublicKey = new PublicKey(
  '4RZQDPWVLtYMhJ9Ex2fsSwCYbDFqqYzVYYmzmbcNfxSc',
);

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: address,
  toPubkey: toPublicKey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  keypair,
]);

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPublicKey}. `,
);
console.log(`Transaction signature is ${signature}!`);
