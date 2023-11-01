/* eslint-disable test/prefer-lowercase-title */
import { afterAll, assertType, beforeAll, describe, expect, it } from 'vitest'
import { createApp, eventHandler, getQuery, getRequestHeaders, readBody, toNodeListener } from 'h3'
import { listen } from 'listhen'
import type { Listener } from 'listhen'
import { createClient } from '../src'
import type { ApiClient } from '../src'

// Test TypeScript generic
interface FooResponse {
  foo: string
}

describe('unrested', () => {
  let listener: Listener
  let client: ApiClient

  beforeAll(async () => {
    const app = createApp()
      .use('/foo/1', eventHandler(() => ({ foo: '1' })))
      .use('/foo', eventHandler(() => ({ foo: 'bar' })))
      .use('/bar', eventHandler(async event => ({
        url: event.path,
        body: await readBody(event),
        headers: getRequestHeaders(event),
        method: event.method,
      })))
      .use('/params', eventHandler(event => getQuery(event)))

    listener = await listen(toNodeListener(app))
    client = createClient({
      baseURL: listener.url,
      headers: {
        'X-Foo': 'bar',
      },
    })
  })

  afterAll(async () => {
    await listener.close()
  })

  it('GET request', async () => {
    const response = await client.foo.get()
    expect(response).toEqual({ foo: 'bar' })
  })

  it('POST request', async () => {
    const response = await client.bar.post({ foo: 'bar' })
    expect(response.body).toEqual({ foo: 'bar' })
    expect(response.method).toEqual('POST')
  })

  it('PUT request', async () => {
    const response = await client.bar.put({ foo: 'bar' })
    expect(response.body).toEqual({ foo: 'bar' })
    expect(response.method).toEqual('PUT')
  })

  it('DELETE request', async () => {
    const response = await client.bar.delete()
    expect(response.method).toEqual('DELETE')
  })

  it('PATCH request', async () => {
    const response = await client.bar.patch({ foo: 'bar' })
    expect(response.body).toEqual({ foo: 'bar' })
    expect(response.method).toEqual('PATCH')
  })

  it('query parameter', async () => {
    const response = await client.params.get({ test: 'true' })
    expect(response).toEqual({ test: 'true' })
  })

  it('default options', async () => {
    const { headers } = await client.bar.post(undefined, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect(headers).to.include({
      'x-foo': 'bar',
      'content-type': 'application/json',
    })
  })

  it('override default options', async () => {
    const { headers } = await client.bar.post(
      undefined,
      { headers: { 'X-Foo': 'baz' } },
    )
    expect(headers).to.include({ 'x-foo': 'baz' })
  })

  it('bracket syntax for path segment', async () => {
    const response = await client.foo['1'].get<FooResponse>()
    expect(response).toEqual({ foo: '1' })
    assertType<{ foo: string }>(response)
  })

  it('chain syntax for path segment', async () => {
    const response = await client.foo(1).get<FooResponse>()
    expect(response).toEqual({ foo: '1' })
    assertType<{ foo: string }>(response)
  })

  it('multiple path segments', async () => {
    const response = await client('foo', '1').get<FooResponse>()
    expect(response).toEqual({ foo: '1' })
    assertType<{ foo: string }>(response)
  })

  it('invalid api endpoint', () => {
    expect(async () => {
      await client.baz.get<FooResponse>()
    }).rejects.toThrow(/404/)
  })
})
