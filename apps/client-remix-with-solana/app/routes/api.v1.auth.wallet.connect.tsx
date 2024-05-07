import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { logout } from '~/.server/utils/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  throw await logout({ request });
};

export type RoutesActionData = typeof action;

export const loader = () => redirect('/', { status: 404 });

export const getPath = () => {
  return '/api/v1/auth/wallet/connect';
};

export default function Routes() {
  return <div>Oops... You should not see this.</div>;
}
