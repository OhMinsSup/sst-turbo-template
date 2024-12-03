import { SignUpForm } from "~/components/auth/SignUpForm";

export { action } from "~/.server/routes/auth/signup.action";

export const loader = () => {
  return {};
};

export default function Routes() {
  return <SignUpForm />;
}
