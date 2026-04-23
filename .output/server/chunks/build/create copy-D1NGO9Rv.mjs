import __nuxt_component_0 from './index-BUfmGtf9.mjs';
import { defineComponent, reactive, ref, watch, mergeProps, unref, withCtx, createVNode, withDirectives, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, vModelSelect, vModelText, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { P as PermissionTable } from './PermissionTable-C7T-bJxD.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import './asyncData-CQK02fck.mjs';
import 'perfect-debounce';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'unhead';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create copy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Create User",
      meta: [{ name: "user-permissions", content: "create user permissions" }]
    });
    const { errorMsg } = useMessage();
    const errors = reactive({});
    const loading = ref(false);
    const form = reactive({
      emp_id: -1,
      role_id: -1,
      email: "",
      password: "",
      active: true,
      identifier_token: "",
      permissions: {}
    });
    const employees = ref([]);
    const roles = ref([]);
    const rolePermissionsData = ref([]);
    const schema = z.object({
      emp_id: z.number().min(1, "Please select an employee"),
      role_id: z.number().min(1, "Please select a role"),
      email: z.string().email("Invalid email address").min(1, "Required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      active: z.boolean(),
      identifier_token: z.string().optional(),
      permissions: z.record(z.string(), z.number()).optional()
    });
    const validateField = (field) => {
      try {
        const part = schema.pick({ [field]: true });
        part.parse({ [field]: form[field] });
        errors[field] = "";
      } catch (err) {
        errors[field] = err.errors?.[0]?.message || "";
      }
    };
    watch(() => form.email, () => validateField("email"));
    watch(() => form.password, () => validateField("password"));
    watch(() => form.emp_id, () => validateField("emp_id"));
    watch(() => form.role_id, () => validateField("role_id"));
    watch(() => form.role_id, (newRoleId) => {
      if (newRoleId === -1) return;
      Object.keys(form.permissions).forEach((key) => {
        form.permissions[key] = 0;
      });
      const selectedRole = rolePermissionsData.value.find((r) => r.id === newRoleId);
      if (selectedRole) {
        selectedRole.permissions.forEach((p) => {
          form.permissions[p.slug] = 1;
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto p-4" }, _attrs))} data-v-7a11f091>`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-7a11f091>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-7a11f091>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Account Credentials" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7a11f091${_scopeId}><div class="flex items-center justify-between" data-v-7a11f091${_scopeId}><label class="label" data-v-7a11f091${_scopeId}>Employee Name<span class="text-red-500" data-v-7a11f091${_scopeId}>*</span></label><span class="text-red-500 text-sm" data-v-7a11f091${_scopeId}>${ssrInterpolate(errors.emp_id)}</span></div><select class="input" data-v-7a11f091${_scopeId}><option value="-1" disabled data-v-7a11f091${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, "-1") : ssrLooseEqual(form.emp_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
            ssrRenderList(employees.value, (emp) => {
              _push2(`<option${ssrRenderAttr("value", emp.id)} data-v-7a11f091${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, emp.id) : ssrLooseEqual(form.emp_id, emp.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(emp.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-7a11f091${_scopeId}><div class="flex items-center justify-between" data-v-7a11f091${_scopeId}><label class="label" data-v-7a11f091${_scopeId}>System Role<span class="text-red-500" data-v-7a11f091${_scopeId}>*</span></label><span class="text-red-500 text-sm" data-v-7a11f091${_scopeId}>${ssrInterpolate(errors.role_id)}</span></div><select class="input" data-v-7a11f091${_scopeId}><option value="-1" disabled data-v-7a11f091${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, "-1") : ssrLooseEqual(form.role_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
            ssrRenderList(roles.value, (role) => {
              _push2(`<option${ssrRenderAttr("value", role.id)} data-v-7a11f091${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, role.id) : ssrLooseEqual(form.role_id, role.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(role.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-7a11f091${_scopeId}><div class="flex items-center justify-between" data-v-7a11f091${_scopeId}><label class="label" data-v-7a11f091${_scopeId}>Email Address<span class="text-red-500" data-v-7a11f091${_scopeId}>*</span></label><span class="text-red-500 text-sm" data-v-7a11f091${_scopeId}>${ssrInterpolate(errors.email)}</span></div><input type="email"${ssrRenderAttr("value", form.email)} class="input" placeholder="user@example.com" data-v-7a11f091${_scopeId}></div><div data-v-7a11f091${_scopeId}><div class="flex items-center justify-between" data-v-7a11f091${_scopeId}><label class="label" data-v-7a11f091${_scopeId}>Password<span class="text-red-500" data-v-7a11f091${_scopeId}>*</span></label><span class="text-red-500 text-sm" data-v-7a11f091${_scopeId}>${ssrInterpolate(errors.password)}</span></div><input type="password"${ssrRenderAttr("value", form.password)} class="input" data-v-7a11f091${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Employee Name"),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.emp_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.emp_id = $event,
                  class: "input"
                }, [
                  createVNode("option", {
                    value: "-1",
                    disabled: ""
                  }, "Choose ..."),
                  (openBlock(true), createBlock(Fragment, null, renderList(employees.value, (emp) => {
                    return openBlock(), createBlock("option", {
                      key: emp.id,
                      value: emp.id
                    }, toDisplayString(emp.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [
                    vModelSelect,
                    form.emp_id,
                    void 0,
                    { number: true }
                  ]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("System Role"),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.role_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.role_id = $event,
                  class: "input"
                }, [
                  createVNode("option", {
                    value: "-1",
                    disabled: ""
                  }, "Choose ..."),
                  (openBlock(true), createBlock(Fragment, null, renderList(roles.value, (role) => {
                    return openBlock(), createBlock("option", {
                      key: role.id,
                      value: role.id
                    }, toDisplayString(role.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [
                    vModelSelect,
                    form.role_id,
                    void 0,
                    { number: true }
                  ]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Email Address"),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.email), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "email",
                  "onUpdate:modelValue": ($event) => form.email = $event,
                  class: "input",
                  placeholder: "user@example.com"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.email]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Password"),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.password), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "password",
                  "onUpdate:modelValue": ($event) => form.password = $event,
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.password]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, { title: "Settings & Identity" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7a11f091${_scopeId}><label class="label" data-v-7a11f091${_scopeId}>Identifier Token</label><input type="text"${ssrRenderAttr("value", form.identifier_token)} class="input" data-v-7a11f091${_scopeId}></div><div class="flex items-center gap-2 mt-6" data-v-7a11f091${_scopeId}><input type="checkbox" id="user_active"${ssrIncludeBooleanAttr(Array.isArray(form.active) ? ssrLooseContain(form.active, null) : form.active) ? " checked" : ""} class="w-4 h-4 text-blue-600" data-v-7a11f091${_scopeId}><label for="user_active" class="label !mb-0" data-v-7a11f091${_scopeId}>Active Account</label></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Identifier Token"),
                withDirectives(createVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": ($event) => form.identifier_token = $event,
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.identifier_token]
                ])
              ]),
              createVNode("div", { class: "flex items-center gap-2 mt-6" }, [
                withDirectives(createVNode("input", {
                  type: "checkbox",
                  id: "user_active",
                  "onUpdate:modelValue": ($event) => form.active = $event,
                  class: "w-4 h-4 text-blue-600"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelCheckbox, form.active]
                ]),
                createVNode("label", {
                  for: "user_active",
                  class: "label !mb-0"
                }, "Active Account")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="col-span-full" data-v-7a11f091>`);
      _push(ssrRenderComponent(ComponentCard, { title: "6. User Permissions" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PermissionTable, {
              modelValue: form.permissions,
              "onUpdate:modelValue": ($event) => form.permissions = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PermissionTable, {
                modelValue: form.permissions,
                "onUpdate:modelValue": ($event) => form.permissions = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6 flex justify-end gap-3" data-v-7a11f091><button class="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition" data-v-7a11f091> Cancel </button><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2" data-v-7a11f091>`);
      if (loading.value) {
        _push(ssrRenderComponent(_component_Icon, { name: "svg-spinners:180-ring-with-bg" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Saving..." : "Save User")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/user-permissions/create copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7a11f091"]]);

export { create_copy as default };
//# sourceMappingURL=create copy-D1NGO9Rv.mjs.map
