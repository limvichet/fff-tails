import { getCookie, getQuery, createError } from "h3"

type Employee = {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
}

type Createdby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Updatedby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Nametitle = {
  id: number;
  nametitle_kh: string;
}

type Customer = {
    id:           number;
    cust_title_1?: number;
    nametitle1?: Nametitle;
    cust_name_1:  string;
    cust_dob_1:   null | string;
    cust_phone_1: string;
    cust_title_2?: number;
    nametitle2?: Nametitle;
    cust_name_2:  string;
    created_by: number;
    created_at: string;
    createdby: Createdby;
    updated_by: string;
    updated_at: string;
    updatedby: Updatedby;
}

type CustomerResponses = {
  current_page: number
  data: Customer[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: CustomerResponses
}

// export default defineEventHandler(async (event: H3Event): Promise<ApiResponse> => {
export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  const token = getCookie(event, "token")
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  // Get query params (?page=1&keyword=abc)
  const q = getQuery(event)

  const query = {
    page: Number(q.page) > 0 ? Number(q.page) : 1,
    ...(q.param ? { param: String(q.param).trim() } : {}),
  }
      
  try {

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/customers`, {
      method: "GET",
      query,
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
