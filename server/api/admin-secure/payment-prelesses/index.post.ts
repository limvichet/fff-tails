/* ~/server/api/schedules.post.ts */

import { getCookie, createError, type H3Event, readBody } from "h3"

type Item = {
  schedule_id: number
  cash: number
  recipient: string
  note: string
}


export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  // ✅ Get token from cookie
  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  try {
    // ✅ Read JSON body
    const body = await readBody(event)
    if (!body || Object.keys(body).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request body",
      })
    }

    // ✅ Send POST request to Laravel
    const res = await $fetch<Item>(`${apiBaseUrl}/api/admin-secure/payment-prelesses`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        'cache-control': 'no-cache'   // ✅ prevent upstream cache
      },
    })

    setHeader(event, 'Cache-Control', 'no-store')
    return res
  } catch (err: any) {
    console.log("ERROR FROM API:", err)

    const message = err?.data?.message || err?.message || "Failed to create schedules"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})