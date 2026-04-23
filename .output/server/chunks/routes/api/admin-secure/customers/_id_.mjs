import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, b as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
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

const _id_ = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, "token");
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing product ID" });
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const url = `${config.apiBaseUrl}/api/admin-secure/customers/${id}`;
  const method = event.method;
  try {
    if (method === "GET") {
      return await $fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    if (method === "DELETE") {
      return await $fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: (err == null ? void 0 : err.statusCode) || 500,
      statusMessage: (err == null ? void 0 : err.statusMessage) || "Failed to process request",
      data: err == null ? void 0 : err.data
    });
  }
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
