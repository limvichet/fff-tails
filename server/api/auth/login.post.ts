// import { LoginRES } from "~/types/auth";
// import { LoginREQ, schema } from "~/schemas/auth";

type User = {
  id: number;
  email: string;
  active: number;
  emp_id: number;
  lastdate_login: null;
  created_by: null;
  updated_by: number;
  created_at: string;
  updated_at: string;
  identifier_token: string;
}

type LoginResponse = {
  user: User;
  token: string;
  message: string;
  code: number;
}

type LoginRequest = {
  email: string;
  password: string;
  identifier_token: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl } = useRuntimeConfig(event);
    const body = await readBody<LoginRequest>(event);
    // const parsed = schema.safeParse(body);
    // console.log("API URL:", apiBaseUrl)

    // Manual validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 422,
        statusMessage: "Invalid email format"
      })
    }
    if (!body.password) {
      throw createError({
        statusCode: 422,
        statusMessage: "Please enter your password!"
      })
    }

    // if (!parsed.success) {
    //   throw createError({
    //     statusCode: 422,
    //     statusMessage: "Validation error",
    //     data: parsed.error.flatten().fieldErrors,
    //   })
    // }

    const { token, user } = await $fetch<LoginResponse>(`${apiBaseUrl}/api/admin-public/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: body,
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