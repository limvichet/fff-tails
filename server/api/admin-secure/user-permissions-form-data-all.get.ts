import { getCookie, createError } from "h3"

type APIResponse = {
    employees: Array<{ id: number; label: string }>;
    roles: Array<{ id: number; label: string }>;
    role_permissions: {
        id: number;
        name: string;
        slug: string;
        permissions: Array<{ id: number; name: string; slug: string }>;
    }
}


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
      `${apiBaseUrl}/api/admin-secure/user-permissions-form-data-all`, 
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // 🔥 IMPORTANT: disable Nitro cache
    setHeader(event, 'Cache-Control', 'no-store')

    return res;
  } catch (error: any) {
    // Specific error message for this context
    throw customCreateError(error, "Failed to retrieve staff and customer metadata!");
  }
});