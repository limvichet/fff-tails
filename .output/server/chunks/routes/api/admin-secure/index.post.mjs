import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, c as createError, r as readMultipartFormData } from '../../../nitro/nitro.mjs';
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
    const formFields = await readMultipartFormData(event);
    if (!formFields) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data"
      });
    }
    const formData = new FormData();
    for (const field of formFields) {
      if (!field.name) continue;
      if (field.filename) {
        formData.append(
          field.name,
          new Blob([new Uint8Array(field.data)]),
          field.filename
        );
      } else {
        formData.append(field.name, field.data.toString("utf-8"));
      }
    }
    const res = await $fetch(`${apiBaseUrl}/api/admin-secure/customers`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });
    return res;
  } catch (err) {
    const message = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || (err == null ? void 0 : err.message) || "Failed to create customer";
    throw createError({
      statusCode: (err == null ? void 0 : err.status) || 500,
      statusMessage: message,
      data: err == null ? void 0 : err.data
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
