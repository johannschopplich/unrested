import type { FetchOptions } from 'ofetch'

export interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
}

export type ResponseType = keyof ResponseMap | 'json'
export type MappedType<
  R extends ResponseType,
  JsonType = any,
> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType

export type ApiClientFetcher<Data = never> = <
  T = any,
  R extends ResponseType = 'json',
>(
  data?: Data,
  opts?: Omit<FetchOptions<R>, 'baseURL' | 'method'>,
) => Promise<MappedType<R, T>>

export type ApiClient = {
  [key: string]: ApiClient
  (...args: (string | number)[]): ApiClient
} & {
  get: ApiClientFetcher<FetchOptions['query']>
  post: ApiClientFetcher<FetchOptions['body']>
  put: ApiClientFetcher<FetchOptions['body']>
  delete: ApiClientFetcher<FetchOptions['body']>
  patch: ApiClientFetcher<FetchOptions['body']>
}
