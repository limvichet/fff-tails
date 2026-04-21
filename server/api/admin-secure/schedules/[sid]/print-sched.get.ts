import { getCookie, createError, type H3Event } from "h3"

type ApiResponse = {
  success: boolean
  data: PrintSchedule
}
type PrintSchedule = {
  capital: Capital,
  loanrecord: LoanRecord
  schedules: Schedule[]
  sum_schedule_principle: number
  invoice: Invoice
}
type Capital = {
    organization: string,
    title_pay: string,
    name: string,
    sex: string,
    birth_year: number,
    age: number,
    village: string ,
    commune: string,
    district: string,
    province: string,
    idPassportNum: string,
    phone: string,
    phone1: string,
    phone2: string
}



type LoanRecord = {
  id: number
  cust_id: number
  loan_totalcash: string
  loan_interest_rate: string
  loan_peroid: number
  loan_startdate: string
  customer: Customer
  currency: Currency
  loantype: Loantype
}

type Customer = {
  id: number
  cust_name_1: string
  cust_phone_1: string
  nametitle1: Nametitle
}

type Nametitle = {
  id: number
  nametitle_kh: string
}

type Currency = {
  id: number
  currency_kh?: string
  currency_en?: string
}

type Loantype = {
  id: number
  loantype_kh?: string
  loantype_shortcut?: string
  loantype_short?: string
}

type Schedule = {
  id: number
  schedule_paymentnumber: number
  schedule_principle_date: string
  schedule_principle: string
  schedule_interest: string
  schedule_totalpay: string
  schedule_outstanding: string
}

type Invoice = {
  id: number
  datesignChhankitek: string
  datesignSoriyakitek: string
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

  const sid = event.context.params?.sid

  try {
    const res = await $fetch<ApiResponse>(
      `${apiBaseUrl}/api/admin-secure/schedules/${sid}/print-sched`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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