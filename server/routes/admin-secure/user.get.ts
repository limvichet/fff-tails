import { User } from "~/types/auth";
import { getCookie, createError } from "h3"

export default defineEventHandler(async (event) => {

  const { apiBaseUrl } = useRuntimeConfig(event);

  try {

    const token = getCookie(event, "token")
    console.log("token:", token)

    if (!token)
      throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - Please login again.",
    });

    const res = await $fetch<User>(`${apiBaseUrl}/admin-secure/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;

  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.statusMessage || 'Failed to fetch user data from backend',
    })
  }

});
