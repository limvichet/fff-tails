import {
  readBody,
  getCookie,
  createError,
  type H3Event,
} from "h3"

import type { Loanrecord } from "~/types/loanrecord"

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

    const body = await readBody(event)

    // ✅ DEBUG HERE
    console.log("BODY FROM FRONTEND:", body)

    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      })
    }



    const res = await $fetch<Loanrecord>(`${apiBaseUrl}/api/admin-secure/loanrecords`, {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${token}` },
    })

    return res
  } catch (err: any) {

    console.log("ERROR FROM API:", err)  // 🔹 add this
    
    const message =
      err?.data?.message || err?.message || "Failed to create customer"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
