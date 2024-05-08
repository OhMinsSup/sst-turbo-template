import type { ActionFunctionArgs } from '@remix-run/node';

import { logout } from '~/.server/auth/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  throw await logout({ request });
};

export type RoutesActionData = typeof action;
