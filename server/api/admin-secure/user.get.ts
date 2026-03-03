import { User } from "~/types/auth";
import { getCookie, createError } from "h3"

export default defineEventHandler(async (event) => {

  const { apiBaseUrl } = useRuntimeConfig(event);

  try {

    const token = getCookie(event, "token")

    if (!token)
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message,
    });

    const res = await $fetch<User>(`${apiBaseUrl}/api/admin-secure/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
