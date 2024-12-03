import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { WorkspacesService } from "../services/workspaces.service";
import { WorkspacesController } from "./workspaces.controller";

describe("WorkspacesController", () => {
  let controller: WorkspacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [WorkspacesService],
    }).compile();

    controller = module.get<WorkspacesController>(WorkspacesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
