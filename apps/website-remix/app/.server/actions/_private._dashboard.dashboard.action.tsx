import type { ActionFunctionArgs } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { container } from "tsyringe";

import { UserController } from "~/.server/routes/users/controllers/user.controller";
import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

type NamedActionKey = "userUpdate" | "restoreWorkspace";

type ActionReturn<Name extends NamedActionKey> = Name extends "userUpdate"
  ? ReturnType<UserController["update"]>
  : Name extends "restoreWorkspace"
    ? ReturnType<WorkspaceController["restore"]>
    : never;

export const action = async <Name extends NamedActionKey>(
  args: ActionFunctionArgs,
) => {
  const formData = await args.request.formData();
  return namedAction(formData, {
    userUpdate: () => {
      return container.resolve(UserController).update(args, formData);
    },
    restoreWorkspace: () => {
      return container.resolve(WorkspaceController).restore(args, formData);
    },
  }) as ActionReturn<Name>;
};

type Action<Name extends NamedActionKey> = typeof action<Name>;

export type RoutesActionData<Name extends NamedActionKey> = Action<Name>;
