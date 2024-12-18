import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { WidgetsService } from "../services/widgets.service";
import { WidgetsController } from "./widgets.controller";

describe("WidgetsController", () => {
  let controller: WidgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsController],
      providers: [WidgetsService],
    }).compile();

    controller = module.get<WidgetsController>(WidgetsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
