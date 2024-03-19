'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from '@template/ui';

import type { FormFieldValues } from '~/services/validate/auth/signup';
import { Icons } from '~/components/icons';
import { schema } from '~/services/validate/auth/signup';

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const methods = useForm<FormFieldValues>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (input: FormFieldValues) => {
    startTransition(() => {
      console.log(input);
    });
  };

  return (
    <div className="grid gap-6">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground text-sm font-medium hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" disabled={isPending}>
              Create Account
            </Button>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full space-x-2"
                type="button"
                disabled={isPending}
              >
                <Icons.github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="w-full space-x-2"
                type="button"
                disabled={isPending}
              >
                <Icons.facebook className="h-4 w-4" />
                <span>Facebook</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
