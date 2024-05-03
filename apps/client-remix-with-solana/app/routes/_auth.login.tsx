import { Link } from "@remix-run/react";
import { LoginForm } from "~/components/auth/LoginForm";
import { Icons } from "~/components/icons";
import { buttonVariants } from "~/components/ui/button";
import { navigation } from "~/constants/navigation";
import { seo } from "~/constants/seo";
import { loginAction } from "~/.server/routes/login/login.action";
import { cn } from "~/utils/utils";

export const action = loginAction;

export default function Routes() {
  return (
    <main className="container flex h-dvh w-dvw flex-col items-center justify-center">
      <Link
        to={navigation.home}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        뒤로가기
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div>
          <Icons.logo />
        </div>
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-sm text-muted-foreground">
            {seo.title}(으)로 계속 이동
          </p>
        </div>
        <div className="grid gap-6">
          <LoginForm />
        </div>
        <p className="py-8 text-sm text-muted-foreground space-x-2">
          <span>{seo.title} 이용이 처음이십니까?</span>
          <Link
            to={navigation.register}
            className="hover:text-brand underline underline-offset-4"
          >
            시작하기
          </Link>
        </p>
      </div>
    </main>
  );
}
