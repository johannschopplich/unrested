# Uncreate

> Minimal, type-safe REST client using JS proxies.

```ts
const api = createApi<"users">("https://jsonplaceholder.typicode.com");

// `get` request to https://jsonplaceholder.typicode.com/users
const allUsers = await api.users();

// `get` request to https://jsonplaceholder.typicode.com/users/1
const singeUser = await api.users<{ name: string }>(1);
```

## License

[MIT](./LICENSE) License © 2022 [Johann Schopplich](https://github.com/johannschopplich)
