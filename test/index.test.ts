import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, eventHandler, readBody, toNodeListener } from 'h3'
import { type Listener, listen } from 'listhen'
import { getQuery } from 'ufo'
import { type ClientBuilder, createClient } from '../src'

// Test TypeScript support
interface GenericGetResponse {
  foo: string
}

describe('uncreate', () => {
  let listener: Listener
  let client: ClientBuilder

  beforeEach(async () => {
    const app = createApp()
      .use('/foo/1', eventHandler(() => ({ foo: '1' })))
      .use('/foo', eventHandler(() => ({ foo: 'bar' })))
      .use('/bar', eventHandler(async event => ({
        url: event.node.req.url,
        body: await readBody(event),
        headers: event.node.req.headers,
        method: event.node.req.method,
      })))
      .use('/params', eventHandler(event => getQuery(event.node.req.url || '')))

    listener = await listen(toNodeListener(app))
    client = createClient({
      baseURL: listener.url,
      headers: {
        'X-Foo': 'bar',
      },
    })
  })

  afterEach(async () => {
    await listener.close()
  })

  it('GET request', async () => {
    const response = await client.foo.get()
    expect(response).to.deep.equal({ foo: 'bar' })
  })

  it('POST request', async () => {
    const response = await client.bar.post({ foo: 'bar' })
    expect(response.body).to.deep.equal({ foo: 'bar' })
    expect(response.method).to.equal('POST')
  })

  it('PUT request', async () => {
    const response = await client.bar.put({ foo: 'bar' })
    expect(response.body).to.deep.equal({ foo: 'bar' })
    expect(response.method).to.equal('PUT')
  })

  it('DELETE request', async () => {
    const response = await client.bar.delete()
    expect(response.method).to.equal('DELETE')
  })

  it('PATCH request', async () => {
    const response = await client.bar.patch({ foo: 'bar' })
    expect(response.body).to.deep.equal({ foo: 'bar' })
    expect(response.method).to.equal('PATCH')
  })

  it('query parameter', async () => {
    const response = await client.params.get({ test: 'true' })
    expect(response).to.deep.equal({ test: 'true' })
  })

  it('default options', async () => {
    const { headers } = await client.bar.post()
    expect(headers).to.include({ 'x-foo': 'bar' })
  })

  it('override default options', async () => {
    const { headers } = await client.bar.post(
      {},
      { headers: { 'X-Foo': 'baz' } },
    )
    expect(headers).to.include({ 'x-foo': 'baz' })
  })

  it('bracket syntax for path segment', async () => {
    const response = await client.foo['1'].get<GenericGetResponse>()
    expect(response).to.deep.equal({ foo: '1' })
  })

  it('chain syntax for path segment', async () => {
    const response = await client.foo(1).get<GenericGetResponse>()
    expect(response).to.deep.equal({ foo: '1' })
  })

  it('multiple path segments', async () => {
    const response = await client('foo', '1').get<GenericGetResponse>()
    expect(response).to.deep.equal({ foo: '1' })
  })

  it('invalid api endpoint', async () => {
    async function invalidHandle() {
      await client.baz.get<GenericGetResponse>()
    }

    expect(invalidHandle()).rejects.toThrow(/404/)
  })
})
