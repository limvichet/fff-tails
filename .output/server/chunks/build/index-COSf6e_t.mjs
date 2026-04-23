import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, openBlock, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { C as ComponentCard, u as useMessage } from './useMessage-Doqk68dv.mjs';
import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import './number-BUJwr6QZ.mjs';
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
import 'vue-router';

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Search payments"
    });
    const schedules = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const { errorMsg } = useMessage();
    const fetchPayments = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch("/api/admin-secure/payments", {
          method: "GET",
          query: {
            page: page.value,
            param: searchQuery.value || void 0
          }
        });
        schedules.value = res.data.data || [];
        total.value = res.data.total || 0;
        lastPageValue.value = res.data.last_page || 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch payments";
        schedules.value = [];
      } finally {
        loading.value = false;
      }
    };
    const paginated = computed(() => schedules.value);
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchPayments();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchPayments();
      }
    };
    const nextPage = () => {
      if (page.value < lastPageValue.value) {
        page.value++;
        fetchPayments();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1" }, _attrs))} data-v-483f0b32>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Payments" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative mb-3" data-v-483f0b32${_scopeId}><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search payments..." class="input" data-v-483f0b32${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 p-2 bg-red-500/20 text-red-400 text-sm" data-v-483f0b32${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center py-6 text-gray-400" data-v-483f0b32${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-x-auto border rounded-xl" data-v-483f0b32${_scopeId}><table class="min-w-full text-sm" data-v-483f0b32${_scopeId}><thead class="border-b" data-v-483f0b32${_scopeId}><tr data-v-483f0b32${_scopeId}><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>#</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Loan</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Customer</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Period</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Total Loan</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Paid</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Remaining</th><th class="px-2 py-2 text-left" data-v-483f0b32${_scopeId}>Create/Update</th></tr></thead><tbody data-v-483f0b32${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (p, i) => {
                _push2(`<tr class="border-b hover:bg-blue-100/20" data-v-483f0b32${_scopeId}><td class="px-2 py-1" data-v-483f0b32${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-2 py-1" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.loan_id)}(${ssrInterpolate(p.loantype_short)}) </td><td class="px-2 py-1" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.cust_name_1)} `);
                if (p.cust_name_2) {
                  _push2(`<span data-v-483f0b32${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="px-2 py-1" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.loan_peroid)}</td><td class="px-2 py-1" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.loan_totalcash)} ${ssrInterpolate(p.currency_en)}</td><td class="px-2 py-1 text-green-600" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.schedule_totalcashin_tt)}</td><td class="px-2 py-1 text-red-500" data-v-483f0b32${_scopeId}>${ssrInterpolate(p.schedule_lessmoney_tt)}</td><td class="px-2 py-1 text-gray-400" data-v-483f0b32${_scopeId}><div data-v-483f0b32${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(new Date(p.loan_startdate)))}</div><div data-v-483f0b32${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(new Date(p.loan_enddate)))}</div></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-483f0b32${_scopeId}><td colspan="8" class="text-center py-6 text-gray-400" data-v-483f0b32${_scopeId}> No payments found </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            }
            _push2(`<div class="mt-4 flex justify-between" data-v-483f0b32${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-483f0b32${_scopeId}> Prev </button><span class="text-sm" data-v-483f0b32${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)} | Total Records: <b data-v-483f0b32${_scopeId}>${ssrInterpolate(total.value)}</b></span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-483f0b32${_scopeId}> Next </button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative mb-3" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search payments...",
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ])
              ]),
              unref(errorMsg) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 p-2 bg-red-500/20 text-red-400 text-sm"
              }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
              loading.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-6 text-gray-400"
              }, " Loading... ")) : (openBlock(), createBlock("div", {
                key: 2,
                class: "overflow-x-auto border rounded-xl"
              }, [
                createVNode("table", { class: "min-w-full text-sm" }, [
                  createVNode("thead", { class: "border-b" }, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-2 py-2 text-left" }, "#"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Loan"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Customer"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Period"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Total Loan"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Paid"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Remaining"),
                      createVNode("th", { class: "px-2 py-2 text-left" }, "Create/Update")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (p, i) => {
                      return openBlock(), createBlock("tr", {
                        key: p.id,
                        class: "border-b hover:bg-blue-100/20"
                      }, [
                        createVNode("td", { class: "px-2 py-1" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                        createVNode("td", { class: "px-2 py-1" }, toDisplayString(p.loan_id) + "(" + toDisplayString(p.loantype_short) + ") ", 1),
                        createVNode("td", { class: "px-2 py-1" }, [
                          createTextVNode(toDisplayString(p.cust_name_1) + " ", 1),
                          p.cust_name_2 ? (openBlock(), createBlock("span", { key: 0 })) : createCommentVNode("", true)
                        ]),
                        createVNode("td", { class: "px-2 py-1" }, toDisplayString(p.loan_peroid), 1),
                        createVNode("td", { class: "px-2 py-1" }, toDisplayString(p.loan_totalcash) + " " + toDisplayString(p.currency_en), 1),
                        createVNode("td", { class: "px-2 py-1 text-green-600" }, toDisplayString(p.schedule_totalcashin_tt), 1),
                        createVNode("td", { class: "px-2 py-1 text-red-500" }, toDisplayString(p.schedule_lessmoney_tt), 1),
                        createVNode("td", { class: "px-2 py-1 text-gray-400" }, [
                          createVNode("div", null, toDisplayString(unref(formatDateForOutput)(new Date(p.loan_startdate))), 1),
                          createVNode("div", null, toDisplayString(unref(formatDateForOutput)(new Date(p.loan_enddate))), 1)
                        ])
                      ]);
                    }), 128)),
                    paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "8",
                        class: "text-center py-6 text-gray-400"
                      }, " No payments found ")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ])),
              createVNode("div", { class: "mt-4 flex justify-between" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm" }, [
                  createTextVNode(" Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value) + " | Total Records: ", 1),
                  createVNode("b", null, toDisplayString(total.value), 1)
                ]),
                createVNode("button", {
                  onClick: nextPage,
                  disabled: page.value === lastPageValue.value,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Next ", 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/payments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-483f0b32"]]);

export { index as default };
//# sourceMappingURL=index-COSf6e_t.mjs.map
