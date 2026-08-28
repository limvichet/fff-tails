import { getCookie, createError } from "h3"
import { APIResponse } from "~/types/employess";

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

    // Updated URL to the endpoint that returns the titles, occupations, etc.
    // Replace '/admin-secure/staffs/metadata' with your actual target route
    const res = await $fetch<APIResponse>(
      `${apiBaseUrl}/admin-secure/employees-form-data`, 
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Caching for performance
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    // Specific error message for this context
    throw customCreateError(error, "Failed to retrieve staff and customer metadata!");
  }
});