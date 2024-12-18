import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { getTypeSafeMethod } from "~/.server/utils/shared";
import { WorkspaceController } from "../../workspaces/controllers/workspace.controller";

export const action = async (args: ActionFunctionArgs) => {
  const instance = container.resolve(WorkspaceController);
  const method = getTypeSafeMethod(args.request);
  switch (method) {
    case "PATCH": {
      return await instance.restore(args);
    }
    default: {
      throw instance.noop(args);
    }
  }
};

export type RoutesActionData = typeof action;
