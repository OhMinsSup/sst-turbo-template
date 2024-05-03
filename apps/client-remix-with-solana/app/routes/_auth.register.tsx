import { Link, Outlet } from '@remix-run/react';

import { buttonVariants } from '@template/ui/button';
import { cn } from '@template/ui/utils';

import { registerAction } from '~/.server/routes/register/register.action';
import { SignupForm } from '~/components/auth/SignupForm';
import { Icons } from '~/components/icons';
import { navigation } from '~/constants/navigation';
import { seo } from '~/constants/seo';

export const action = registerAction;

export default function Routes() {
  return (
    <main className="container flex h-dvh w-dvw flex-col items-center justify-center">
      <Link
        to={navigation.login}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8',
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        뒤로가기
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div>
          <Icons.logo />
        </div>
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
          <p className="text-muted-foreground text-sm">
            {seo.title}(으)로 계정을 만들어보세요.
          </p>
        </div>
        <div className="grid gap-6">
          <SignupForm>
            <Outlet />
          </SignupForm>
        </div>
        <p className="text-muted-foreground space-x-2 py-2 text-sm">
          <span>{seo.title} 계정을 이미 가지고 계십니까?</span>
          <Link
            to={navigation.login}
            className="hover:text-brand underline underline-offset-4"
          >
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
