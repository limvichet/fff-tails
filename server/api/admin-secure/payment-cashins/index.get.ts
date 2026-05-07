import { getCookie, getQuery, createError, type H3Event } from "h3"
import { st } from "vue-router/dist/router-CWoNjPRp.mjs"
type ApiResponse = {
  success: boolean
  data: PaymentCahinResponses
}


type PaymentCahinResponses = {
  schedule: {
    id: number
    loan_id: number
    schedule_principle_date: string
    schedule_paymentnumber: number
    schedule_interest_rate: number
    schedule_interest: number
    schedule_outstanding: number
    schedule_over_draft: number
    schedule_principle: number
    schedule_totalpay: number
  }
  cashin: {
    id: number
    schedule_id: number
    cashin_number: number
    cash: number
    recipient: string
    note: string
    invoice_id: number
    created_by: number
    updated_by: number
    created_at: string
    updated_at: string
  }
}


export default defineEventHandler(async (event: H3Event): Promise<ApiResponse> => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  // Get query params (?page=1&keyword=abc)
  const query = getQuery(event)

  const param =
    typeof query.param === "string" && query.param.trim()
      ? query.param
      : ""

  try {

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/payment-cashins?param=${param}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch customers"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
