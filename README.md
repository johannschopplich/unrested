# UnCreate

> Minimal, type-safe REST client using JS proxies.

```ts
import { createApi } from "uncreate";

const api = createApi<"users">("https://jsonplaceholder.typicode.com");

// `get` request to https://jsonplaceholder.typicode.com/users
const allUsers = await api.users();

// `get` request to https://jsonplaceholder.typicode.com/users/1
const singeUser = await api.users<UserResponse>(1);
```

`uncreate` uses [ohmyfetch](https://github.com/unjs/ohmyfetch) for data fetching under the hood. Thus, every option available for ohmyfetch is usable with uncreate as well!

## Installation

Run the following command to add `uncreate` to your project.

```bash
pnpm install uncreate -D # or npm or yarn
```

## Configuration

```ts
import { createApi } from "uncreate";

const api = createApi("<baseUrl>", {
  // Complete list of options: https://github.com/unjs/ohmyfetch
  async onRequestError({ request, options, error }) {
    console.log("[fetch request error]", request, error);
  },
  async onResponseError({ request, options, error }) {
    console.log("[fetch response error]", request, error);
  },
});
```

## License

[MIT](./LICENSE) License © 2022 [Johann Schopplich](https://github.com/johannschopplich)
