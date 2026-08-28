import { getCookie } from "h3"

type ApiResponse = {
  message: string
  code: number
}

type DataRequest = {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)

  try {
    const token = getCookie(event, "token")
    const body = await readBody<DataRequest>(event)

    const response = await $fetch<ApiResponse>(
      `${apiBaseUrl}/admin-secure/change-password`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body,
      }
    )

    return response
  } catch (error: any) {
    throw customCreateError(
      error,
      error?.data?.message || "Failed to change password."
    )
  }
})