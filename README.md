# unrested

> Minimal, type-safe REST client using JS proxies.

> [!NOTE]
> Thanks to everyone who has [upvoted this feature to be part of `ofetch`](https://github.com/unjs/ofetch/pull/69)! We closed the PR in favor of a separate upcoming package, [`api-party`](https://github.com/unjs/api-party).

## Features

- 🌁 Lightweight, only 36 loc
- 🦾 Strongly typed
- 📚 Supports chain and bracket syntax
  - `api.nested.users(1).get()`
  - or `api.nested.users["1"].get()`
- 🪵 Use other HTTP methods, like `.post()`

`unrested` uses [ofetch](https://github.com/unjs/ofetch) for data fetching under the hood. Thus, every option available for ofetch is usable with unrested as well!

## Installation

Run the following command to add `unrested` to your project.

```bash
# npm
npm install unrested

# pnpm
pnpm add unrested

# yarn
yarn add unrested
```

## Usage

```ts
import { createClient } from 'unrested'

// The base URL default is `/`
const api = createClient()
```

`unrested` inherits `ofetch`'s options. Refer to the [documentation for a complete list of options](https://github.com/unjs/ofetch).

```ts
import { createClient } from 'unrested'

// Set a custom base URL as needed
const api = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
})
```

### Path Segment Chaining

Chain single path segments or path IDs by a dot. You can type the response by passing a generic type to the method:

```ts
// GET request to <baseURL>/users
const response = await api.users.get<UserResponse>()
```

For `GET` request, the first parameter is used as query parameters:

```ts
// <baseURL>/users?search=john
const response = await api.users.get<UserResponse>({ search: 'john' })
```

For HTTP request methods supporting a payload, the first parameter is used as payload:

```ts
// POST request to <baseURL>/users
const response = await api.users.post({ name: 'foo' })
```

To include dynamic API path segments, you can choose between the chain syntax or the bracket syntax:

```ts
// Typed GET request to <baseURL>/users/1
const userId = 1
// … using the chain syntax:
const user = await api.users(userId).get<UserResponse>()
// … or the bracket syntax:
const user = await api.users[`${userId}`].get<UserResponse>()
```

### HTTP Request Methods

The following methods are supported as the last method in the chain:

- `get(<query>, <fetchOptions>)`
- `post(<payload>, <fetchOptions>)`
- `put(<payload>, <fetchOptions>)`
- `delete(<payload>, <fetchOptions>)`
- `patch(<payload>, <fetchOptions>)`

### Default Options for `ofetch`

```ts
import { createClient } from 'unrested'

const api = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  async onRequestError({ request, options, error }) {
    console.log('[fetch request error]', request, error)
  },
  async onResponseError({ request, options, error }) {
    console.log('[fetch response error]', request, error)
  },
})
```

### Override Default Options

Any fetch options on a method-level will override the default options:

```ts
const response = await api.users.get({
  headers: {
    'Cache-Control': 'no-cache',
  },
})
```

## Credits

- [Ilya Komsa](https://github.com/v1vendi) for his [REST API generator](https://gist.github.com/v1vendi/75d5e5dad7a2d1ef3fcb48234e4528cb).
- [David Wells](https://github.com/DavidWells) for his [GitHub API using proxies](https://gist.github.com/DavidWells/93535d7d6bec3a7219778ebcfa437df3).

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
