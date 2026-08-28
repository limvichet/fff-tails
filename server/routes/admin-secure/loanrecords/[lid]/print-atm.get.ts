import { getCookie, createError, type H3Event } from "h3"
type ApiResponse = {
  success: boolean
  data: {
    invoice: Invoice
    capital: Capital
    loanrecord: Loanrecord
  }
}
type Invoice = {
  id: number
  datesignChhankitek: string
  datesignSoriyakitek: string
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
type Loanrecord = {
    id:       number,
    cust_id:  number,
    customer: Customer,
}
type Customer = {
    id: number,
    cust_name_1: number,
    cust_title_1: number,
    nametitle1: NameTitle,
    cust_dob_1: string,
    cust_address: string,
    cust_atm_num: string
}
type NameTitle = {
    id: number,
    nametitle_kh: string,
    type: string
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
    const res = await $fetch<any>(
      `${apiBaseUrl}/admin-secure/loanrecords/${lid}/print-atm`, {
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