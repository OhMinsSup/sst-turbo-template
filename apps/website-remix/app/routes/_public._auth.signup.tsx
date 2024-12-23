import { SignUpForm } from "~/components/auth/SignUpForm";

export { action } from "~/.server/actions/signup.action";

export { loader } from "~/.server/loaders/empty.loader";

export default function Routes() {
  return <SignUpForm />;
}
