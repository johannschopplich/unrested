import { expect, test } from "vitest";
import { createApi } from "../src/index";
import { FetchError } from "ohmyfetch";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

enum ApiEndpoints {
  Users = "users",
  Posts = "posts",
}

interface ApiUserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  // etc.
}

test("create api and fetch data", async () => {
  const api = createApi<ApiEndpoints>(API_BASE_URL);

  // `get` request to https://jsonplaceholder.typicode.com/users
  const allUsers = await api.users();
  expect(allUsers).toMatchSnapshot();

  // `get` request to https://jsonplaceholder.typicode.com/users/1
  const singeUser = await api.users<ApiUserResponse>(1);
  expect(singeUser).toMatchSnapshot();
});

test("invalid base url", async () => {
  const api = createApi("");

  await api.foo().catch((e) => {
    expect((e as FetchError).message).toMatch(/Invalid URL/);
  });
});

test("invalid api endpoint", async () => {
  const api = createApi(API_BASE_URL);

  await api.foo().catch((e) => {
    expect((e as FetchError).message).toMatch(/404 Not Found/);
  });
});
