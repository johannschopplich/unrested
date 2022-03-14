/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchOptions } from "ohmyfetch";

interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
}

export type ResponseType = keyof ResponseMap | "json";

export type ApiFetchHandler = <R = any>(
  data?: Record<string, any>,
  opts?: FetchOptions
) => Promise<R>;

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
