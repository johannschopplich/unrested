import type { FetchOptions } from 'ofetch'

export interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
}

export type ResponseType = keyof ResponseMap | 'json'
export type MappedResponseType<
  R extends ResponseType,
  JsonType = any,
> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType

export type $Fetch<Data = unknown> = <
  T = any,
  R extends ResponseType = 'json',
>(
  data?: Data,
  opts?: Omit<FetchOptions<R>, 'baseURL' | 'method'>,
) => Promise<MappedResponseType<R, T>>

export type ApiClient = {
  [key: string]: ApiClient
  (...args: (string | number)[]): ApiClient
} & {
  get: $Fetch<FetchOptions['query']>
  post: $Fetch<FetchOptions['body']>
  put: $Fetch<FetchOptions['body']>
  delete: $Fetch<FetchOptions['body']>
  patch: $Fetch<FetchOptions['body']>
}
