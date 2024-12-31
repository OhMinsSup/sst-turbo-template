import type { ActionFunctionArgs } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { container } from "tsyringe";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

type NamedActionKey = "favoriteWorkspace" | "createWorkspace";

type ActionReturn<Name extends NamedActionKey> = Name extends "createWorkspace"
  ? ReturnType<WorkspaceController["create"]>
  : never;

export const action = async <Name extends NamedActionKey>(
  args: ActionFunctionArgs,
) => {
  const formData = await args.request.formData();
  return namedAction(formData, {
    createWorkspace: () => {
      return container.resolve(WorkspaceController).create(args, formData);
    },
  }) as ActionReturn<Name>;
};

type Action<Name extends NamedActionKey> = typeof action<Name>;

export type RoutesActionData<Name extends NamedActionKey> = Action<Name>;
