/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchOptions } from "ohmyfetch";

interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
}

export type ResponseType = keyof ResponseMap | "json";

export type MappedType<
  R extends ResponseType,
  JsonType = any
> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType;

export type ApiFetchHandler = <T = any, R extends ResponseType = "json">(
  data?: RequestInit["body"] | Record<string, any>,
  opts?: FetchOptions<R>
) => Promise<MappedType<R, T>>;

export type ApiBuilder = {
  [K: string]: ApiBuilder;
  (...segmentsOrIds: (string | number)[]): ApiBuilder;
} & {
  get: ApiFetchHandler;
  post: ApiFetchHandler;
  put: ApiFetchHandler;
  delete: ApiFetchHandler;
  patch: ApiFetchHandler;
};
