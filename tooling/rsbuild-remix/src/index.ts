export const rsbuildPlugin = (...args: any[]) => {
  const { remixRsbuildPlugin } =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/no-var-requires -- This is a dynamic import
    require('./plugin') as typeof import('./plugin');
  return remixRsbuildPlugin(...args);
};
