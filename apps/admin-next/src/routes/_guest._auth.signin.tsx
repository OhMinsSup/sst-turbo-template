import React from 'react';

import { SigninForm } from '~/components/auth/signin-form';
import AuthLayout from './_guest._auth';

export default function SigninPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password below <br />
          to log into your account
        </p>
      </div>
      <SigninForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        By clicking login, you agree to our{' '}
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
