import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { Method } from "@template/common";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";
import { getTypeSafeMethod } from "~/.server/utils/shared";

export const action = async (args: ActionFunctionArgs) => {
  const instance = container.resolve(WorkspaceController);

  const method = getTypeSafeMethod(args.request);
  switch (method) {
    case Method.POST: {
      return await instance.create(args);
    }
    case Method.PATCH: {
      return await instance.favorite(args);
    }
    default: {
      throw instance.noop(args);
    }
  }
};

export type RoutesActionData = typeof action;
