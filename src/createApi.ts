import { $fetch } from "ohmyfetch";
import type { FetchOptions } from "ohmyfetch";

export type UnCreateClient<T extends string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in T]: <R extends Record<string, any>>(id?: number | string) => Promise<R>;
};

/**
 * Minimal, type-safe REST client using JS proxies
 */
export const createApi = <T extends string>(
  baseUrl: string,
  opts?: Omit<FetchOptions, "baseURL">
) => {
  return new Proxy({} as UnCreateClient<T>, {
    get(_target, key: T) {
      return (id?: number | string) =>
        $fetch(`${baseUrl}/${key}${id ? `/${id}` : ""}`, opts);
    },
  });
};
