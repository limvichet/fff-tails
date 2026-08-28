import { getCookie, getRouterParam, createError, readBody } from "h3"

export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const token = getCookie(event, "token")
  const id = getRouterParam(event, "id")

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing product ID" })
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const url = `${config.apiBaseUrl}/admin-secure/user-permissions/${id}`
  const method = event.method


  try {

    // Show data
    if (method === "GET") {
      return await $fetch<any>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    //Update data
    if (method === "PUT") {
      const body = await readBody(event)
      return await $fetch(url, {
        method: "PUT",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
    }

    // Delete data
    if (method === "DELETE") {
      return await $fetch<void>(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
    }


    throw createError({ statusCode: 405, statusMessage: "Method not allowed" })
  } catch (err: any) {
    console.error(err)
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.statusMessage || "Failed to process request",
      data: err?.data,
    })
  }
})
