/* eslint-disable @typescript-eslint/no-explicit-any */
import { $fetch } from "ohmyfetch";
import type { FetchOptions } from "ohmyfetch";
import type { FetchMethodHandler, UnCreateClient } from "./types";

export type { UnCreateClient };

interface CallableTarget {
  (...args: any[]): any;
  url: string;
}

/**
 * Minimal, type-safe REST client using JS proxies
 */
export function createApi(
  url: string,
  opts: FetchOptions<"json"> = {},
  scope: string[] = []
): UnCreateClient {
  // Callable solely required to use `apply` on it
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const callable: CallableTarget = () => {};
  callable.url = url;

  return new Proxy(callable, {
    get({ url }, key: string) {
      const method = key.toUpperCase();
      const path = [...scope, key];

      if (["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
        const handler: FetchMethodHandler = (
          data?: any,
          methodOpts: FetchOptions = {}
        ) => {
          switch (methodOpts.method) {
            case "GET":
              if (data) url = `${url}?${new URLSearchParams(data)}`;
              break;
            case "POST":
            case "PUT":
            case "PATCH":
              methodOpts.body = JSON.stringify(data);
          }

          return $fetch(url, { method, ...opts, ...methodOpts });
        };

        return handler;
      }

      return createApi(`${url}/${key}`, opts, path);
    },
    apply({ url }, _thisArg, [arg] = []) {
      const path = url.split("/");
      return createApi(arg ? `${url}/${arg}` : url, opts, path);
    },
  }) as unknown as UnCreateClient;
}
