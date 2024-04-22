import 'dotenv/config';

import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const keypair = getKeypairFromEnvironment('SECRET_KEY');

//SOL은 솔라나의 기본 토큰 이름입니다. 각 SOL은 10억 개의 Lamport 로 만들어집니다 . Lamport는 솔라나의 최소 단위입니다. 1 SOL = 1,000,000,000 Lamport
//계정은 토큰, NFT, 프로그램 및 데이터를 저장합니다.
//주소는 솔라나 네트워크의 계정을 가리킵니다. 누구든지 주어진 주소의 데이터를 읽을 수 있습니다. 대부분의 주소는 공개 키 이기도 합니다 .

// Solana 네트워크와의 모든 상호작용은 Connection 객체를 통해 이루어집니다. 이 객체는 클러스터 URL을 사용하여 생성됩니다.
const connection = new Connection(clusterApiUrl('devnet'));
const address = keypair.publicKey;
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${keypair.publicKey.toBase58()} is ${balanceInSol}!`,
);
