import { registerAction } from '~/.server/routes/register.action';
import { TabAccountForm } from '~/components/auth/TabAccountForm';

export const action = registerAction;

export default function Routes() {
  return <TabAccountForm />;
}
