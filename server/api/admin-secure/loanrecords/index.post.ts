/* store */

import {
  getCookie,
  createError,
  readMultipartFormData,
  type H3Event,
} from "h3"

import type { Loanrecord } from "~/types/loanrecord"

export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
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

    // Convert multipart to browser Data
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
        formData.append(field.name, field.data.toString("utf-8"))
      }
    }

    const res = await $fetch<Loanrecord>(`${apiBaseUrl}/api/admin-secure/loanrecords`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    return res
  } catch (err: any) {

    console.log("ERROR FROM API:", err)  // 🔹 add this
    
    const message =
      err?.data?.message || err?.message || "Failed to create loanrecord"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
