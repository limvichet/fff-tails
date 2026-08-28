import { getCookie, getRouterParam, createError, readBody } from "h3"
import type { Customer } from "~/types/customer"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, "token")
  const id = getRouterParam(event, "id")

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing data id" })
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const url = `${config.apiBaseUrl}/admin-secure/employees/${id}`
  const method = event.method


  try {

    // Show data
    if (method === "GET") {
      return await $fetch<Customer>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    // Update data
    // if (method === "PUT") {
    //   const body = await readBody(event)
    //   return await $fetch(url, {
    //     method: "PUT",
    //     body,
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    // }

    // Delete data
    if (method === "DELETE") {
      return await $fetch(url, {
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
