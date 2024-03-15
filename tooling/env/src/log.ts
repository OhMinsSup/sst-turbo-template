import chalk from 'chalk';

export type Logger = ReturnType<typeof createLogger>;

export const createLogger = () => {
  return {
    error(...args: unknown[]) {
      console.log(chalk.red(...args));
    },
    warn(...args: unknown[]) {
      console.log(chalk.yellow(...args));
    },
    info(...args: unknown[]) {
      console.log(chalk.cyan(...args));
    },
    success(...args: unknown[]) {
      console.log(chalk.green(...args));
    },
  };
};

export const logger = createLogger();
