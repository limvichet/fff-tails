import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, U as UNAUTHORIZED, j as deleteCookie, a as customCreateError } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  try {
    const token = getCookie(event, "token");
    if (!token)
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message
      });
    await $fetch(`${apiBaseUrl}/api/admin-secure/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie(event, "token")}`
      }
    });
    deleteCookie(event, "token", { path: "/" });
    return { success: true };
  } catch (error) {
    deleteCookie(event, "token");
    throw customCreateError(error, "Can't logout!");
  }
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
