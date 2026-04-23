import { defineComponent, ref, computed, watch, withCtx, unref, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { C as ComponentCard, u as useMessage } from './useMessage-Doqk68dv.mjs';
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
import 'vue-router';

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Search roles",
      meta: [{ name: "roles", content: "search roles" }]
    });
    const { errorMsg } = useMessage();
    const roles = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const fetchRoles = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch(
          "/api/admin-secure/roles",
          {
            method: "GET",
            query: {
              page: page.value,
              keyword: searchQuery.value || void 0
            }
          }
        );
        roles.value = res.data.data || [];
        total.value = res.data.total || 0;
        lastPageValue.value = res.data.last_page || 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch roles";
        roles.value = [];
      } finally {
        loading.value = false;
      }
    };
    const paginated = computed(() => roles.value);
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchRoles();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchRoles();
      }
    };
    const nextPage = () => {
      if (page.value < lastPageValue.value) {
        page.value++;
        fetchRoles();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-b28877c3>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Roles" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative mb-4" data-v-b28877c3${_scopeId}><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search roles..." class="input" data-v-b28877c3${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 text-red-400 text-sm" data-v-b28877c3${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center py-6 text-gray-400" data-v-b28877c3${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-x-auto border rounded-xl" data-v-b28877c3${_scopeId}><table class="min-w-full text-sm" data-v-b28877c3${_scopeId}><thead class="bg-gray-100" data-v-b28877c3${_scopeId}><tr data-v-b28877c3${_scopeId}><th class="px-3 py-2 text-left" data-v-b28877c3${_scopeId}>#</th><th class="px-3 py-2 text-left" data-v-b28877c3${_scopeId}>Name</th><th class="px-3 py-2 text-left" data-v-b28877c3${_scopeId}>Slug</th><th class="px-3 py-2 text-left" data-v-b28877c3${_scopeId}>Status</th></tr></thead><tbody data-v-b28877c3${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (r, i) => {
                _push2(`<tr class="border-t hover:bg-gray-50" data-v-b28877c3${_scopeId}><td class="px-3 py-2" data-v-b28877c3${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-3 py-2 font-medium" data-v-b28877c3${_scopeId}>${ssrInterpolate(r.name)}</td><td class="px-3 py-2 text-gray-500" data-v-b28877c3${_scopeId}>${ssrInterpolate(r.slug)}</td><td class="px-3 py-2" data-v-b28877c3${_scopeId}><span class="${ssrRenderClass(r.active ? "text-green-600 font-semibold" : "text-red-500 font-semibold")}" data-v-b28877c3${_scopeId}>${ssrInterpolate(r.active ? "Active" : "Inactive")}</span></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-b28877c3${_scopeId}><td colspan="4" class="text-center py-6 text-gray-400" data-v-b28877c3${_scopeId}> No roles found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            }
            _push2(`<div class="mt-4 flex justify-between items-center" data-v-b28877c3${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-b28877c3${_scopeId}> Prev </button><span class="text-sm text-gray-500" data-v-b28877c3${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)}</span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-b28877c3${_scopeId}> Next </button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative mb-4" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search roles...",
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ])
              ]),
              unref(errorMsg) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 text-red-400 text-sm"
              }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
              loading.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-6 text-gray-400"
              }, " Loading... ")) : (openBlock(), createBlock("div", {
                key: 2,
                class: "overflow-x-auto border rounded-xl"
              }, [
                createVNode("table", { class: "min-w-full text-sm" }, [
                  createVNode("thead", { class: "bg-gray-100" }, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-3 py-2 text-left" }, "#"),
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Name"),
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Slug"),
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Status")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (r, i) => {
                      return openBlock(), createBlock("tr", {
                        key: r.id,
                        class: "border-t hover:bg-gray-50"
                      }, [
                        createVNode("td", { class: "px-3 py-2" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                        createVNode("td", { class: "px-3 py-2 font-medium" }, toDisplayString(r.name), 1),
                        createVNode("td", { class: "px-3 py-2 text-gray-500" }, toDisplayString(r.slug), 1),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("span", {
                            class: r.active ? "text-green-600 font-semibold" : "text-red-500 font-semibold"
                          }, toDisplayString(r.active ? "Active" : "Inactive"), 3)
                        ])
                      ]);
                    }), 128)),
                    paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "4",
                        class: "text-center py-6 text-gray-400"
                      }, " No roles found. ")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ])),
              createVNode("div", { class: "mt-4 flex justify-between items-center" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm text-gray-500" }, " Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value), 1),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/roles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b28877c3"]]);

export { index as default };
//# sourceMappingURL=index-BHEqHAq4.mjs.map
