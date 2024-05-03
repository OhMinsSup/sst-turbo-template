import { TabAccountForm } from "~/components/auth/TabAccountForm";
import { registerAction } from "~/.server/routes/register/register.action";

export const action = registerAction;

export default function Routes() {
  return <TabAccountForm />;
}
