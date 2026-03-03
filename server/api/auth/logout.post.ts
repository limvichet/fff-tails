export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);

  try {

    const token = getCookie(event, "token")

    if (!token)
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message,
    });

    await $fetch(`${apiBaseUrl}/api/admin-secure/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getCookie(event, "token")!}`,
      },
    });


    deleteCookie(event, "token");
    return { success: true };
    
  } catch (error: any) {
      
    deleteCookie(event, "token");
    throw customCreateError(error, "Can't logout!");
  }
});
