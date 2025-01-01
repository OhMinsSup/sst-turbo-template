import type { MetaFunction } from "@remix-run/node";

import type { RoutesLoaderData } from "~/.server/loaders/empty.loader";
import { SignUpForm } from "~/components/auth/SignUpForm";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { action } from "~/.server/actions/signup.action";

export { loader } from "~/.server/loaders/empty.loader";

export const meta: MetaFunction<RoutesLoaderData> = () => {
  return getMeta({
    title: `회원가입 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <SignUpForm />;
}
