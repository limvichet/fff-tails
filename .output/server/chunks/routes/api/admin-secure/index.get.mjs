import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, e as getQuery } from '../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a;
  const { apiBaseUrl } = useRuntimeConfig(event);
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
  const query = getQuery(event);
  const page = query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
  const param = typeof query.param === "string" && query.param.trim() ? query.param : "";
  try {
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/customers?page=${page}&param=${param}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    return res;
  } catch (err) {
    const message = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || (err == null ? void 0 : err.message) || "Failed to fetch customers";
    throw createError({
      statusCode: (err == null ? void 0 : err.status) || 500,
      statusMessage: message,
      data: err == null ? void 0 : err.data
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
