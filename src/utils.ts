import type { FetchOptions } from 'ofetch'

export function mergeFetchOptions(
  input?: FetchOptions,
  defaults?: FetchOptions,
): FetchOptions {
  const merged: FetchOptions = {
    ...defaults,
    ...input,
  }

  // Merge params and query
  if (defaults?.params && input?.params) {
    merged.params = {
      ...defaults?.params,
      ...input?.params,
    }
  }
  if (defaults?.query && input?.query) {
    merged.query = {
      ...defaults?.query,
      ...input?.query,
    }
  }

  // Merge headers
  if (defaults?.headers && input?.headers) {
    merged.headers = new Headers(defaults?.headers || {})
    for (const [key, value] of new Headers(input?.headers || {}))
      merged.headers.set(key, value)
  }

  return merged
}
