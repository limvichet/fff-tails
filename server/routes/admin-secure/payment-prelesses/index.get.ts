import { getCookie, getQuery, createError, type H3Event } from "h3"
import { st } from "vue-router/dist/router-CWoNjPRp.mjs"
type ApiResponse = {
  success: boolean
  data: PaymentPrelessResponses
}


type PaymentPrelessResponses = {
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
    loantype_id: number
    schedule_next_paynumber: number
    loan_status: number
    last_loan_status: string
  }
  preless: {
    id: number
    schedule_id: number
    preless_number: number
    cash: number
    recipient: string
    note: string
    invoice_id: number
    created_at: string
    created_by: number
    createdby: Createdby
    invoice: Invoice
  }
}

type Createdby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Employee = {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
}

type Invoice = {
  id: number
  invoice_type: string
  invoice_number: string
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

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/admin-secure/payment-prelesses?param=${param}`, {
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
