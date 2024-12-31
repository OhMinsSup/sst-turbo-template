import type { ActionFunctionArgs } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { container } from "tsyringe";

import { UserController } from "~/.server/routes/users/controllers/user.controller";

type NamedActionKey =
  | "restoreWorkspace"
  | "trashWorkspace"
  | "favoriteWorkspace";

type ActionReturn<Name extends NamedActionKey> = Name extends "updateUser"
  ? ReturnType<UserController["update"]>
  : never;

export const action = async <Name extends NamedActionKey>(
  args: ActionFunctionArgs,
) => {
  const formData = await args.request.formData();
  return namedAction(formData, {
    updateUser: () => {
      return container.resolve(UserController).update(args, formData);
    },
  }) as ActionReturn<Name>;
};

type Action<Name extends NamedActionKey> = typeof action<Name>;

export type RoutesActionData<Name extends NamedActionKey> = Action<Name>;
