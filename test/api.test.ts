import { expect, test, beforeEach } from "vitest";
import { createApi } from "../src/index";
import type { FetchError } from "ohmyfetch";
import type { ApiBuilder } from "../src/index";

interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  // etc.
}

const API_BASE_URL = "https://jsonplaceholder.typicode.com";
let api: ApiBuilder;

beforeEach(() => {
  api = createApi(API_BASE_URL);
});

test("create api", async () => {
  expect(api).not.toBeNull();
});

test("GET request", async () => {
  const users = await api.users.get();
  expect(users).toMatchSnapshot();
});

test("POST request", async () => {
  const response = await api.users.post({ foo: "bar" });
  expect(response).toMatchSnapshot();
});

test("PUT request", async () => {
  const response = await api.users(1).put({ foo: "bar" });
  expect(response).toMatchSnapshot();
});

test("DELETE request", async () => {
  const response = await api.users(1).delete();
  expect(response).toMatchSnapshot();
});

test("PATCH request", async () => {
  const response = await api.users(1).patch({ foo: "bar" });
  expect(response).toMatchSnapshot();
});

test("query parameter", async () => {
  const user = await api.users.get({ userId: 1 });
  expect(user).toMatchSnapshot();
});

test("bracket syntax for path segment", async () => {
  const user = await api.users["1"].get<UserResponse>();
  expect(user).toMatchSnapshot();
});

test("chain syntax for path segment", async () => {
  const user = await api.users(1).get<UserResponse>();
  expect(user).toMatchSnapshot();
});

test("multiple path segments", async () => {
  const user = await api("users", "1").get<UserResponse>();
  expect(user).toMatchSnapshot();
});

test("invalid api endpoint", async () => {
  await api.foo.get().catch((e) => {
    expect((e as FetchError).message).toMatch(/404 Not Found/);
  });
});
