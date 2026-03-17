/* update */

import {
  getCookie,
  createError,
  readMultipartFormData,
  type H3Event,
} from "h3"

import type { Customer } from "~/types/customer"

export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing customer ID",
    })
  }

  try {

    const formFields = await readMultipartFormData(event)

    if (!formFields) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      })
    }

    // Convert multipart to browser FormData
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

    // Add `_method=PUT` so Laravel treats POST as PUT
    formData.append("_method", "PUT")

    // Send PUT request to Laravel update endpoint
    const res = await $fetch<Customer>(`${apiBaseUrl}/api/admin-secure/customers/${id}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // DO NOT set Content-Type manually → browser sets multipart boundary automatically
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