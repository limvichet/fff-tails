import { loginFormFull, LoginREQ, LoginRES } from "~/schemas/auth";
import { encryptString } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl, secretKey } = useRuntimeConfig(event);
    const body: LoginREQ = await readBody(event);

    const parsedBody = loginFormFull.parse(body);
    const {
      token,
      user: { location_code },
    } = await $fetch<LoginRES>(`${apiBaseUrl}/admin-public/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody),
    });

    // Set secure HTTP-only cookie
    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 days
    });

  } catch (error: any) {
    throw customCreateError(error, "Can't login!");
  }
});
