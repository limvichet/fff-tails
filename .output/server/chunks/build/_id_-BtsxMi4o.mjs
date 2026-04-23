import { defineComponent, ref, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
import { u as usePagination } from './usePagination-DqIPbfBm.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Edit schedules",
      meta: [{ name: "loanrecords", content: "edit schedules" }]
    });
    useRoute();
    const { errorMsg, successMsg } = useMessage();
    ref(false);
    const loan = ref(null);
    const schedules = ref([]);
    const {
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      getIndex,
      totalRecords,
      paginatedData: paginatedSchedules
    } = usePagination(schedules, 10);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-6c395bdc>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-6c395bdc>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loan.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. Information" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-v-6c395bdc${_scopeId}><div data-v-6c395bdc${_scopeId}><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Customer</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.customer.cust_name_1)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Spouse</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.customer.cust_name_2)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Loan ID</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.id)} readonly data-v-6c395bdc${_scopeId}></div></div><div data-v-6c395bdc${_scopeId}><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Start Date</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", unref(formatDateForOutput)(new Date(loan.value.loan_startdate)))} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>First Paid Date</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_first_paid_date ? unref(formatDateForOutput)(new Date(loan.value.loan_first_paid_date)) : "")} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Currency</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.currency.currency_en)} readonly data-v-6c395bdc${_scopeId}></div></div><div data-v-6c395bdc${_scopeId}><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Total Cash</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_totalcash)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Principle</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_principle)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Interest Rate</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_interest_rate)} readonly data-v-6c395bdc${_scopeId}></div></div><div data-v-6c395bdc${_scopeId}><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Period</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_peroid)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Loan Type</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loantype.loantype_detail)} readonly data-v-6c395bdc${_scopeId}></div><div class="py-2" data-v-6c395bdc${_scopeId}><label class="label" data-v-6c395bdc${_scopeId}>Over Draft</label><input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"${ssrRenderAttr("value", loan.value.loan_over_draft)} readonly data-v-6c395bdc${_scopeId}></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Customer"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.customer.cust_name_1,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Spouse"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.customer.cust_name_2,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Loan ID"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.id,
                        readonly: ""
                      }, null, 8, ["value"])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Start Date"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: unref(formatDateForOutput)(new Date(loan.value.loan_startdate)),
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "First Paid Date"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_first_paid_date ? unref(formatDateForOutput)(new Date(loan.value.loan_first_paid_date)) : "",
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Currency"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.currency.currency_en,
                        readonly: ""
                      }, null, 8, ["value"])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Total Cash"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_totalcash,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Principle"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_principle,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Interest Rate"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_interest_rate,
                        readonly: ""
                      }, null, 8, ["value"])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Period"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_peroid,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Loan Type"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loantype.loantype_detail,
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "py-2" }, [
                      createVNode("label", { class: "label" }, "Over Draft"),
                      createVNode("input", {
                        class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                        value: loan.value.loan_over_draft,
                        readonly: ""
                      }, null, 8, ["value"])
                    ])
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
              _push2(`<div class="max-w-full overflow-x-auto custom-scrollbar rounded-xl border border-gray-200 dark:border-gray-800" data-v-6c395bdc${_scopeId}><table class="min-w-full text-sm text-left" data-v-6c395bdc${_scopeId}><thead class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" data-v-6c395bdc${_scopeId}><tr data-v-6c395bdc${_scopeId}><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>#</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Start</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>End</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Days</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Rate</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Outstanding</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Principle</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Interest</th><th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200" data-v-6c395bdc${_scopeId}>Total</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700" data-v-6c395bdc${_scopeId}><!--[-->`);
              ssrRenderList(unref(paginatedSchedules), (s, i) => {
                _push2(`<tr class="hover:bg-blue-50 dark:hover:bg-white/5 transition" data-v-6c395bdc${_scopeId}><td class="px-3 py-2 font-medium text-gray-500" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(getIndex)(i))}</td><td class="px-3 py-2" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(new Date(s.schedule_startdate)))}</td><td class="px-3 py-2" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(new Date(s.schedule_enddate)))}</td><td class="px-3 py-2 text-center" data-v-6c395bdc${_scopeId}>${ssrInterpolate(s.schedule_totaldays)}</td><td class="px-3 py-2 text-right" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_interest_rate || 0)))}</td><td class="px-3 py-2 text-right" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_outstanding || 0)))}</td><td class="px-3 py-2 text-right" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_principle || 0)))}</td><td class="px-3 py-2 text-right" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_interest || 0)))}</td><td class="px-3 py-2 text-right text-blue-600" data-v-6c395bdc${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_totalpay || 0)))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (schedules.value.length === 0) {
                _push2(`<tr data-v-6c395bdc${_scopeId}><td colspan="9" class="text-center py-8 text-gray-400" data-v-6c395bdc${_scopeId}> No schedules found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
              if (schedules.value.length > 0) {
                _push2(`<div class="flex justify-between items-center mt-4" data-v-6c395bdc${_scopeId}><div class="flex items-center gap-2" data-v-6c395bdc${_scopeId}><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-6c395bdc${_scopeId}> Prev </button><span class="text-sm" data-v-6c395bdc${_scopeId}> Page ${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))} | Total Records: ${ssrInterpolate(unref(totalRecords))}</span><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-6c395bdc${_scopeId}> Next </button></div></div>`);
              } else {
                _push2(`<!---->`);
              }
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
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(paginatedSchedules), (s, i) => {
                        return openBlock(), createBlock("tr", {
                          key: i,
                          class: "hover:bg-blue-50 dark:hover:bg-white/5 transition"
                        }, [
                          createVNode("td", { class: "px-3 py-2 font-medium text-gray-500" }, toDisplayString(unref(getIndex)(i)), 1),
                          createVNode("td", { class: "px-3 py-2" }, toDisplayString(unref(formatDateForOutput)(new Date(s.schedule_startdate))), 1),
                          createVNode("td", { class: "px-3 py-2" }, toDisplayString(unref(formatDateForOutput)(new Date(s.schedule_enddate))), 1),
                          createVNode("td", { class: "px-3 py-2 text-center" }, toDisplayString(s.schedule_totaldays), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(Number(s.schedule_interest_rate || 0))), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(Number(s.schedule_outstanding || 0))), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(Number(s.schedule_principle || 0))), 1),
                          createVNode("td", { class: "px-3 py-2 text-right" }, toDisplayString(unref(formatNumber)(Number(s.schedule_interest || 0))), 1),
                          createVNode("td", { class: "px-3 py-2 text-right text-blue-600" }, toDisplayString(unref(formatNumber)(Number(s.schedule_totalpay || 0))), 1)
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
                ]),
                schedules.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex justify-between items-center mt-4"
                }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("button", {
                      onClick: unref(prevPage),
                      disabled: unref(currentPage) === 1,
                      class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    }, " Prev ", 8, ["onClick", "disabled"]),
                    createVNode("span", { class: "text-sm" }, " Page " + toDisplayString(unref(currentPage)) + " / " + toDisplayString(unref(totalPages)) + " | Total Records: " + toDisplayString(unref(totalRecords)), 1),
                    createVNode("button", {
                      onClick: unref(nextPage),
                      disabled: unref(currentPage) === unref(totalPages),
                      class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    }, " Next ", 8, ["onClick", "disabled"])
                  ])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6c395bdc"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BtsxMi4o.mjs.map
