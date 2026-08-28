/* update */

import {
  getCookie,
  createError,
  readBody,
  type H3Event,
} from "h3"

import type { Loanrecord } from "~/types/loanrecord"

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

  // 2️⃣ Get ID
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing record ID",
    })
  }

  try {
    // 3️⃣ Read request body
    const body = await readBody(event)

    // 4️⃣ Forward request to Laravel
    const res = await $fetch<Loanrecord>(
      `${apiBaseUrl}/admin-secure/loanrecords/${id}`,
      {
        method: "PUT",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return res
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to update loan record"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})