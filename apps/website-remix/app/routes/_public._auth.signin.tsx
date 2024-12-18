import { SignInForm } from "~/components/auth/SignInForm";

export { action } from "~/.server/routes/auth/actions/signin.action";

export { loader } from "~/.server/routes/root/loaders/empty.loader";

export default function Routes() {
  return <SignInForm />;
}
