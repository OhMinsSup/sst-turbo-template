import { SignUpForm } from "~/components/auth/SignUpForm";

export { action } from "~/.server/routes/auth/actions/signup.action";

export { loader } from "~/.server/routes/root/loaders/empty.loader";

export default function Routes() {
  return <SignUpForm />;
}
