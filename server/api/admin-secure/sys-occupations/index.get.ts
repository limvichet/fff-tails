import { getCookie, getQuery, createError } from "h3"

type ApiResponse = {
  success: boolean
  data: DataResponses
}

type DataResponses = {
  current_page: number
  data: Data[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type Data = {
    id:           number;
    occupation_kh: string;
    occupation_en: string;
    active: number | string;
    created_by: number;
    created_at: string;
    createdby: Createdby;
    updated_by: string;
    updated_at: string;
    updatedby: Updatedby;
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

type Employee = {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
}

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

    const res = await $fetch<ApiResponse>(`${apiBaseUrl}/api/admin-secure/sys-occupations?page=${page}&param=${param}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch occupations"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
