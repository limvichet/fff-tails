export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);

  try {
    await $fetch(`${apiBaseUrl}/admin-secure/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getCookie(event, "auth-token")!}`,
      },
    });

    // Clear the httpOnly cookie
    deleteCookie(event, "auth-token");
    return { success: true };
  } catch (error: any) {
    // remove cookie even the request fails
    deleteCookie(event, "auth-token");
    throw customCreateError(error, "Can't logout!");
  }
});
