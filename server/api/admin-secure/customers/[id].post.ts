import {
  getCookie,
  createError,
  readMultipartFormData,
  type H3Event,
} from "h3"

import type { Customer } from "~/types/customer"

export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  // 1️⃣ Get token
  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  // 2️⃣ Get customer ID from route params
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing customer ID",
    })
  }

  try {
    // 3️⃣ Read multipart form data (files + text)
    const formFields = await readMultipartFormData(event)
    if (!formFields) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      })
    }

    // 4️⃣ Convert multipart to browser FormData
    const formData = new FormData()
    for (const field of formFields) {
      if (!field.name) continue
      if (field.filename) {
        formData.append(
          field.name,
          new Blob([new Uint8Array(field.data)]),
          field.filename
        )
      } else {
        // Text fields
        formData.append(field.name, field.data.toString())
      }
    }

    // 5️⃣ Add `_method=PUT` so Laravel treats POST as PUT
    formData.append("_method", "PUT")

    // 5️⃣ Send PUT request to Laravel update endpoint
    const res = await $fetch<Customer>(`${apiBaseUrl}/api/admin-secure/customers/${id}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // ❌ DO NOT set Content-Type manually → browser sets multipart boundary automatically
      },
    })

    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to update customer"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})