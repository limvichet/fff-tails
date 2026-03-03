import {
  readBody,
  getCookie,
  createError,
  type H3Event,
} from "h3"

import type { Customer } from "~/types/customer"

export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  // 1️⃣ Check token
  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  try {
    /**
     * If sending JSON → use readBody()
     * If sending FormData (with image) → DO NOT use readBody()
     * Instead forward raw request body
     */
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      })
    }

    // Convert multipart to FormData
    const data = new FormData()

    for (const field of formData) {
      if (!field.name) continue
      if (field.filename) {
        // file
        data.append(
          field.name,
          new Blob([new Uint8Array(field.data)]),
          field.filename
        )
      } else {
        // text
        data.append(field.name, field.data.toString())
      }
    }

    const res = await $fetch<Customer>(`${apiBaseUrl}/api/admin-secure/customers`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // ❗ DO NOT set Content-Type manually when using FormData
      },
    })

    return res
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to create customer"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
