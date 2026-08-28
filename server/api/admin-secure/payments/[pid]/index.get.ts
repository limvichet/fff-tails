// show
export interface ApiResponse {
    success:    boolean;
    loanrecord: Loanrecord;
    customer: Customer;
    schedules:  Schedule[];
}

export interface Customer {
    id:         number;
    cust_name_1:       string;
    cust_name_2:      string;
}

export interface Loanrecord {
    id:                           number;
    cust_id:                      number;
    loan_lastcash:                number;
    loan_newcash:                 number;
    loan_totalcash:               number;
    currency_id:                  number;
    source_money:                 string;
    loantype_id:                  number;
    loan_over_draft:              number;
    payback_id:                   number;
    loan_peroid:                  number;
    loan_startdate:               string;
    loan_first_paid_date:         string;
    loan_enddate:                 string;
    loan_startdate_principle:     string;
    loan_interest_rate:           number;
    loan_principle:               number;
    loan_collateral_1:            string;
    loan_collateral_map_link_1:   string;
    loan_collateral_doc_1:        string;
    loan_collateral_2:            string;
    loan_collateral_map_link_2:   string;
    loan_collateral_doc_2:        string;
    loan_note:                    string;
    cust_comission_id:            number;
    cust_comission_interest_rate: number;
    cust_loangroup_id:            number;
    cust_guarantor_id:            number;
    cust_position_loangroup_id:   number;
    invoice_id:                   number;
    loan_status_id:               number;
    created_by:                   number;
    updated_by:                   number;
    active:                       number;
    created_at:                   string;
    updated_at:                   string;
    loan_check_status:            number;
    loan_check_approver:          number;
    loan_check_date:              string;
}

export interface Schedule {
    id:                     number;
    schedule_paymentnumber: number;
    loan_id:                number;
    schedule_startdate:     string;
    schedule_enddate:       string;
    ForMonth:               string;
    schedule_outstanding:   number;
    schedule_principle:     number;
    schedule_interest_rate: number;
    schedule_interest:      number;
    schedule_totalpay:      number;
    schedule_totalcashin:   number;
    schedule_paidcash:      number;
    schedule_balance:       number;
    schedule_lessmoney:     number;
    schedule_remaincash:    number;
    schedule_totalpreless:  number;
    invoice_id:             number;
    invoice:                string;
    schedule_note:          string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, "token")
  const pid = getRouterParam(event, "pid")

  if (!pid) throw createError({ statusCode: 400, statusMessage: "Missing ID" })
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const url = `${config.apiBaseUrl}/admin-secure/payments/${pid}`
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
