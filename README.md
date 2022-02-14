# Uncreate

> Minimal, type-safe REST client using JS proxies.

```ts
const api = createApi<"users">("https://jsonplaceholder.typicode.com");

// `get` request to https://jsonplaceholder.typicode.com/users
const allUsers = await api.users();

// `get` request to https://jsonplaceholder.typicode.com/users/1
const singeUser = await api.users<UserResponse>(1);
```

## Installation

Run the following command to add `uncreate` to your project.

```bash
pnpm install uncreate -D # or npm or yarn
```

## License

[MIT](./LICENSE) License © 2022 [Johann Schopplich](https://github.com/johannschopplich)
