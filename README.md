# uncreate

> Minimal, type-safe REST client using JS proxies.

## Features

- 🌁 Lightweight, only 36 loc
- 🦾 Strongly typed
- 📚 Supports chain and bracket syntax
  - `api.nested.users(1).get()`
  - or `api.nested.users["1"].get()`
- 🪵 Use other HTTP methods, like `.post()`

`uncreate` uses [ohmyfetch](https://github.com/unjs/ohmyfetch) for data fetching under the hood. Thus, every option available for ohmyfetch is usable with uncreate as well!

## Installation

Run the following command to add `uncreate` to your project.

```bash
pnpm install uncreate # or npm or yarn
```

## Usage

```ts
import { createClient } from "uncreate";

const api = createClient("<baseURL>");
```

### Path Segment Chaining

Chain single path segments or path ids by a dot. You can even type the response of your request!

```ts
// GET request to <baseURL>/users
const users = await api.users.get<UserResponse>();

// For GET request you can add search params
// <baseURL>/users?search=john
const users = await api.users.get<UserResponse>({ search: "john" });
```

To include dynamic API path segments, you have two options:

```ts
// Typed GET request to <baseURL>/users/1
const userId = 1;
// … using the chain syntax:
const user = await api.users(userId).get<UserResponse>();
// … or the bracket syntax:
const user = await api.users[`${userId}`].get<UserResponse>();
```

### HTTP Request Methods

Add the appropriate method to the end of your API call. The following methods are supported:

- `get()`
- `post()`
- `put()`
- `delete()`
- `patch()`

### Payload Requests

For HTTP request methods supporting a payload, add it to the method call:

```ts
// POST request to <baseURL>/users
const response = await api.users.post({ name: "foo" });
```

### Default Options For `$fetch`

```ts
import { createClient } from "uncreate";

const api = createClient("<baseUrl>", {
  // Complete list of options: https://github.com/unjs/ohmyfetch
  async onRequestError({ request, options, error }) {
    console.log("[fetch request error]", request, error);
  },
  async onResponseError({ request, options, error }) {
    console.log("[fetch response error]", request, error);
  },
});
```

### Override Default Options

You can add/overwrite `$fetch` options on a method-level:

```ts
const response = await api.users.get({
  headers: {
    "Cache-Control": "no-cache",
  },
});
```

## Credits

- [Ilya Komsa](https://github.com/v1vendi) for his [REST API generator](https://gist.github.com/v1vendi/75d5e5dad7a2d1ef3fcb48234e4528cb).
- [David Wells](https://github.com/DavidWells) for his [GitHub API using proxies](https://gist.github.com/DavidWells/93535d7d6bec3a7219778ebcfa437df3).

## License

[MIT](./LICENSE) License © 2022 [Johann Schopplich](https://github.com/johannschopplich)
