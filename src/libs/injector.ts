const injected: {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
} = {};

export const inject = <T>(c: new () => T): T => {
  if (injected[c.name]) {
    return injected[c.name];
  }
  injected[c.name] = new c();
  return injected[c.name];
};