import { defineComponent, ref, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
import { u as usePagination } from './usePagination-DqIPbfBm.mjs';
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
  __name: "[id] copy",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const { errorMsg, successMsg } = useMessage();
    ref(false);
    const loan = ref(null);
    const schedules = ref([]);
    usePagination(schedules, 10);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-f4655252>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-f4655252>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loan.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. Information" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-v-f4655252${_scopeId}><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Customer</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.customer.cust_name_1)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Spouse</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.customer.cust_name_2)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Loan ID</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.id)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Currency</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.currency.currency_en)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Start Date</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_startdate)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>End Date</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_enddate)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Total Cash</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_totalcash)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Principle</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_principle)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Interest Rate</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_interest_rate)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Period</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_peroid)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Loan Type</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loantype.loantype_detail)} readonly data-v-f4655252${_scopeId}></div><div data-v-f4655252${_scopeId}><label class="label" data-v-f4655252${_scopeId}>Over Draft</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_over_draft)} readonly data-v-f4655252${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Customer"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.customer.cust_name_1,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Spouse"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.customer.cust_name_2,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Loan ID"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.id,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Currency"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.currency.currency_en,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Start Date"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_startdate,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "End Date"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_enddate,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Total Cash"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_totalcash,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Principle"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_principle,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Interest Rate"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_interest_rate,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Period"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_peroid,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Loan Type"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loantype.loantype_detail,
                      readonly: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Over Draft"),
                    createVNode("input", {
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      value: loan.value.loan_over_draft,
                      readonly: ""
                    }, null, 8, ["value"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ComponentCard, {
          title: "2. Schedule List",
          class: "mt-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="max-w-full overflow-x-auto custom-scrollbar rounded-xl border border-gray-200 dark:border-gray-800" data-v-f4655252${_scopeId}><table class="min-w-full text-sm text-left" data-v-f4655252${_scopeId}><thead class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" data-v-f4655252${_scopeId}><tr data-v-f4655252${_scopeId}><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>#</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Start</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>End</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Days</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Rate</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Outstanding</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Principle</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Interest</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-f4655252${_scopeId}>Total</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700" data-v-f4655252${_scopeId}><!--[-->`);
              ssrRenderList(schedules.value, (s, i) => {
                _push2(`<tr class="hover:bg-blue-50 dark:hover:bg-white/5 transition" data-v-f4655252${_scopeId}><td class="px-3 py-2 font-medium text-gray-500" data-v-f4655252${_scopeId}>${ssrInterpolate(i + 1)}</td><td class="px-3 py-2" data-v-f4655252${_scopeId}>${ssrInterpolate(s.schedule_startdate)}</td><td class="px-3 py-2" data-v-f4655252${_scopeId}>${ssrInterpolate(s.schedule_enddate)}</td><td class="px-3 py-2 text-center" data-v-f4655252${_scopeId}>${ssrInterpolate(s.schedule_totaldays)}</td><td class="px-3 py-2 text-right" data-v-f4655252${_scopeId}>${ssrInterpolate(unref(formatNumber)(s.schedule_interest_rate))}</td><td class="px-3 py-2 text-right" data-v-f4655252${_scopeId}>${ssrInterpolate(unref(formatNumber)(s.schedule_outstanding))}</td><td class="px-3 py-2 text-right" data-v-f4655252${_scopeId}>${ssrInterpolate(unref(formatNumber)(s.schedule_principle))}</td><td class="px-3 py-2 text-right" data-v-f4655252${_scopeId}>${ssrInterpolate(unref(formatNumber)(s.schedule_interest))}</td><td class="px-3 py-2 text-right text-blue-600" data-v-f4655252${_scopeId}>${ssrInterpolate(unref(formatNumber)(s.schedule_totalpay))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (schedules.value.length === 0) {
                _push2(`<tr data-v-f4655252${_scopeId}><td colspan="9" class="text-center py-8 text-gray-400" data-v-f4655252${_scopeId}> No schedules found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            } else {
              return [
                createVNode("div", { class: "max-w-full overflow-x-auto custom-scrollbar rounded-xl border border-gray-200 dark:border-gray-800" }, [
                  createVNode("table", { class: "min-w-full text-sm text-left" }, [
                    createVNode("thead", { class: "bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "#"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Start"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "End"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Days"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Rate"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Outstanding"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Principle"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Interest"),
                        createVNode("th", { class: "px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" }, "Total")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(schedules.value, (s, i) => {
                        return openBlock(), createBlock("tr", {
                          key: i,
                          class: "hover:bg-blue-50 dark:hover:bg-white/5 transition"
                        }, [
                          createVNode("td", { class: "px-3 py-2 font-medium text-gray-500" }, toDisplayString(i + 1), 1),
                          createVNode("td", { class: "px-3 py-2" }, toDisplayString(s.schedule_startdate), 1),
                          createVNode("td", { class: "px-3 py-2" }, toDisplayString(s.schedule_enddate), 1),
                          createVNode("td", { class: "px-3 py-2 text-center" }, toDisplayString(s.schedule_totaldays), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(s.schedule_interest_rate)), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(s.schedule_outstanding)), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(s.schedule_principle)), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(s.schedule_interest)), 1),
                          createVNode("td", { class: "px-3 py-2 text-right text-blue-600" }, toDisplayString(unref(formatNumber)(s.schedule_totalpay)), 1)
                        ]);
                      }), 128)),
                      schedules.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "9",
                          class: "text-center py-8 text-gray-400"
                        }, " No schedules found. ")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/[id] copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id__copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f4655252"]]);

export { _id__copy as default };
//# sourceMappingURL=_id_ copy-BUlh1RWI.mjs.map
