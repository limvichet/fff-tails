import { defineComponent, ref, watch, mergeProps, withCtx, unref, createVNode, resolveDynamicComponent, createBlock, createCommentVNode, withDirectives, openBlock, vModelText, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { C as ComponentCard, u as useMessage } from './useMessage-Doqk68dv.mjs';
import { useRouter } from 'vue-router';
import { P as PencilIcon, T as TrashIcon } from './UserSettingIcon-DcesTRPJ.mjs';
import { u as useHead } from './server.mjs';
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
      title: "Search Employees",
      meta: [{ name: "loanrecords", content: "search employees" }]
    });
    const router = useRouter();
    const { errorMsg, successMsg } = useMessage();
    const isDeleteModal = ref(false);
    const selectedEmployeeId = ref(null);
    const employees = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const fetchEmployees = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch("/api/admin-secure/employees", {
          method: "GET",
          query: {
            page: page.value,
            param: searchQuery.value || void 0
          }
        });
        employees.value = res.data.data || [];
        total.value = res.data.total || 0;
        lastPageValue.value = res.data.last_page || 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch employees";
        employees.value = [];
      } finally {
        loading.value = false;
      }
    };
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchEmployees();
      }, 400);
    });
    const changePage = (p) => {
      page.value = p;
      fetchEmployees();
    };
    const editEmployee = (id) => router.push(`/app/dashboard/employees/${id}`);
    const openDeleteModal = (id) => {
      selectedEmployeeId.value = id;
      isDeleteModal.value = true;
    };
    function formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleDateString("en-GB");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1" }, _attrs))}><div class="space-y-4">`);
      _push(ssrRenderComponent(ComponentCard, { title: "Employee Directory" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative mb-4"${_scopeId}><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"${_scopeId}></path></svg><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search by name, phone or position..." class="input !pl-9"${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-red-500/10 text-red-500 text-sm border border-red-500/20"${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(successMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20"${_scopeId}>${ssrInterpolate(unref(successMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"${_scopeId}><div class="max-w-full overflow-x-auto custom-scrollbar"${_scopeId}><table class="min-w-full"${_scopeId}><thead${_scopeId}><tr class="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-gray-700 text-left"${_scopeId}><th class="px-4 py-3 text-xs font-bold uppercase w-[5%]"${_scopeId}>#</th><th class="px-2 py-3 text-xs font-bold uppercase sm:w-[20%] w-[40%]"${_scopeId}>Full Name</th><th class="px-2 py-3 text-xs font-bold uppercase sm:w-[15%] hidden sm:table-cell"${_scopeId}>Position</th><th class="px-2 py-3 text-xs font-bold uppercase sm:w-[15%] w-[30%] text-center"${_scopeId}>Phone</th><th class="px-2 py-3 text-xs font-bold uppercase sm:w-[15%] hidden lg:table-cell"${_scopeId}>Hire Date</th><th class="px-2 py-3 text-xs font-bold uppercase text-right"${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
            ssrRenderList(employees.value, (emp, index) => {
              _push2(`<tr class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition"${_scopeId}><td class="px-4 py-3 text-sm text-gray-500"${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + index + 1)}</td><td class="px-2 py-3 text-sm font-medium"${_scopeId}>${ssrInterpolate(emp.surname)} ${ssrInterpolate(emp.first_name)}</td><td class="px-2 py-3 text-sm hidden sm:table-cell"${_scopeId}><span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(emp.role?.name_kh || "N/A")}</span></td><td class="px-2 py-3 text-sm text-center font-mono"${_scopeId}>${ssrInterpolate(emp.phone)}</td><td class="px-2 py-3 text-sm hidden lg:table-cell text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(emp.hire_date))}</td><td class="px-4 py-3"${_scopeId}><div class="flex justify-end gap-2"${_scopeId}><button class="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(PencilIcon)), { class: "w-4 h-4" }, null), _parent2, _scopeId);
              _push2(`</button><button class="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(TrashIcon)), { class: "w-4 h-4" }, null), _parent2, _scopeId);
              _push2(`</button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!loading.value && employees.value.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="text-center py-10 text-gray-400 italic"${_scopeId}>No employees found in the system.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-6 flex items-center justify-between"${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="btn-pagination"${_scopeId}>Prev</button><span class="text-sm font-medium text-blue-500"${_scopeId}>Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)}</span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="btn-pagination"${_scopeId}>Next</button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative mb-4" }, [
                (openBlock(), createBlock("svg", {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  })
                ])),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search by name, phone or position...",
                  class: "input !pl-9"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ])
              ]),
              unref(errorMsg) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 p-2 rounded bg-red-500/10 text-red-500 text-sm border border-red-500/20"
              }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
              unref(successMsg) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mb-3 p-2 rounded bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20"
              }, toDisplayString(unref(successMsg)), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800" }, [
                createVNode("div", { class: "max-w-full overflow-x-auto custom-scrollbar" }, [
                  createVNode("table", { class: "min-w-full" }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-gray-700 text-left" }, [
                        createVNode("th", { class: "px-4 py-3 text-xs font-bold uppercase w-[5%]" }, "#"),
                        createVNode("th", { class: "px-2 py-3 text-xs font-bold uppercase sm:w-[20%] w-[40%]" }, "Full Name"),
                        createVNode("th", { class: "px-2 py-3 text-xs font-bold uppercase sm:w-[15%] hidden sm:table-cell" }, "Position"),
                        createVNode("th", { class: "px-2 py-3 text-xs font-bold uppercase sm:w-[15%] w-[30%] text-center" }, "Phone"),
                        createVNode("th", { class: "px-2 py-3 text-xs font-bold uppercase sm:w-[15%] hidden lg:table-cell" }, "Hire Date"),
                        createVNode("th", { class: "px-2 py-3 text-xs font-bold uppercase text-right" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(employees.value, (emp, index) => {
                        return openBlock(), createBlock("tr", {
                          key: emp.id,
                          class: "hover:bg-blue-50 dark:hover:bg-blue-900/10 transition"
                        }, [
                          createVNode("td", { class: "px-4 py-3 text-sm text-gray-500" }, toDisplayString((page.value - 1) * perPage + index + 1), 1),
                          createVNode("td", { class: "px-2 py-3 text-sm font-medium" }, toDisplayString(emp.surname) + " " + toDisplayString(emp.first_name), 1),
                          createVNode("td", { class: "px-2 py-3 text-sm hidden sm:table-cell" }, [
                            createVNode("span", { class: "px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300" }, toDisplayString(emp.role?.name_kh || "N/A"), 1)
                          ]),
                          createVNode("td", { class: "px-2 py-3 text-sm text-center font-mono" }, toDisplayString(emp.phone), 1),
                          createVNode("td", { class: "px-2 py-3 text-sm hidden lg:table-cell text-gray-500" }, toDisplayString(formatDate(emp.hire_date)), 1),
                          createVNode("td", { class: "px-4 py-3" }, [
                            createVNode("div", { class: "flex justify-end gap-2" }, [
                              createVNode("button", {
                                onClick: ($event) => editEmployee(emp.id),
                                class: "p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                              }, [
                                (openBlock(), createBlock(resolveDynamicComponent(unref(PencilIcon)), { class: "w-4 h-4" }))
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => openDeleteModal(emp.id),
                                class: "p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition"
                              }, [
                                (openBlock(), createBlock(resolveDynamicComponent(unref(TrashIcon)), { class: "w-4 h-4" }))
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      !loading.value && employees.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "6",
                          class: "text-center py-10 text-gray-400 italic"
                        }, "No employees found in the system.")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-6 flex items-center justify-between" }, [
                createVNode("button", {
                  onClick: ($event) => changePage(page.value - 1),
                  disabled: page.value === 1,
                  class: "btn-pagination"
                }, "Prev", 8, ["onClick", "disabled"]),
                createVNode("span", { class: "text-sm font-medium text-blue-500" }, "Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value), 1),
                createVNode("button", {
                  onClick: ($event) => changePage(page.value + 1),
                  disabled: page.value === lastPageValue.value,
                  class: "btn-pagination"
                }, "Next", 8, ["onClick", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isDeleteModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4"><div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div><div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl"><h3 class="text-xl font-bold mb-2">Confirm Removal</h3><p class="text-gray-500 text-sm mb-6">Are you sure you want to remove this employee from the directory? This action cannot be undone.</p><div class="flex justify-end gap-3"><button class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700">Cancel</button><button class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Delete Permanently</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/employees/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DUAeAO6k.mjs.map
