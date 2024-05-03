export function callAll<Args extends unknown[]>(
  ...fns: (((...args: Args) => unknown) | undefined)[]
) {
  return (...args: Args) => {
    fns.forEach((fn) => fn?.(...args));
  };
}
