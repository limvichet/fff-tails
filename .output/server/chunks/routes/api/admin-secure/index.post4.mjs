import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, f as readBody } from '../../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  const { apiBaseUrl } = useRuntimeConfig(event);
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
  try {
    const body = await readBody(event);
    if (!body || Object.keys(body).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request body"
      });
    }
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/schedules`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });
    return res;
  } catch (err) {
    console.log("ERROR FROM API:", err);
    const message = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || (err == null ? void 0 : err.message) || "Failed to create schedules";
    throw createError({
      statusCode: (err == null ? void 0 : err.status) || 500,
      statusMessage: message,
      data: err == null ? void 0 : err.data
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
