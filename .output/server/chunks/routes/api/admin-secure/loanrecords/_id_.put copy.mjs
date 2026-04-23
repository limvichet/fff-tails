import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, f as readBody } from '../../../../nitro/nitro.mjs';
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

const _id__put_copy = defineEventHandler(async (event) => {
  var _a, _b;
  const { apiBaseUrl } = useRuntimeConfig(event);
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing record ID"
    });
  }
  try {
    const body = await readBody(event);
    const res = await $fetch(
      `${apiBaseUrl}/api/admin-secure/loanrecords/${id}`,
      {
        method: "PUT",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    return res;
  } catch (err) {
    const message = ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.message) || (err == null ? void 0 : err.message) || "Failed to update loan record";
    throw createError({
      statusCode: (err == null ? void 0 : err.status) || 500,
      statusMessage: message,
      data: err == null ? void 0 : err.data
    });
  }
});

export { _id__put_copy as default };
//# sourceMappingURL=_id_.put copy.mjs.map
