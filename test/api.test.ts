import { expect, test } from "vitest";
import { createApi } from "../src/index";
import type { FetchError } from "ohmyfetch";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

interface ApiUserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  // etc.
}

test("create api and fetch data", async () => {
  const api = createApi(API_BASE_URL);

  // `get` request to https://jsonplaceholder.typicode.com/users
  const allUsers = await api.users.get();
  expect(allUsers).toMatchSnapshot();
});

test("bracket syntax for path segment", async () => {
  // `get` request to https://jsonplaceholder.typicode.com/users/1
  const api = createApi(API_BASE_URL);
  const singeUser = await api.users["1"].get<ApiUserResponse>();
  expect(singeUser).toMatchSnapshot();
});

test("chain syntax for path segment", async () => {
  // `get` request to https://jsonplaceholder.typicode.com/users/1
  const api = createApi(API_BASE_URL);
  const singeUser = await api.users(1).get<ApiUserResponse>();
  expect(singeUser).toMatchSnapshot();
});

test("multiple path segments in one call", async () => {
  const api = createApi(API_BASE_URL);
  const singeUser = await api("users", "1").get<ApiUserResponse>();
  expect(singeUser).toMatchSnapshot();
});

test("invalid api endpoint", async () => {
  const api = createApi(API_BASE_URL);

  await api.foo.get().catch((e) => {
    expect((e as FetchError).message).toMatch(/404 Not Found/);
  });
});
