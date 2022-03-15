/* eslint-disable @typescript-eslint/no-explicit-any */
import { $fetch } from "ohmyfetch";
import { resolveURL, withQuery } from "ufo";
import type { FetchOptions } from "ohmyfetch";
import type { ApiBuilder, ApiFetchHandler, ResponseType } from "./types";

export type { ApiBuilder };

/**
 * Minimal, type-safe REST client using JS proxies
 */
export function createApi<R extends ResponseType = "json">(
  url: string,
  defaults: FetchOptions<R> = {}
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

        const handler: ApiFetchHandler = <
          T = any,
          R extends ResponseType = "json"
        >(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?: Record<string, any>,
          opts: FetchOptions<R> = {}
        ) => {
          switch (method) {
            case "GET":
              if (data) url = withQuery(url, data);
              break;
            case "POST":
            case "PUT":
            case "PATCH":
              opts.body = data;
          }

          return $fetch<T, R>(url, {
            ...(defaults as unknown as FetchOptions<R>),
            ...opts,
            method,
          });
        };

        return handler;
      },
      apply(_target, _thisArg, args: (string | number)[] = []) {
        return p(resolveURL(url, ...args.map((i) => `${i}`)));
      },
    });

  return p(url);
}
