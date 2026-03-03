const CACHE_TTL = 60 * 60 * 12; // 12 hours

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);

  try {
    const token = getCookie(event, "token")
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized access",
      });
    }

    const res = await $fetch<{ last_id: number }>(
        `${apiBaseUrl}/api/admin-secure/customers-last-id`, 
        {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        }
    );

    // Caching for performance
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );
    return res;

  } catch (error) {
    
  }
})
