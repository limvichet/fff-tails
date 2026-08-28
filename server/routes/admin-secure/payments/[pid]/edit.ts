// show
export interface ApiResponse {
    success:    boolean
    data: {
      invoice_id: number
      schedule_next_paynumber: number
      invoice_number: string
      loantype_id: number
      loantype: string
      od_loan_totalcash: number
      previous_outstanding: number
      loan_status: number
      last_loan_status: string
      schedules: Schedule
    }
}

export interface Schedule {
    id:                         number
    loan_id:                    number
    schedule_startdate:         string
    schedule_enddate:           string
    schedule_totaldays:         number
    schedule_principle_date:    string
    schedule_paymentnumber:     number
    schedule_outstanding:       number
    schedule_over_draft:        number
    schedule_principle:         number
    schedule_interest_rate:     number
    schedule_interest:          number
    schedule_totalpay:          number
    schedule_paidcash:          number
    schedule_note:              string
    schedule_cashin_1:          number
    schedule_cashin_2:          number
    schedule_cashin_3:          number
    schedule_totalcashin:       number
    schedule_remaincash:        number
    schedule_preless_1:         number
    schedule_preless_2:         number
    schedule_preless_3:         number
    schedule_totalpreless:      number
    schedule_lessmoney:         number
    schedule_principle_payment: number
    cheque_number:              string
    invoice_id:                 number
    created_by:                 number
    updated_by:                 number
    active:                     number
    created_at:                 string
    updated_at:                 string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, "token")
  const pid = getRouterParam(event, "pid")

  if (!pid) throw createError({ statusCode: 400, statusMessage: "Missing ID" })
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const url = `${config.apiBaseUrl}/admin-secure/payments/${pid}/edit`
  const method = event.method


  try {

    // Show
    if (method === "GET") {
      return await $fetch<ApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
    }


    throw createError({ statusCode: 405, statusMessage: "Method not allowed" })
  } catch (err: any) {
    console.error(err)
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.statusMessage || "Failed to process request",
      data: err?.data,
    })
  }
})
