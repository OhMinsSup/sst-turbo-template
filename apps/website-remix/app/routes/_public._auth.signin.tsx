import { SignInForm } from "~/components/auth/SignInForm";

export { action } from "~/.server/actions/signin.action";

export { loader } from "~/.server/loaders/empty.loader";

export default function Routes() {
  return <SignInForm />;
}
