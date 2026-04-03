// @ts-nocheck
export function createGameProxies(ctx) {
  const createObjectProxy = (key) => new Proxy({}, {
    get(_target, prop) {
      return ctx[key][prop];
    },
    set(_target, prop, value) {
      ctx[key][prop] = value;
      return true;
    },
    deleteProperty(_target, prop) {
      return delete ctx[key][prop];
    },
    has(_target, prop) {
      return prop in ctx[key];
    },
    ownKeys() {
      return Reflect.ownKeys(ctx[key]);
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    }
  });

  return {
    state: createObjectProxy('state'),
    meta: createObjectProxy('meta'),
    persistenceStatus: createObjectProxy('persistenceStatus')
  };
}
