import { defineComponent, ref, watch, computed, withCtx, unref, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
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
      title: "User Permissions"
    });
    const { errorMsg } = useMessage();
    const users = ref([]);
    const loading = ref(false);
    const page = ref(1);
    const lastPage = ref(1);
    const total = ref(0);
    const searchInput = ref("");
    const searchQuery = ref("");
    const fetchUsers = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch("/api/admin-secure/user-permissions", {
          method: "GET",
          query: {
            page: page.value,
            param: searchQuery.value || void 0
          }
        });
        users.value = res.data.data || [];
        lastPage.value = res.data.last_page;
        total.value = res.data.total;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch users";
        users.value = [];
      } finally {
        loading.value = false;
      }
    };
    let debounce = null;
    watch(searchInput, (val) => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchUsers();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchUsers();
      }
    };
    const nextPage = () => {
      if (page.value < lastPage.value) {
        page.value++;
        fetchUsers();
      }
    };
    const paginated = computed(() => users.value);
    const getStatusClass = (active) => {
      return active === 1 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-5fdb045c>`);
      _push(ssrRenderComponent(ComponentCard, { title: "User Permissions" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative mb-4" data-v-5fdb045c${_scopeId}><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search by name or role..." class="input" data-v-5fdb045c${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 text-red-400 text-sm" data-v-5fdb045c${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center py-6 text-gray-400" data-v-5fdb045c${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-x-auto border rounded-xl" data-v-5fdb045c${_scopeId}><table class="min-w-full text-sm" data-v-5fdb045c${_scopeId}><thead class="bg-gray-100" data-v-5fdb045c${_scopeId}><tr data-v-5fdb045c${_scopeId}><th class="px-3 py-2 text-left" data-v-5fdb045c${_scopeId}>#</th><th class="px-3 py-2 text-left" data-v-5fdb045c${_scopeId}>Employee</th><th class="px-3 py-2 text-left" data-v-5fdb045c${_scopeId}>Role</th><th class="px-3 py-2 text-left" data-v-5fdb045c${_scopeId}>Status</th></tr></thead><tbody data-v-5fdb045c${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (u, i) => {
                _push2(`<tr class="border-t hover:bg-blue-50" data-v-5fdb045c${_scopeId}><td class="px-3 py-2" data-v-5fdb045c${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-3 py-2 font-medium" data-v-5fdb045c${_scopeId}>${ssrInterpolate(u.full_name)}</td><td class="px-3 py-2" data-v-5fdb045c${_scopeId}>${ssrInterpolate(u.role_name)}</td><td class="px-3 py-2" data-v-5fdb045c${_scopeId}><span class="${ssrRenderClass([getStatusClass(u.active), "px-2 py-1 rounded text-xs font-semibold"])}" data-v-5fdb045c${_scopeId}>${ssrInterpolate(u.active === 1 ? "Active" : "Inactive")}</span></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-5fdb045c${_scopeId}><td colspan="4" class="text-center py-6 text-gray-400" data-v-5fdb045c${_scopeId}> No data found </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            }
            _push2(`<div class="flex justify-between items-center mt-4" data-v-5fdb045c${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-5fdb045c${_scopeId}> Prev </button><span class="text-sm" data-v-5fdb045c${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPage.value)}</span><button${ssrIncludeBooleanAttr(page.value === lastPage.value) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-5fdb045c${_scopeId}> Next </button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative mb-4" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search by name or role...",
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
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Employee"),
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Role"),
                      createVNode("th", { class: "px-3 py-2 text-left" }, "Status")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (u, i) => {
                      return openBlock(), createBlock("tr", {
                        key: u.id,
                        class: "border-t hover:bg-blue-50"
                      }, [
                        createVNode("td", { class: "px-3 py-2" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                        createVNode("td", { class: "px-3 py-2 font-medium" }, toDisplayString(u.full_name), 1),
                        createVNode("td", { class: "px-3 py-2" }, toDisplayString(u.role_name), 1),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("span", {
                            class: ["px-2 py-1 rounded text-xs font-semibold", getStatusClass(u.active)]
                          }, toDisplayString(u.active === 1 ? "Active" : "Inactive"), 3)
                        ])
                      ]);
                    }), 128)),
                    paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "4",
                        class: "text-center py-6 text-gray-400"
                      }, " No data found ")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ])),
              createVNode("div", { class: "flex justify-between items-center mt-4" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm" }, " Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPage.value), 1),
                createVNode("button", {
                  onClick: nextPage,
                  disabled: page.value === lastPage.value,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/user-permissions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5fdb045c"]]);

export { index as default };
//# sourceMappingURL=index-BbNEIKtC.mjs.map
