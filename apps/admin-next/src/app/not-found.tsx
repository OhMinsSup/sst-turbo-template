'use client';

import ErrorPage from '~/components/error/error-page';

export default function NotFound() {
  return (
    <ErrorPage
      status={404}
      title="Oops! Page Not Found!"
      description={
        <>
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </>
      }
    />
  );
}
