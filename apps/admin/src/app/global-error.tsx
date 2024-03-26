'use client';

import { ThemeProvider } from 'next-themes';

import ErrorPage from '~/components/error/error-page';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  console.error(error);
  return (
    <html dir="ltr" lang="ko">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ErrorPage
            status={500}
            title={"Oops! Something went wrong {`:')`"}
            description={
              <>
                We apologize for the inconvenience. <br /> Please try again
                later.
              </>
            }
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
