/* store */

import {
  getCookie,
  createError,
  readMultipartFormData,
  type H3Event,
} from "h3"


type Data = {
    id:           number;
    nametitle_kh: string;
    nametitle_en: string;
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

    const res = await $fetch<Data>(`${apiBaseUrl}/admin-secure/sys-titles`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    return res
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to create sys title"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
