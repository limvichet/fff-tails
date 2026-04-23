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

const loanrecordsNeedApproval = defineEventHandler(async (event) => {
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
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/loanrecords-need-approval`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });
    return res;
  } catch (err) {
    const message = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || (err == null ? void 0 : err.message) || "Failed to fetch loan records";
    throw createError({
      statusCode: (err == null ? void 0 : err.status) || 500,
      statusMessage: message,
      data: err == null ? void 0 : err.data
    });
  }
});

export { loanrecordsNeedApproval as default };
//# sourceMappingURL=loanrecords-need-approval.mjs.map
