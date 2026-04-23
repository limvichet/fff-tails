import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-DEzbsXfd.mjs';
import { useRoute } from 'vue-router';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
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
import 'node:url';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import '@iconify/utils';
import 'ipx';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "print-sched2",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const dd = ref(null);
    const capital = computed(() => dd.value?.capital ?? null);
    const loanrecord = computed(() => dd.value?.loanrecord ?? null);
    const schedules = computed(() => dd.value?.schedules ?? []);
    computed(() => dd.value?.sum_schedule_principle ?? 0);
    const invoice = computed(() => dd.value?.invoice ?? null);
    ref(false);
    const formatDate = (d) => {
      const date = new Date(d);
      return date.toLocaleDateString("en-GB");
    };
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_center = resolveComponent("center");
      if (dd.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-f4898a2c><header class="row" data-v-f4898a2c><div class="col-8" data-v-f4898a2c><div class="row mb-3 header-left" data-v-f4898a2c><img${ssrRenderAttr("src", _imports_0)} class="logo" alt="logo" data-v-f4898a2c><div class="header-text" data-v-f4898a2c><h2 data-v-f4898a2c>${ssrInterpolate(capital.value?.organization)}</h2><div data-v-f4898a2c>កាលវិភាគសងប្រាក់</div></div></div><table data-v-f4898a2c><tbody data-v-f4898a2c><tr data-v-f4898a2c><th style="${ssrRenderStyle({ "width": "20%" })}" data-v-f4898a2c>អតិថិជន</th><td style="${ssrRenderStyle({ "width": "40%" })}" data-v-f4898a2c>${ssrInterpolate(loanrecord.value.customer.nametitle1?.nametitle_kh)} ${ssrInterpolate(loanrecord.value.customer.cust_name_1)} `);
        if (loanrecord.value.customer.cust_name_2) {
          _push(`<!--[--> - ${ssrInterpolate(loanrecord.value.customer.cust_name_2)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td></tr><tr data-v-f4898a2c><th data-v-f4898a2c>ថ្ងៃខែឆ្នាំខ្ចីប្រាក់</th><td data-v-f4898a2c>${ssrInterpolate(invoice.value.datesignSoriyakitek)}</td></tr></tbody></table></div><div class="col-3" data-v-f4898a2c><table data-v-f4898a2c><tbody data-v-f4898a2c><tr data-v-f4898a2c><td data-v-f4898a2c>លេខសម្គាល់កម្ចី</td><td class="right" data-v-f4898a2c>${ssrInterpolate(loanrecord.value.id)}</td></tr></tbody></table></div></header><main class="row mt" data-v-f4898a2c><table data-v-f4898a2c><thead data-v-f4898a2c><tr data-v-f4898a2c><th data-v-f4898a2c>ល.រ</th><th data-v-f4898a2c>កាលបរិច្ឆេទបង់ប្រាក់</th><th data-v-f4898a2c>សរុបប្រាក់ត្រូវបង់</th><th data-v-f4898a2c>ផ្សេងៗ</th></tr></thead><tbody data-v-f4898a2c><!--[-->`);
        ssrRenderList(schedules.value, (schedule, i) => {
          _push(`<tr data-v-f4898a2c><td data-v-f4898a2c>${ssrInterpolate(schedule.schedule_paymentnumber)}</td><td data-v-f4898a2c>${ssrInterpolate(formatDate(schedule.schedule_principle_date))}</td><td data-v-f4898a2c>${ssrInterpolate(unref(formatNumber)(schedule.schedule_totalpay))} ${ssrInterpolate(loanrecord.value.currency.currency_kh)}</td><td data-v-f4898a2c>${ssrInterpolate(schedule.schedule_note || "")}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></main><footer class="mt l-space" data-v-f4898a2c><div data-v-f4898a2c><p data-v-f4898a2c>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(invoice.value.datesignChhankitek)}`);
            } else {
              return [
                createTextVNode(toDisplayString(invoice.value.datesignChhankitek), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><p data-v-f4898a2c>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`កំពង់ធំ ${ssrInterpolate(invoice.value.datesignSoriyakitek)}`);
            } else {
              return [
                createTextVNode("កំពង់ធំ " + toDisplayString(invoice.value.datesignSoriyakitek), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><p data-v-f4898a2c>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`អ្នកធ្វើតារាង`);
            } else {
              return [
                createTextVNode("អ្នកធ្វើតារាង")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p></div><div class="v-space" data-v-f4898a2c></div><div data-v-f4898a2c><p data-v-f4898a2c>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(capital.value.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(capital.value.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p></div></footer></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "center mt" }, _attrs))} data-v-f4898a2c> Loading... </div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/prints/[id]/print-sched2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printSched2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f4898a2c"]]);

export { printSched2 as default };
//# sourceMappingURL=print-sched2-CrFGW6f6.mjs.map
