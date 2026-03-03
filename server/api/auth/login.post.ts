import { LoginRES } from "~/types/auth";
import { LoginREQ, schema } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl } = useRuntimeConfig(event);
    const body = await readBody<LoginREQ>(event);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      throw createError({
        statusCode: 422,
        statusMessage: "Validation error",
        data: parsed.error.flatten().fieldErrors,
      })
    }

    const { token, user } = await $fetch<LoginRES>(`${apiBaseUrl}/api/admin-public/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: parsed.data,
    });

    // Set secure HTTP-only cookie
    setCookie(event, "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 days
    });

    return { user, token };

  } catch (error: any) {
    throw customCreateError(error, "Can't login!");
  }
});