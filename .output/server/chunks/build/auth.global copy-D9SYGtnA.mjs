import { af as executeAsync } from '../nitro/nitro.mjs';
import { x as defineNuxtRouteMiddleware, g as useAuth, w as useRequestHeaders, n as navigateTo } from './server.mjs';
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
import 'vue-router';

const auth_global_copy = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const { isAuthenticated, fetchUser } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);
  if (requiresAuth || guestOnly) {
    if (!isAuthenticated.value) {
      {
        const headers = useRequestHeaders(["cookie"]);
        [__temp, __restore] = executeAsync(() => fetchUser(headers)), await __temp, __restore();
      }
    }
  }
  if (requiresAuth && !isAuthenticated.value) {
    return navigateTo(`/app/signin?redirectTo=${encodeURIComponent(to.fullPath)}`, {
      replace: true
    });
  }
  if (guestOnly && isAuthenticated.value) {
    return navigateTo(`/app/dashboard`, { replace: true });
  }
});

export { auth_global_copy as default };
//# sourceMappingURL=auth.global copy-D9SYGtnA.mjs.map
