import { d as defineEventHandler, u as useRuntimeConfig, f as readBody, c as createError, i as setCookie, a as customCreateError } from '../../../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'unhead';
import 'zod';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'node:url';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import '@iconify/utils';
import 'ipx';

const login_post = defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl } = useRuntimeConfig(event);
    const body = await readBody(event);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 422,
        statusMessage: "Invalid email format"
      });
    }
    if (!body.password) {
      throw createError({
        statusCode: 422,
        statusMessage: "Please enter your password!"
      });
    }
    const { token, user } = await $fetch(`${apiBaseUrl}/api/admin-public/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body
    });
    setCookie(event, "token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24
      // 1 days
    });
    return { user, token };
  } catch (error) {
    throw customCreateError(error, "Can't login!");
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
