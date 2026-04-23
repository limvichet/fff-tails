import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, s as setResponseHeader, a as customCreateError } from '../../../nitro/nitro.mjs';
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

const CACHE_TTL = 60 * 60 * 12;
const employeesFormData_get = defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  try {
    const token = getCookie(event, "token");
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized access"
      });
    }
    const res = await $fetch(
      `${apiBaseUrl}/api/admin-secure/employees-form-data`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );
    return res;
  } catch (error) {
    throw customCreateError(error, "Failed to retrieve staff and customer metadata!");
  }
});

export { employeesFormData_get as default };
//# sourceMappingURL=employees-form-data.get.mjs.map
