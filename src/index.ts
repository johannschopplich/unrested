import { $fetch } from 'ohmyfetch'
import { resolveURL, withQuery } from 'ufo'
import type { QueryObject } from 'ufo'
import type { FetchOptions } from 'ohmyfetch'
import type { ClientBuilder, ClientMethodHandler, ResponseType } from './types'
import { headersToObject } from './utils'

export type { ClientBuilder }

const payloadMethods: ReadonlyArray<string> = [
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
]

/**
 * Minimal, type-safe REST client using JS proxies
 */
export function createClient<R extends ResponseType = 'json'>(
  defaultOptions: Omit<FetchOptions<R>, 'method'> = {},
): ClientBuilder {
  // Callable internal target required to use `apply` on it
  const internalTarget = (() => {}) as ClientBuilder

  function p(url: string): ClientBuilder {
    return new Proxy(internalTarget, {
      get(_target, key: string) {
        const method = key.toUpperCase()

        if (!['GET', ...payloadMethods].includes(method))
          return p(resolveURL(url, key))

        const handler: ClientMethodHandler = <T = any, R extends ResponseType = 'json'>(
          data?: RequestInit['body'] | Record<string, any>,
          opts: FetchOptions<R> = {},
        ) => {
          if (method === 'GET' && data)
            url = withQuery(url, data as QueryObject)
          else if (payloadMethods.includes(method))
            opts.body = data

          opts.method = method

          return $fetch<T, R>(
            url,
            {
              ...defaultOptions,
              ...opts,
              headers: {
                ...(headersToObject(defaultOptions.headers) || {}),
                ...(headersToObject(opts.headers) || {}),
              },
            } as FetchOptions<R>,
          )
        }

        return handler
      },
      apply(_target, _thisArg, args: (string | number)[] = []) {
        return p(resolveURL(url, ...args.map(i => `${i}`)))
      },
    })
  }

  return p(defaultOptions.baseURL || '/')
}
