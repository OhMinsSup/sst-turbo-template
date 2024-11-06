import { SignUpForm } from "~/components/auth/SignUpForm";

export { action } from "~/.server/routes/auth/signup.action";

export default function Routes() {
  return <SignUpForm />;
}
