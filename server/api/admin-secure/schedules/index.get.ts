import { getCookie, getQuery, createError, type H3Event } from "h3"

type Schedule = {
    id:                     number;
    loan_id:                number;
    loan_startdate:     string;
    loan_enddate:       string;
    currency_en:            string;
    loan_totalcash:         string;
    loan_peroid:            string;
    loan_check_status:      number;
    cust_name_1:            string;
    cust_name_2:            string;
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
}

type ScheduleResponses = {
  current_page: number
  data: Schedule[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: ScheduleResponses
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
      : ""

  try {

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/admin-secure/schedules?page=${page}&param=${param}`, {
      method: "GET",
      // query: {
      //   page: query.page || 1,
      //   param: query.param || undefined,
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
