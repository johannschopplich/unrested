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

export type ApiMethodHandler<Data = never> = <
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
  get: ApiMethodHandler<FetchOptions['query']>
  post: ApiMethodHandler<FetchOptions['body']>
  put: ApiMethodHandler<FetchOptions['body']>
  delete: ApiMethodHandler<FetchOptions['body']>
  patch: ApiMethodHandler<FetchOptions['body']>
}
