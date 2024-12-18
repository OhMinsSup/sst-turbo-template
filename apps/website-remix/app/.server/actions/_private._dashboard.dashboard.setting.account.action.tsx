import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { Method } from "@template/common";

import { UserController } from "~/.server/routes/users/controllers/user.controller";
import { getTypeSafeMethod } from "~/.server/utils/shared";

export const action = async (args: ActionFunctionArgs) => {
  const instance = container.resolve(UserController);
  const method = getTypeSafeMethod(args.request);
  switch (method) {
    case Method.PATCH: {
      return await instance.update(args);
    }
    default: {
      throw instance.noop(args);
    }
  }
};

export type RoutesActionData = typeof action;
