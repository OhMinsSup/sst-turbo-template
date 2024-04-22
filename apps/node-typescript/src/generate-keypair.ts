import { Keypair } from '@solana/web3.js';

// solana는 공개 키를 주소로 사용
// 공개키는 솔라나 네트워크의 계정을 가리키는 "주소"로 사용
// 비밀키는 해당 키 쌍에 대한 권환을 확인하는 데 사용합니다. 주소에 대한 비밀 키가 있으면 해당 주소 내의 토큰을 제어할 수 있습니다. 이러한 이유로 이름에서 알 수 있듯이 비밀 키를 항상 비밀로 유지해야 합니다 .
const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);
console.log(`✅ Finished!`);
