/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchOptions } from "ohmyfetch";

export type FetchMethodHandler = <R = any>(
  data?: any,
  methodOpts?: FetchOptions
) => Promise<R>;

export type UnCreateClient = {
  (segment: string): UnCreateClient;
  [K: string]: UnCreateClient;
} & {
  get: FetchMethodHandler;
  post: FetchMethodHandler;
  put: FetchMethodHandler;
  delete: FetchMethodHandler;
  patch: FetchMethodHandler;
};
