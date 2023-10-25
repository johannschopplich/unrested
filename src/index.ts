import { ofetch } from 'ofetch'
import { joinURL } from 'ufo'
import type { FetchOptions } from 'ofetch'
import type { ApiClient, ApiMethodHandler, ResponseType } from './types'
import { mergeFetchOptions } from './utils'

const payloadMethods = ['POST', 'PUT', 'DELETE', 'PATCH']

/**
 * Minimal, type-safe REST client using JS proxies
 */
export function createClient<R extends ResponseType = 'json'>(
  defaultOptions: Omit<FetchOptions<R>, 'method'> = {},
): ApiClient {
  // Callable internal target required to use `apply` on it
  const internalTarget = (() => {}) as ApiClient

  function p(url: string): ApiClient {
    return new Proxy(internalTarget, {
      get(_target, key: string) {
        const method = key.toUpperCase()

        if (!['GET', ...payloadMethods].includes(method))
          return p(joinURL(url, key))

        const handler: ApiMethodHandler = <T = any, R extends ResponseType = 'json'>(
          data?: any,
          opts: FetchOptions<R> = {},
        ) => {
          if (method === 'GET' && data)
            opts.query = data
          else if (payloadMethods.includes(method) && data)
            opts.body = data

          opts.method = method

          return ofetch<T, R>(
            url,
            mergeFetchOptions(opts, defaultOptions) as FetchOptions<R>,
          )
        }

        return handler
      },
      apply(_target, _thisArg, args: (string | number)[] = []) {
        return p(joinURL(url, ...args.map(String)))
      },
    })
  }

  return p(defaultOptions.baseURL || '/')
}

export type { ApiClient } from './types'
