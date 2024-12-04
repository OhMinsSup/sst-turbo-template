import { SignInForm } from "~/components/auth/SignInForm";

export { action } from "~/.server/routes/auth/actions/signin.action";

export const loader = () => {
  return {};
};

export default function Routes() {
  return <SignInForm />;
}
