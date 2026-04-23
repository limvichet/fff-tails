import { d as defineEventHandler, u as useRuntimeConfig, b as getRouterParam, g as getCookie, c as createError, h as setHeader, a as customCreateError } from '../../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  const id = getRouterParam(event, "id");
  try {
    const token = getCookie(event, "token");
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized access"
      });
    }
    const res = await $fetch(
      `${apiBaseUrl}/api/admin-secure/schedules-cheque-edit/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "cache-control": "no-cache"
          // ✅ prevent upstream cache
        }
      }
    );
    setHeader(event, "Cache-Control", "no-store");
    return res;
  } catch (error) {
    throw customCreateError(error, "Failed to retrieve staff and customer metadata!");
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
