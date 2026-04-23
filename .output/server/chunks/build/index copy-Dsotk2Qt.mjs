import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, resolveDynamicComponent, createBlock, createCommentVNode, withDirectives, openBlock, vModelText, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { useRouter } from 'vue-router';
import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { P as PencilIcon, T as TrashIcon } from './UserSettingIcon-DcesTRPJ.mjs';
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

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index copy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Search customers",
      meta: [{ name: "customers", content: "search customers" }]
    });
    const router = useRouter();
    const { errorMsg, successMsg } = useMessage();
    const isDeleteModal = ref(false);
    const selectedCustomerId = ref(null);
    successMsg.value = null;
    errorMsg.value = null;
    const customers = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const fetchCustomers = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch(
          "/api/admin-secure/customers",
          {
            method: "GET",
            query: {
              page: page.value,
              param: searchQuery.value || void 0
            }
          }
        );
        customers.value = Array.isArray(res.data.data) ? res.data.data : [];
        total.value = res.data.total ?? 0;
        lastPageValue.value = res.data.last_page ?? 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch customers";
        customers.value = [];
        total.value = 0;
        lastPageValue.value = 1;
      } finally {
        loading.value = false;
      }
    };
    const paginated = computed(() => customers.value);
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchCustomers();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchCustomers();
      }
    };
    const nextPage = () => {
      if (page.value < lastPageValue.value) {
        page.value++;
        fetchCustomers();
      }
    };
    const editCustomer = (id) => {
      router.push(`/app/dashboard/customers/${id}`);
    };
    const openDeleteModal = (id) => {
      selectedCustomerId.value = id;
      isDeleteModal.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1" }, _attrs))} data-v-31beb10a><div class="space-y-4" data-v-31beb10a>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Customers" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative" data-v-31beb10a${_scopeId}><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-31beb10a${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" data-v-31beb10a${_scopeId}></path></svg><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search records..." class="input !pl-9" data-v-31beb10a${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-31beb10a${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(successMsg)) {
              _push2(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-31beb10a${_scopeId}>${ssrInterpolate(unref(successMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center text-gray-400 py-6" data-v-31beb10a${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" data-v-31beb10a${_scopeId}><div class="max-w-full overflow-x-auto custom-scrollbar" data-v-31beb10a${_scopeId}><table class="min-w-full" data-v-31beb10a${_scopeId}><thead data-v-31beb10a${_scopeId}><tr class="border-b border-gray-200 dark:border-gray-700" data-v-31beb10a${_scopeId}><th class="px-4 py-2 text-sm font-semibold text-left w-[5%]" data-v-31beb10a${_scopeId}>#</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[40%]" data-v-31beb10a${_scopeId}>Name1</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[40%]" data-v-31beb10a${_scopeId}>Name2</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" data-v-31beb10a${_scopeId}>Phone1</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" data-v-31beb10a${_scopeId}>DOB</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" data-v-31beb10a${_scopeId}>Created</th><th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" data-v-31beb10a${_scopeId}>Updated</th><th class="px-2 py-2 text-sm font-semibold text-center sm:w-[15%] w-[15%]" data-v-31beb10a${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700" data-v-31beb10a${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (c, i) => {
                _push2(`<tr class="border-t border-gray-100 dark:border-gray-800 hover:bg-blue-300/20 transition" data-v-31beb10a${_scopeId}><td class="px-4 py-2 text-sm text-gray-400" data-v-31beb10a${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-1 py-2 text-sm" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.nametitle1?.nametitle_kh)} ${ssrInterpolate(c.cust_name_1)}</td><td class="px-1 py-2 text-sm" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.nametitle2?.nametitle_kh)} ${ssrInterpolate(c.cust_name_2)}</td><td class="px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.cust_phone_1)}</td><td class="px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.cust_dob_1 ? unref(formatDateForOutput)(new Date(c.cust_dob_1)) : "-")}</td><td class="px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" data-v-31beb10a${_scopeId}><span class="font-semibold" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.createdby.employee.full_name)}</span> - ${ssrInterpolate(unref(formatDateForOutput)(new Date(c.created_at)))}</td><td class="px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" data-v-31beb10a${_scopeId}><span class="font-semibold" data-v-31beb10a${_scopeId}>${ssrInterpolate(c.updatedby.employee.full_name)}</span> - ${ssrInterpolate(unref(formatDateForOutput)(new Date(c.updated_at)))}</td><td class="flex items-center justify-end gap-1 px-1 py-2" data-v-31beb10a${_scopeId}><div class="flex flex-wrap items-center justify-left gap-1 py-1" data-v-31beb10a${_scopeId}><button class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" data-v-31beb10a${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(PencilIcon)), { class: "w-4 h-4" }, null), _parent2, _scopeId);
                _push2(`<span data-v-31beb10a${_scopeId}>Edit</span></button><button class="inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm" data-v-31beb10a${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(TrashIcon)), { class: "w-4 h-4" }, null), _parent2, _scopeId);
                _push2(` Delete </button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-31beb10a${_scopeId}><td colspan="5" class="text-center py-6 text-gray-400" data-v-31beb10a${_scopeId}> No customers found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div></div>`);
            }
            _push2(`<div class="mt-6 flex items-center justify-between" data-v-31beb10a${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition cursor-pointer" data-v-31beb10a${_scopeId}> Prev </button><span class="text-sm text-blue-400" data-v-31beb10a${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)}</span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition" data-v-31beb10a${_scopeId}> Next </button></div>`);
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
                  class: "input !pl-9"
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
                        createVNode("th", { class: "px-4 py-2 text-sm font-semibold text-left w-[5%]" }, "#"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[40%]" }, "Name1"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[40%]" }, "Name2"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" }, "Phone1"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" }, "DOB"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" }, "Created"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[20%] hidden sm:table-cell" }, "Updated"),
                        createVNode("th", { class: "px-2 py-2 text-sm font-semibold text-center sm:w-[15%] w-[15%]" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (c, i) => {
                        return openBlock(), createBlock("tr", {
                          key: c.id,
                          class: "border-t border-gray-100 dark:border-gray-800 hover:bg-blue-300/20 transition"
                        }, [
                          createVNode("td", { class: "px-4 py-2 text-sm text-gray-400" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm" }, toDisplayString(c.nametitle1?.nametitle_kh) + " " + toDisplayString(c.cust_name_1), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm" }, toDisplayString(c.nametitle2?.nametitle_kh) + " " + toDisplayString(c.cust_name_2), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" }, toDisplayString(c.cust_phone_1), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" }, toDisplayString(c.cust_dob_1 ? unref(formatDateForOutput)(new Date(c.cust_dob_1)) : "-"), 1),
                          createVNode("td", { class: "px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" }, [
                            createVNode("span", { class: "font-semibold" }, toDisplayString(c.createdby.employee.full_name), 1),
                            createTextVNode(" - " + toDisplayString(unref(formatDateForOutput)(new Date(c.created_at))), 1)
                          ]),
                          createVNode("td", { class: "px-1 py-2 text-sm text-gray-400 hidden sm:table-cell" }, [
                            createVNode("span", { class: "font-semibold" }, toDisplayString(c.updatedby.employee.full_name), 1),
                            createTextVNode(" - " + toDisplayString(unref(formatDateForOutput)(new Date(c.updated_at))), 1)
                          ]),
                          createVNode("td", { class: "flex items-center justify-end gap-1 px-1 py-2" }, [
                            createVNode("div", { class: "flex flex-wrap items-center justify-left gap-1 py-1" }, [
                              createVNode("button", {
                                onClick: ($event) => editCustomer(c.id),
                                class: "inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              }, [
                                (openBlock(), createBlock(resolveDynamicComponent(unref(PencilIcon)), { class: "w-4 h-4" })),
                                createVNode("span", null, "Edit")
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => openDeleteModal(c.id),
                                class: "inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                              }, [
                                (openBlock(), createBlock(resolveDynamicComponent(unref(TrashIcon)), { class: "w-4 h-4" })),
                                createTextVNode(" Delete ")
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-center py-6 text-gray-400"
                        }, " No customers found. ")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ])),
              createVNode("div", { class: "mt-6 flex items-center justify-between" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition cursor-pointer"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm text-blue-400" }, " Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value), 1),
                createVNode("button", {
                  onClick: nextPage,
                  disabled: page.value === lastPageValue.value,
                  class: "px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition"
                }, " Next ", 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isDeleteModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-50" data-v-31beb10a><div class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[1px]" aria-hidden="false" data-v-31beb10a></div><div class="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6" data-v-31beb10a><button class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-blue-200 hover:text-blue-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300" data-v-31beb10a><svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-31beb10a><path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill="" data-v-31beb10a></path></svg></button><div class="px-2" data-v-31beb10a><h6 class="mb-2 text-2xl font-semibold" data-v-31beb10a> Delete Customer </h6><p class="mb-3 text-sm text-gray-500" data-v-31beb10a> Are you sure you want to delete this customer? </p></div><form class="flex flex-col" data-v-31beb10a><div class="flex items-center gap-3 mt-6 lg:justify-end" data-v-31beb10a><button type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto" data-v-31beb10a> Cancel </button><button type="button" class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 sm:w-auto" data-v-31beb10a> Delete Customer </button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/customers/index copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-31beb10a"]]);

export { index_copy as default };
//# sourceMappingURL=index copy-Dsotk2Qt.mjs.map
