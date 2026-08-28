import { getCookie, getRouterParam, createError, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, "token")
  const pid = getRouterParam(event, "pid")

  if (!pid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing ID",
    })
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const url = `${config.apiBaseUrl}/admin-secure/payments/${pid}`

  try {
    if (event.node.req.method === "PUT") {
      const body = await readBody(event)

      return await $fetch(url, {
        method: "PUT",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    })
  } catch (err: any) {
    console.error(err)

    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.statusMessage || "Failed to process request",
      data: err?.data,
    })
  }
})