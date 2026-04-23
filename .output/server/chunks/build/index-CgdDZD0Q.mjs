import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createBlock, createCommentVNode, withDirectives, openBlock, vModelText, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { useRouter } from 'vue-router';
import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
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

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Search loans",
      meta: [{ name: "loanrecords", content: "search loan records" }]
    });
    const router = useRouter();
    const { errorMsg, successMsg } = useMessage();
    const isDeleteModal = ref(false);
    const selectedLoanId = ref(null);
    successMsg.value = null;
    errorMsg.value = null;
    const loanrecords = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const fetchLoanrecords = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const { data } = await $fetch(
          "/api/admin-secure/loanrecords",
          {
            method: "GET",
            query: {
              page: page.value,
              param: searchQuery.value || void 0
            }
          }
        );
        loanrecords.value = Array.isArray(data.data) ? data?.data : [];
        total.value = data.total ?? 0;
        lastPageValue.value = data.last_page ?? 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch loan records";
        loanrecords.value = [];
        total.value = 0;
        lastPageValue.value = 1;
      } finally {
        loading.value = false;
      }
    };
    const paginated = computed(() => loanrecords.value);
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchLoanrecords();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchLoanrecords();
      }
    };
    const nextPage = () => {
      if (page.value < lastPageValue.value) {
        page.value++;
        fetchLoanrecords();
      }
    };
    const editLoan = (id) => {
      router.push(`/app/dashboard/loanrecords/${id}`);
    };
    const openDeleteModal = (id) => {
      selectedLoanId.value = id;
      isDeleteModal.value = true;
    };
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1" }, _attrs))} data-v-faceecad>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Loan Records" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative" data-v-faceecad${_scopeId}><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-faceecad${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" data-v-faceecad${_scopeId}></path></svg><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search records..." class="input !pl-9 text-sm" data-v-faceecad${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-faceecad${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(successMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-faceecad${_scopeId}>${ssrInterpolate(unref(successMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center text-gray-400 py-6" data-v-faceecad${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" data-v-faceecad${_scopeId}><div class="max-w-full overflow-x-auto custom-scrollbar" data-v-faceecad${_scopeId}><table class="min-w-full" data-v-faceecad${_scopeId}><thead data-v-faceecad${_scopeId}><tr class="border-b border-gray-200 dark:border-gray-700" data-v-faceecad${_scopeId}><th class="px-2 py-3 text-left text-sm w-[2%]" data-v-faceecad${_scopeId}>#</th><th class="px-1 py-3 text-left text-sm w-[3%]" data-v-faceecad${_scopeId}>ID</th><th class="px-1 py-3 text-left text-sm w-[3%]" data-v-faceecad${_scopeId}>Loan</th><th class="px-1 py-3 text-left text-sm w-[15%]" data-v-faceecad${_scopeId}>Customer</th><th class="px-1 py-3 text-left text-sm w-[10%]" data-v-faceecad${_scopeId}>New</th><th class="px-1 py-3 text-left text-sm w-[10%]" data-v-faceecad${_scopeId}>Total</th><th class="px-1 py-3 text-left text-sm w-[12%]" data-v-faceecad${_scopeId}>Created/Updated</th><th class="px-1 py-3 text-center text-sm w-[20%]" data-v-faceecad${_scopeId}>Contracts</th><th class="px-1 py-3 text-center text-sm w-[15%]" data-v-faceecad${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700" data-v-faceecad${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (l, i) => {
                _push2(`<tr class="hover:bg-blue-300/20 transition" data-v-faceecad${_scopeId}><td class="px-2 py-1 text-sm text-gray-400" data-v-faceecad${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-1 py-1 text-sm" data-v-faceecad${_scopeId}>${ssrInterpolate(l.id)}</td><td class="px-1 py-1 text-sm" data-v-faceecad${_scopeId}>${ssrInterpolate(l?.loantype?.loantype_short ?? "")}</td><td class="px-1 py-1 text-sm" data-v-faceecad${_scopeId}>${ssrInterpolate(l.customer.nametitle1.nametitle_kh)} ${ssrInterpolate(l.customer.cust_name_1)}</td><td class="px-1 py-1 text-sm text-gray-700" data-v-faceecad${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(l.loan_newcash || 0)))}</td><td class="px-1 py-1 text-sm text-gray-700" data-v-faceecad${_scopeId}>${ssrInterpolate(unref(formatNumber)(Number(l.loan_totalcash || 0)))}</td><td class="px-1 py-2 text-sm text-gray-400" data-v-faceecad${_scopeId}><p class="font-semibold" data-v-faceecad${_scopeId}>${ssrInterpolate(l.createdby.employee.full_name)} - ${ssrInterpolate(unref(formatDateForOutput)(new Date(l.created_at)))}</p><p class="font-semibold" data-v-faceecad${_scopeId}>${ssrInterpolate(l.updatedby.employee.full_name)} - ${ssrInterpolate(unref(formatDateForOutput)(new Date(l.updated_at)))}</p></td><td class="px-1 py-1 text-sm text-gray-700" data-v-faceecad${_scopeId}>`);
                if (l.count_schedule > 0) {
                  _push2(`<div class="flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6" data-v-faceecad${_scopeId}><a${ssrRenderAttr("href", `/app/dashboard/schedules/prints/${l.id}/print-sched`)} target="_blank" rel="noopener" class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm" data-v-faceecad${_scopeId}> Sched </a></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="px-1 py-1 text-sm" data-v-faceecad${_scopeId}><div class="flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6" data-v-faceecad${_scopeId}><button disabled class="${ssrRenderClass([
                  "px-1 py-1 rounded text-white text-sm",
                  l.loan_status_id == 1 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-600 hover:bg-slate-700"
                ])}" data-v-faceecad${_scopeId}>${ssrInterpolate(l.loan_status_id == 1 ? "Current" : "Bad")}</button><button disabled class="${ssrRenderClass([
                  "px-1 py-1 rounded text-sm border",
                  l.loan_check_status == 1 ? "text-lime-700 border-lime-600 bg-green-600/20 hover:bg-green-600/30" : "text-yellow-700 border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30"
                ])}" data-v-faceecad${_scopeId}>${ssrInterpolate(l.loan_check_status == 1 ? "Approved" : "Pending")}</button><button class="px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" data-v-faceecad${_scopeId}> Edit </button><button class="px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm" data-v-faceecad${_scopeId}> Delete </button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-faceecad${_scopeId}><td colspan="6" class="text-center py-6 text-gray-400" data-v-faceecad${_scopeId}> No loan records found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div></div>`);
            }
            _push2(`<div class="mt-6 flex items-center justify-between" data-v-faceecad${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50" data-v-faceecad${_scopeId}> Prev </button><span class="text-sm" data-v-faceecad${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)} Total Records: <b data-v-faceecad${_scopeId}>${ssrInterpolate(total.value)}</b></span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50" data-v-faceecad${_scopeId}> Next </button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative" }, [
                (openBlock(), createBlock("svg", {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  })
                ])),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search records...",
                  class: "input !pl-9 text-sm"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ])
              ]),
              unref(errorMsg) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm"
              }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
              unref(successMsg) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm"
              }, toDisplayString(unref(successMsg)), 1)) : createCommentVNode("", true),
              loading.value ? (openBlock(), createBlock("div", {
                key: 2,
                class: "text-center text-gray-400 py-6"
              }, " Loading... ")) : (openBlock(), createBlock("div", {
                key: 3,
                class: "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              }, [
                createVNode("div", { class: "max-w-full overflow-x-auto custom-scrollbar" }, [
                  createVNode("table", { class: "min-w-full" }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "border-b border-gray-200 dark:border-gray-700" }, [
                        createVNode("th", { class: "px-2 py-3 text-left text-sm w-[2%]" }, "#"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[3%]" }, "ID"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[3%]" }, "Loan"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[15%]" }, "Customer"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[10%]" }, "New"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[10%]" }, "Total"),
                        createVNode("th", { class: "px-1 py-3 text-left text-sm w-[12%]" }, "Created/Updated"),
                        createVNode("th", { class: "px-1 py-3 text-center text-sm w-[20%]" }, "Contracts"),
                        createVNode("th", { class: "px-1 py-3 text-center text-sm w-[15%]" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (l, i) => {
                        return openBlock(), createBlock("tr", {
                          key: l.id,
                          class: "hover:bg-blue-300/20 transition"
                        }, [
                          createVNode("td", { class: "px-2 py-1 text-sm text-gray-400" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                          createVNode("td", { class: "px-1 py-1 text-sm" }, toDisplayString(l.id), 1),
                          createVNode("td", { class: "px-1 py-1 text-sm" }, toDisplayString(l?.loantype?.loantype_short ?? ""), 1),
                          createVNode("td", { class: "px-1 py-1 text-sm" }, toDisplayString(l.customer.nametitle1.nametitle_kh) + " " + toDisplayString(l.customer.cust_name_1), 1),
                          createVNode("td", { class: "px-1 py-1 text-sm text-gray-700" }, toDisplayString(unref(formatNumber)(Number(l.loan_newcash || 0))), 1),
                          createVNode("td", { class: "px-1 py-1 text-sm text-gray-700" }, toDisplayString(unref(formatNumber)(Number(l.loan_totalcash || 0))), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm text-gray-400" }, [
                            createVNode("p", { class: "font-semibold" }, toDisplayString(l.createdby.employee.full_name) + " - " + toDisplayString(unref(formatDateForOutput)(new Date(l.created_at))), 1),
                            createVNode("p", { class: "font-semibold" }, toDisplayString(l.updatedby.employee.full_name) + " - " + toDisplayString(unref(formatDateForOutput)(new Date(l.updated_at))), 1)
                          ]),
                          createVNode("td", { class: "px-1 py-1 text-sm text-gray-700" }, [
                            l.count_schedule > 0 ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6"
                            }, [
                              createVNode("a", {
                                href: `/app/dashboard/schedules/prints/${l.id}/print-sched`,
                                target: "_blank",
                                rel: "noopener",
                                class: "px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                              }, " Sched ", 8, ["href"])
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("td", { class: "px-1 py-1 text-sm" }, [
                            createVNode("div", { class: "flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6" }, [
                              createVNode("button", {
                                disabled: "",
                                class: [
                                  "px-1 py-1 rounded text-white text-sm",
                                  l.loan_status_id == 1 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-600 hover:bg-slate-700"
                                ]
                              }, toDisplayString(l.loan_status_id == 1 ? "Current" : "Bad"), 3),
                              createVNode("button", {
                                disabled: "",
                                class: [
                                  "px-1 py-1 rounded text-sm border",
                                  l.loan_check_status == 1 ? "text-lime-700 border-lime-600 bg-green-600/20 hover:bg-green-600/30" : "text-yellow-700 border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30"
                                ]
                              }, toDisplayString(l.loan_check_status == 1 ? "Approved" : "Pending"), 3),
                              createVNode("button", {
                                onClick: ($event) => editLoan(l.id),
                                class: "px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              }, " Edit ", 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => openDeleteModal(l.id),
                                class: "px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                              }, " Delete ", 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "6",
                          class: "text-center py-6 text-gray-400"
                        }, " No loan records found. ")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ])),
              createVNode("div", { class: "mt-6 flex items-center justify-between" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm" }, [
                  createTextVNode(" Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value) + " Total Records: ", 1),
                  createVNode("b", null, toDisplayString(total.value), 1)
                ]),
                createVNode("button", {
                  onClick: nextPage,
                  disabled: page.value === lastPageValue.value,
                  class: "px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-faceecad"]]);

export { index as default };
//# sourceMappingURL=index-CgdDZD0Q.mjs.map
