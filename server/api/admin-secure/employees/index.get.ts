import { getCookie, getQuery, createError, type H3Event } from "h3"

// type Employee = {
//   id: number;
//   surname: string;
//   first_name: string;
//   full_name: string;
// }

// type Createdby = {
//   id: number;
//   emp_id: number;
//   employee: Employee;
// }

type Updatedby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Gender = {
  id: number;
  gender_kh: string;
}
type Status = {
  id: number;
  status_kh: string;
}

type Employee = {
    id: number;
    full_name: string;
    dob:  string;
    phone: string;
    status_id: number;
    gender: Gender;
    status: Status;
}

type EmployeeResponses = {
  current_page: number
  data: Employee[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: EmployeeResponses
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

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/employees`, {
      method: "GET",
      query: {
        page: query.page || 1,
        param: query.param || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
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
