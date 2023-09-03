import type { FetchOptions } from 'ofetch'

export interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
}

export type ResponseType = keyof ResponseMap | 'json'
export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType

export type ApiMethodHandler = <T = any, R extends ResponseType = 'json'>(
  data?: RequestInit['body'] | Record<string, any>,
  opts?: Omit<FetchOptions<R>, 'baseURL' | 'method'>
) => Promise<MappedType<R, T>>

export type ApiBuilder = {
  [key: string]: ApiBuilder
  (...segmentsOrIds: (string | number)[]): ApiBuilder
} & {
  get: ApiMethodHandler
  post: ApiMethodHandler
  put: ApiMethodHandler
  delete: ApiMethodHandler
  patch: ApiMethodHandler
}
