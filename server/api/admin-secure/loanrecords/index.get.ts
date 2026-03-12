import { getCookie, getQuery, createError, type H3Event } from "h3"

type Currency = {
    id:          number;
    currency_en: string;
}

type Customer = {
    id:           number;
    cust_name_1:  string;
    cust_title_1: number;
    nametitle1:   Nametitle1;
}

type Nametitle1 = {
    id:           number;
    nametitle_kh: string;
}

type Loantype = {
    id:             number;
    loantype_short: string;
}

type Loarnrecord = {
    id:                number;
    loan_lastcash:     string;
    loan_newcash:      string;
    loan_totalcash:    string;
    cust_id:           number;
    loantype_id:       number;
    loan_status_id:    number;
    currency_id:       number;
    loan_check_status: number;
    customer:          Customer;
    currency:          Currency;
    loantype:          Loantype;
}

type LoarnrecordResponses = {
  current_page: number
  data: Loarnrecord[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: LoarnrecordResponses
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

  try {

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/loanrecords`, {
      method: "GET",
      query: {
        page: query.page || 1,
        param: query.param || undefined,
      },
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
