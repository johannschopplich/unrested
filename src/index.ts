import { $fetch } from "ohmyfetch";
import { resolveURL, withQuery } from "ufo";
import type { FetchOptions } from "ohmyfetch";
import type { ApiBuilder, ApiFetchHandler, ResponseType } from "./types";

export type { ApiBuilder };

/**
 * Minimal, type-safe REST client using JS proxies
 */
export function createApi<T extends ResponseType = "json">(
  url: string,
  defaults: FetchOptions<T> = {}
): ApiBuilder {
  // Callable internal target required to use `apply` on it
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const internalTarget = (() => {}) as ApiBuilder;

  const p = (url: string): ApiBuilder =>
    new Proxy(internalTarget, {
      get(_target, key: string) {
        const method = key.toUpperCase();

        if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
          return p(resolveURL(url, key));
        }

        const handler: ApiFetchHandler = (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?: Record<string, any>,
          opts: FetchOptions = {}
        ) => {
          switch (method) {
            case "GET":
              if (data) url = withQuery(url, data);
              break;
            case "POST":
            case "PUT":
            case "PATCH":
              opts.body = JSON.stringify(data);
          }

          return $fetch(url, { ...defaults, ...opts, method });
        };

        return handler;
      },
      apply(_target, _thisArg, args: (string | number)[] = []) {
        return p(resolveURL(url, ...args.map((i) => `${i}`)));
      },
    });

  return p(url);
}
