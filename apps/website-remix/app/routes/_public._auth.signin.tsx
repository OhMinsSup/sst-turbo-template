import type { MetaFunction } from "@remix-run/node";

import type { RoutesLoaderData } from "~/.server/loaders/empty.loader";
import { SignInForm } from "~/components/auth/SignInForm";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { action } from "~/.server/actions/signin.action";

export { loader } from "~/.server/loaders/empty.loader";

export const meta: MetaFunction<RoutesLoaderData> = () => {
  return getMeta({
    title: `로그인 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <SignInForm />;
}
