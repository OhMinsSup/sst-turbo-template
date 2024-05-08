import { TabWalletForm } from '~/components/auth/TabWalletForm';

export { loader } from '~/.server/routes/connect-wallet.loader';

export default function Routes() {
  return <TabWalletForm />;
}
