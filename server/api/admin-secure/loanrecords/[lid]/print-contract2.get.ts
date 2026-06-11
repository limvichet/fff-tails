import { getCookie, createError, type H3Event } from "h3"

type ApiResponse = {
  success: boolean
  data: PrintContract2
}
type PrintContract2 = {
    invoice: Invoice
    capital: Capital
    loanrecord: Loanrecord
    schedules: Schedule[]
    loan2: Loan2
    loan_cheques: Cheque[]
}
type Invoice = {
  id: number
  datesignChhankitek: string
  datesignSoriyakitek: string
}
type Capital = {
    organization: string
    title_pay: string
    name: string
    sex: string
    birth_year: number
    age: number
    village: string 
    commune: string
    district: string
    province: string
    idPassportNum: string
    phone: string
    phone1: string
    phone2: string
}
type Loanrecord = {
    id:       number
    cust_id:  number
    cust_guarantor_id: number
    currency_id: number
    customer: Customer
    guarantor: Guarantor
    currency: Currency
    loan_peroid: number
    loantype_id: number
    loantype: Loantype
    loan_collateral_1: string,
    loan_collateral_2: string,
}
type Loantype = {
    id: number
    loantype_shortcut: string
}
type Customer = {
    id: number
    cust_title_1: number
    cust_name_1: string
    cust_dob_1: string
    iden_id_1: number
    cust_idcardnum_1: string
    cust_idcardnum_date_1: string
    nametitle1: NameTitle
    identification1: Identification

    cust_title_2: number
    cust_name_2: string
    cust_dob_2: string
    iden_id_2: number
    cust_idcardnum_2: string
    cust_idcardnum_date_2: string
    nametitle2: NameTitle
    identification2: Identification

    cust_address: string

}
type Guarantor = {
    id: number
    cust_title_1: number
    cust_name_1: string
    cust_dob_1: string
    iden_id_1: number
    cust_idcardnum_1: string
    cust_idcardnum_date_1: string
    nametitle1: NameTitle
    identification1: Identification
    cust_address: string
}
type NameTitle = {
    id: number
    nametitle_kh: string
    type: string
}
type Identification = {
    id: number
    identification_kh: string
}
type Currency = {
    id: number
    currency_kh: string
}
type Schedule = {
    id:                         number
    loan_id:                    number
    schedule_startdate:         string
    schedule_enddate:           string
    schedule_totaldays:         number
    schedule_principle_date:    string
    schedule_paymentnumber:     number
    schedule_outstanding:       string
    schedule_over_draft:        string
    schedule_principle:         string
    schedule_interest_rate:     string
    schedule_interest:          number
    schedule_totalpay:          string
    schedule_paidcash:          string
    schedule_note:              string
    schedule_cashin_1:          string
    schedule_cashin_2:          string
    schedule_cashin_3:          string
    schedule_totalcashin:       string
    schedule_remaincash:        string
    schedule_preless_1:         string
    schedule_preless_2:         string
    schedule_preless_3:         string
    schedule_totalpreless:      string
    schedule_lessmoney:         string
    schedule_principle_payment: string
    cheque_number:              string
    invoice_id:                 number
    created_by:                 number
    updated_by:                 number
    active:                     number
    created_at:                 string
    updated_at:                 string
}
type Loan2 = {
  contract_type: number
  contract_schedule_totalpay_all: string
  contract_schedule_totalpay_first: string
  contract_schedule_totalpay_first_date: string
  contract_schedule_totalpay_last: string
  contract_schedule_totalpay_last_date: string
  contract_schedule_first_paid_date: string
  bank: string
}
type Cheque = {
    id:                          number
    loan_id:                     number
    cheque_order:                number
    cheque_number:               number
    schedule_paymentnumber_from: number
    schedule_cheque_from_date:   string
    schedule_paymentnumber_to:   string
    schedule_cheque_to_date:     string
    schedule_totalpay:           string
    created_by:                  number
    updated_by:                  number
    created_at:                  string
    updated_at:                  string
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

  const lid = event.context.params?.lid

  try {
    
    const res = await $fetch<ApiResponse>(
      `${apiBaseUrl}/api/admin-secure/loanrecords/${lid}/print-contract2`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )

    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch schedule"

    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})