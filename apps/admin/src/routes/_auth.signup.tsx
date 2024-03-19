import React from 'react';
import Link from 'next/link';

import { SignupForm } from '~/components/auth/siupin-form';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import AuthLayout from './_auth';

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-lg font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to create an account. <br />
          Already have an account?{' '}
          <Link
            href={PAGE_ENDPOINTS.AUTH.SIGNIN}
            className="hover:text-primary underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
      <SignupForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        By creating an account, you agree to our{' '}
        <a
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>
    </AuthLayout>
  );
}
