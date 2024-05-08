export {
  loader,
  type RoutesLoaderData,
} from '~/.server/api/auth.wallet.request-password.$address.loader';

export const getPath = (address: string) => {
  return `/api/v1/auth/wallet/request-password/${address}`;
};
