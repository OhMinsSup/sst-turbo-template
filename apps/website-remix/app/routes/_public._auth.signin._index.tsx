import { SignInForm } from "~/components/auth/SignInForm";

export { action } from "~/.server/routes/auth/signin.action";

export default function Routes() {
  return <SignInForm />;
}
