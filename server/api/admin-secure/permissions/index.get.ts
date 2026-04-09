import { getCookie, getQuery, createError, type H3Event } from "h3"

type Permission = {
    id:    number;
    name:  string;
    slug:  string;
    active:  string;
}

type PermissionResponses = {
  current_page: number
  data: Permission[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: PermissionResponses
}

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse> => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  // Get query params (?page=1&keyword=abc)
  const query = getQuery(event)

  try {

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/permissions`, {
      method: "GET",
      query: {
        page: query.page || 1,
        param: query.param || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch customers"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
