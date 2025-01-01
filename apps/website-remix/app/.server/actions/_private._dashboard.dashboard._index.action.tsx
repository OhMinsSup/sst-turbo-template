import type { ActionFunctionArgs } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { container } from "tsyringe";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

type NamedActionKey =
  | "favoriteWorkspace"
  | "createWorkspace"
  | "trashWorkspace";

type ActionReturn<Name extends NamedActionKey> = Name extends "createWorkspace"
  ? ReturnType<WorkspaceController["create"]>
  : Name extends "trashWorkspace"
    ? ReturnType<WorkspaceController["remove"]>
    : Name extends "favoriteWorkspace"
      ? ReturnType<WorkspaceController["favorite"]>
      : never;

export const action = async <Name extends NamedActionKey>(
  args: ActionFunctionArgs,
) => {
  const formData = await args.request.formData();
  return namedAction(formData, {
    createWorkspace: () => {
      return container.resolve(WorkspaceController).create(args, formData);
    },
    trashWorkspace: () => {
      return container.resolve(WorkspaceController).remove(args, formData);
    },
    favoriteWorkspace: () => {
      return container.resolve(WorkspaceController).favorite(args, formData);
    },
  }) as ActionReturn<Name>;
};

type Action<Name extends NamedActionKey> = typeof action<Name>;

export type RoutesActionData<Name extends NamedActionKey> = Action<Name>;
