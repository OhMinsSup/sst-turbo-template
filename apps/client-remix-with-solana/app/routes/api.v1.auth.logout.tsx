import { redirect } from '@remix-run/node';

export { action, type RoutesActionData } from '~/.server/api/auth.logout';

export const loader = () => redirect('/', { status: 404 });

export const getPath = () => {
  return '/api/v1/auth/logout';
};

export default function Routes() {
  return <div>Oops... You should not see this.</div>;
}
