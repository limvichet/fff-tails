/* update */

import {
  getCookie,
  createError,
  readMultipartFormData,
  type H3Event,
} from "h3"

type Data = {
    id:           number;
    loantype_kh: string;
    loantype_en: string;
    loantype_detail: string;
    loantype_short: string;
    loantype_shortcut: string;
    active: number | string;
    created_by: number;
    created_at: string;
    updated_by: string;
    updated_at: string;
}

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
      statusMessage: "Missing record id",
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
    const res = await $fetch<Data>(`${apiBaseUrl}/api/admin-secure/sys-loantypes/${id}`, {
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
    const message = err?.data?.message || err?.message || "Failed to update system loantypes"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})