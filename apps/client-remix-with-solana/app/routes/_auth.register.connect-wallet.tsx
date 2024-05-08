import { connectWalletLoader } from '~/.server/routes/connect-wallet.loader';
import { TabWalletForm } from '~/components/auth/TabWalletForm';

export const loader = connectWalletLoader;

export default function Routes() {
  return <TabWalletForm />;
}
