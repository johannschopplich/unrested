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

export type FetchMethodHandler = <R = any>(
  data?: any,
  methodOpts?: FetchOptions
) => Promise<R>;

export type ApiBuilder = {
  [K: string]: ApiBuilder;
  (...segmentsOrIds: (string | number)[]): ApiBuilder;
} & {
  get: FetchMethodHandler;
  post: FetchMethodHandler;
  put: FetchMethodHandler;
  delete: FetchMethodHandler;
  patch: FetchMethodHandler;
};
