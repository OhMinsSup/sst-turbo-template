import type { INestApplication } from "@nestjs/common";
import { Injectable, OnModuleInit } from "@nestjs/common";

import { Prisma, PrismaClient } from "@template/db";

import { LoggerService } from "../logger/logger.service";

export interface QueryEvent {
  timestamp: Date;
  query: string; // Query sent to the database
  params: string; // Query parameters
  duration: number; // Time elapsed (in milliseconds) between client issuing query and database responding - not only time taken to run query
  target: string;
}

export interface TxParams {
  tx?: Prisma.TransactionClient;
  isTransaction?: boolean;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _contextName = "prisma - database";

  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "event",
          level: "error",
        },
      ],
      errorFormat: "pretty",
    });
  }

  async onModuleInit() {
    await this.$connect();

    // @ts-expect-error - this is a private property
    this.$on("query", (e: QueryEvent) => {
      this.logger.log(
        "--------------------------------------------------",
        this._contextName,
      );
      this.logger.log(
        `[Timestamp]: ` + e.timestamp.getTime(),
        this._contextName,
      );
      this.logger.log(`[Query]: ` + e.query, this._contextName);
      this.logger.log(`[Params]: ` + e.params, this._contextName);
      this.logger.log(`[Duration]: ` + `${e.duration} ms`, this._contextName);
      this.logger.log(
        "--------------------------------------------------",
        this._contextName,
      );
    });

    // @ts-expect-error - this is a private property
    this.$on("error", (e: unknown) => {
      if (e instanceof Error) {
        this.logger.error(e.message, e.stack, this._contextName);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on("beforeExit", async () => {
      await app.close();
    });
  }
}
