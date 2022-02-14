import { expect, test } from "vitest";
import { createApi } from "../src/index";

const JSON_PLACEHOLDER_API_URL = "https://jsonplaceholder.typicode.com";

interface JSONPlaceholderUserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  // and so on…
}

test("create api and fetch data", async () => {
  const api = createApi<"users">(JSON_PLACEHOLDER_API_URL);

  // `get` request to https://jsonplaceholder.typicode.com/users
  const allUsers = await api.users();
  expect(allUsers).toMatchSnapshot();

  // `get` request to https://jsonplaceholder.typicode.com/users/1
  const singeUser = await api.users<JSONPlaceholderUserResponse>(1);
  expect(singeUser).toMatchSnapshot();
});
