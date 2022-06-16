export function headersToObject(headers: HeadersInit = {}): Record<string, string> {
  if (Array.isArray(headers))
    return Object.fromEntries(headers)

  return Object.fromEntries([...Object.entries(headers)])
}
