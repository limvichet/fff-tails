
// server/api/loanrecords-need-approval.get.ts
import { getCookie, createError, type H3Event } from "h3"

type LoanRecord = {
  id: number
  loan_lastcash: string
  loan_newcash: string
  loan_totalcash: string
  cust_id: number
  loantype_id: number
  loan_status_id: number
  loan_check_status: number
}

type ApiResponse = {
  success: boolean
  data: LoanRecord,
  unread_count: number
}

// type ApiResponse = {
//   success: boolean
//   data: LoanRecordsResponses
// }

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse> => {
  const { apiBaseUrl } = useRuntimeConfig(event)
  const token = getCookie(event, "token")

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  try {
    // Call your Laravel API via proxy
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/loanrecords-need-approval`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    return res
    
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch loan records"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})