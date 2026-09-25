import type { H3Event } from 'h3'

/**
 * Nitro-as-BFF: every server/api/* route proxies to the real Laravel API
 * (server-to-server, no CORS) instead of the browser calling Laravel
 * directly. The Sanctum bearer token lives only in this httpOnly cookie —
 * client JS never sees it — see the wiring plan's "Nitro-as-BFF" section.
 */
const TOKEN_COOKIE = 'fp_token'

export function getAuthToken(event: H3Event): string | undefined {
  return getCookie(event, TOKEN_COOKIE)
}

export function setAuthToken(event: H3Event, token: string): void {
  setCookie(event, TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearAuthToken(event: H3Event): void {
  deleteCookie(event, TOKEN_COOKIE, { path: '/' })
}

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, unknown>
  /** Set false for routes that must never send the caller's token (there are none today, but keeps intent explicit). */
  auth?: boolean
}

/**
 * Calls the Laravel API from server-side code. Laravel's own error shape
 * (`{message, errors}`) is preserved on `data` so a catch block can surface
 * field-level validation errors exactly as Laravel sent them.
 */
export async function callApi<T>(event: H3Event, path: string, options: ApiCallOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const token = options.auth !== false ? getAuthToken(event) : undefined

  try {
    const response = await $fetch(path, {
      baseURL: `${config.apiBaseUrl}/api/v1`,
      method: options.method ?? 'GET',
      body: options.body as BodyInit | Record<string, unknown> | null | undefined,
      query: options.query,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return response as T
  }
  catch (error) {
    const fetchError = error as { response?: { status?: number, _data?: { message?: string } } }

    throw createError({
      statusCode: fetchError.response?.status ?? 500,
      statusMessage: fetchError.response?._data?.message ?? 'Something went wrong.',
      data: fetchError.response?._data,
    })
  }
}
