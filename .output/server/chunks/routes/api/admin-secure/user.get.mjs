import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError } from '../../../nitro/nitro.mjs';
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

const user_get = defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  try {
    const token = getCookie(event, "token");
    console.log("token:", token);
    if (!token)
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - Please login again."
      });
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return res;
  } catch (err) {
    throw createError({
      statusCode: (err == null ? void 0 : err.statusCode) || 500,
      statusMessage: (err == null ? void 0 : err.statusMessage) || "Failed to fetch user data from backend"
    });
  }
});

export { user_get as default };
//# sourceMappingURL=user.get.mjs.map
