import { Command } from 'commander';

import type { Options } from './options';
import { load } from './load';
import { defaultOptions } from './options';

export async function main() {
  return new Promise<ReturnType<typeof load>>((resolve, reject) => {
    let options: Options = defaultOptions;
    const program = new Command().name('@tooling/env');

    program
      .description('@tooling/env')
      .option(
        '--env-type <envType>',
        `Environment type. Defaults to ${options.envType}.`,
      )
      .option(
        '--save-name <saveName>',
        `Root directory of the project. Defaults to ${options.saveName}.`,
      )
      .option(
        '--save-path <savePath>',
        `Environment to deploy to. Defaults to ${options.savePath}.`,
      )
      .option(
        '--load-name <loadName>',
        `Environment to deploy to. Defaults to ${options.loadName}.`,
      )
      .option(
        '--load-path <loadPath>',
        `Environment to deploy to. Defaults to ${options.loadPath}.`,
      )
      .parse(process.argv);

    options = program.opts<Options>();

    const result = load(options);
    if (result instanceof Error) {
      reject(result);
    } else {
      resolve(result);
    }
  });
}
