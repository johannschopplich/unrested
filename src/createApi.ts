import { $fetch } from "ohmyfetch";
import type { FetchOptions } from "ohmyfetch";

export type UnCreateClient<T extends string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in T]: <R = any>(id?: number | string) => Promise<R>;
};

/**
 * Minimal, type-safe REST client using JS proxies
 */
export const createApi = <T extends string>(
  baseURL: string,
  opts: Omit<FetchOptions<"json">, "baseURL"> = {}
) => {
  return new Proxy({} as UnCreateClient<T>, {
    get(_target, key: T) {
      return (id?: number | string) =>
        $fetch(`${key}${id ? `/${id}` : ""}`, { baseURL, ...opts });
    },
  });
};
