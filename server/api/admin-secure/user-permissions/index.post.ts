/* ~/server/api/schedules.post.ts */

import { getCookie, createError, type H3Event, readBody, type EventHandler } from "h3"



const handler: EventHandler = async (event: H3Event) => {
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
    const body = await readBody(event)

    // ✅ Send POST request to Laravel
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/user-permissions`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    })

    return res
  } catch (err: any) {
    console.log("ERROR FROM API:", err)

    const message = err?.data?.message || err?.message || "Failed to create user permissions"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
}

export default handler