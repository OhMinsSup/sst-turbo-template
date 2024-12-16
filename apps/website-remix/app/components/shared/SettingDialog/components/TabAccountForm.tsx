import React, { useRef } from "react";
import { useSubmit } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldUpdateUsername } from "@template/validators/user";
import { Button } from "@template/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import { useHover } from "@template/ui/hooks";
import { cn } from "@template/ui/lib";
import { updateUsernameSchema } from "@template/validators/user";

import { Icons } from "~/components/icons";
import { UserImage } from "~/components/shared/User";
import { useUser } from "~/hooks/useUser";
import { Title } from "./Title";

function UpdateUsernameForm() {
  const user = useUser();
  const form = useForm<FormFieldUpdateUsername>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: user.username,
    },
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });
  const submit = useSubmit();

  const onSubmit = form.handleSubmit((input) => {
    console.log(input);
    const formData = new FormData();
    formData.append("username", input.username ?? "test");
    submit(formData, {
      method: "PATCH",
      relative: "route",
    });
  });

  return (
    <Form {...form}>
      <form
        id="update-username-form"
        className="ml-5 w-[250px]"
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>선호하는 이름</FormLabel>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <FormControl>
                  <Input placeholder="이름" dir="auto" {...field} />
                </FormControl>
                <Button type="submit">수정</Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function UpdateUserImageForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { hover } = useHover({
    options: {
      target: containerRef,
    },
  });

  const { hover: buttonHover } = useHover({
    options: {
      target: buttonRef,
    },
  });

  return (
    <>
      <div
        ref={containerRef}
        className={cn("flex flex-col items-center justify-center", {
          "cursor-pointer": hover,
        })}
      >
        {hover && (
          <Button
            size="icon"
            ref={buttonRef}
            className="absolute left-[100px] top-[100px] z-10 size-5 rounded-full"
          >
            <Icons.X />
          </Button>
        )}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="update-user-image">
          <UserImage className="size-14" />
        </label>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          id="update-user-image"
          onChange={(e) => {
            console.log(e.target.files);
          }}
        />
        {hover && (
          <div className="absolute top-[165px]">
            <Button size="sm">사진 {buttonHover ? "제거" : "바꾸기"}</Button>
          </div>
        )}
      </div>
    </>
  );
}

export default function TabAccountForm() {
  return (
    <>
      <Title>내 프로필</Title>
      <div className="flex flex-col">
        <div className="flex h-[80px] flex-row items-center">
          <UpdateUserImageForm />
          <UpdateUsernameForm />
        </div>
      </div>
    </>
  );
}
