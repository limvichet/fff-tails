import { getCookie, getQuery, createError, type H3Event } from "h3"

type ApiResponse = {
  success: boolean
  data: PaymentResponses
}
type PaymentResponses = {
  current_page: number
  data: Schedule[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any
}

type Schedule = {
    loan_id: number;
    loan_startdate: string
    loan_enddate: string
    currency_en: string
    loan_totalcash: string
    loan_interest_rate: number
    loan_peroid: string
    loantype_short: string
    loan_check_status: string
    cust_name_1: string
    cust_name_2?: string
    loan_tag?: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    latest_schedule_paid_date: string
    next_outstanding_date: string
    latest_schedule_outstanding: number
    payment_status: number
    schedule_principle_payment_tt: string;
    schedule_principle_tt: string;
    schedule_totalpay_tt: string;
    schedule_totalcashin_tt: string;
    schedule_lessmoney_tt: string;
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

  const page =
    query.page && !isNaN(Number(query.page))
      ? Number(query.page)
      : 1

  const param =
    typeof query.param === "string" && query.param.trim()
      ? query.param
      : undefined

  // Payment status: 0 = Finished, 1 = Active, undefined = All Status
  const paymentStatus =
    query.payment_status === "0" || query.payment_status === "1"
      ? query.payment_status
      : undefined


  // Sorting parameters
  const sortBy =
    typeof query.sort_by === "string" && query.sort_by.trim()
      ? query.sort_by
      : "loan_id"

  const sortDirection =
    query.sort_direction === "asc" || query.sort_direction === "desc"
      ? query.sort_direction
      : "desc"

  try {

    // const res = await $fetch<ApiResponse>(`${apiBaseUrl}/admin-secure/payments?page=${page}&param=${param}&payment_status=${paymentStatus}`, {
    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/admin-secure/payments?page=${page}${param ? `&param=${encodeURIComponent(param)}` : ''}${paymentStatus !== undefined ? `&payment_status=${paymentStatus}` : ''}${sortBy ? `&sort_by=${encodeURIComponent(sortBy)}` : ''}${sortDirection ? `&sort_direction=${encodeURIComponent(sortDirection)}` : ''}`, {  
    method: "GET",
      // query: {
      //   page: query.page || 1,
      //   param: query.param || undefined,
      //   payment_status: paymentStatus || undefined,
      // },
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
