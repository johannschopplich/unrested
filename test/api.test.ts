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

test("create api", async () => {
  const api = createApi(API_BASE_URL);
  expect(api).not.toBeNull();
});

test("GET request", async () => {
  const api = createApi(API_BASE_URL);
  const users = await api.users.get();
  expect(users).toMatchSnapshot();
});

test("POST request", async () => {
  const api = createApi(API_BASE_URL);
  const response = await api.users.post({ foo: "bar" });
  expect(response).toMatchSnapshot();
});

test("query parameter", async () => {
  const api = createApi(API_BASE_URL);
  const user = await api.users.get({ userId: 1 });
  expect(user).toMatchSnapshot();
});

test("bracket syntax for path segment", async () => {
  const api = createApi(API_BASE_URL);
  const user = await api.users["1"].get<ApiUserResponse>();
  expect(user).toMatchSnapshot();
});

test("chain syntax for path segment", async () => {
  const api = createApi(API_BASE_URL);
  const user = await api.users(1).get<ApiUserResponse>();
  expect(user).toMatchSnapshot();
});

test("multiple path segments", async () => {
  const api = createApi(API_BASE_URL);
  const user = await api("users", "1").get<ApiUserResponse>();
  expect(user).toMatchSnapshot();
});

test("invalid api endpoint", async () => {
  const api = createApi(API_BASE_URL);

  await api.foo.get().catch((e) => {
    expect((e as FetchError).message).toMatch(/404 Not Found/);
  });
});
