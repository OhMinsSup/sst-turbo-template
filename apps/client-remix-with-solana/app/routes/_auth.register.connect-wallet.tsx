import { TabWalletForm } from "~/components/auth/TabWalletForm";
import { connectWalletLoader } from "~/.server/routes/connect-wallet/connect-wallet.loader";

export const loader = connectWalletLoader;

export default function Routes() {
  return <TabWalletForm />;
}
