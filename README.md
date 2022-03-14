# uncreate

> Minimal, type-safe REST client using JS proxies.

## Features

- 🌁 Lightweight, only 36 loc
- 🦾 Strongly typed
- 🪵 Use HTTP methods like `GET`

`uncreate` uses [ohmyfetch](https://github.com/unjs/ohmyfetch) for data fetching under the hood. Thus, every option available for ohmyfetch is usable with uncreate as well!

## Example

```ts
import { createApi } from "uncreate";

const api = createApi("https://jsonplaceholder.typicode.com");

// `GET` request to https://jsonplaceholder.typicode.com/users
const allUsers = await api.users.get();

// Typed `GET` request to https://jsonplaceholder.typicode.com/users/1
const userId = 1;
// … using the chain syntax:
const singeUser = await api.users(1).get<ApiUserResponse>();
// … or the bracket syntax:
const singeUser = await api.users[`${userId}`].get<ApiUserResponse>();
```

## Installation

Run the following command to add `uncreate` to your project.

```bash
pnpm install uncreate # or npm or yarn
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

## Credits

- [Ilya Komsa](https://github.com/v1vendi) for his [REST API generator](https://gist.github.com/v1vendi/75d5e5dad7a2d1ef3fcb48234e4528cb).
- [David Wells](https://github.com/DavidWells) for his [GitHub API using proxies](https://gist.github.com/DavidWells/93535d7d6bec3a7219778ebcfa437df3).

## License

[MIT](./LICENSE) License © 2022 [Johann Schopplich](https://github.com/johannschopplich)
