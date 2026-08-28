import { getCookie, getQuery, createError } from "h3"

type ApiResponse = {
  success: boolean
  count: number
  data: DataResponses[]
}

type DataResponses = {
  id: number
  cust_name_1: string
  currency_en: string
  schedule_principle_date: string
  schedule_principle: number
  schedule_lessmoney: number
  schedule_note: number
}

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const query = getQuery(event)

  const loan_startdate = query.loan_startdate as string
  const loan_enddate = query.loan_enddate as string
  const loan_status_id = query.loan_status_id as string | undefined
  const loantype_id = query.loantype_id as string | undefined

  // Required validation
  if (!loan_startdate || !loan_enddate) {
    throw createError({
      statusCode: 400,
      statusMessage: "loan_startdate and loan_enddate are required",
    })
  }

  try {
    const res = await $fetch<ApiResponse>(
      `${apiBaseUrl}/admin-secure/reports-debt`,
      {
        method: "GET",
        query: {
          loan_startdate,
          loan_enddate,
          ...(loan_status_id && { loan_status_id }),
          ...(loantype_id && { loantype_id }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return res
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to fetch report"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})