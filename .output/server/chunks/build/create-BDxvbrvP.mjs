import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, withCtx, createVNode, withDirectives, createBlock, openBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createTextVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { P as PermissionTable } from './PermissionTable-C7T-bJxD.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Create User"
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
    const allRolePermissions = computed(() => {
      return rolePermissionsData.value.flatMap((role) => role.permissions);
    });
    const schema = z.object({
      emp_id: z.number().min(1, "Please select an employee"),
      role_id: z.number().min(1, "Please select a role"),
      email: z.string().email("Invalid email address"),
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
    const applyRolePermissions = (roleId) => {
      if (!rolePermissionsData.value.length) return;
      if (roleId === -1) return;
      Object.keys(form.permissions).forEach((k) => {
        form.permissions[k] = 0;
      });
      const role = rolePermissionsData.value.find((r) => r.id === roleId);
      role?.permissions.forEach((p) => {
        form.permissions[p.slug] = 1;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto p-4" }, _attrs))} data-v-39d3c296>`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-4 p-3 bg-red-100 text-red-600 rounded" data-v-39d3c296>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-39d3c296>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Account Credentials" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3" data-v-39d3c296${_scopeId}><select class="input" data-v-39d3c296${_scopeId}><option${ssrRenderAttr("value", -1)} data-v-39d3c296${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, -1) : ssrLooseEqual(form.emp_id, -1)) ? " selected" : ""}${_scopeId}>Choose Employee</option><!--[-->`);
            ssrRenderList(employees.value, (e) => {
              _push2(`<option${ssrRenderAttr("value", e.id)} data-v-39d3c296${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, e.id) : ssrLooseEqual(form.emp_id, e.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(e.label)}</option>`);
            });
            _push2(`<!--]--></select><p class="error" data-v-39d3c296${_scopeId}>${ssrInterpolate(errors.emp_id)}</p><select class="input" data-v-39d3c296${_scopeId}><option${ssrRenderAttr("value", -1)} data-v-39d3c296${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, -1) : ssrLooseEqual(form.role_id, -1)) ? " selected" : ""}${_scopeId}>Choose Role</option><!--[-->`);
            ssrRenderList(roles.value, (r) => {
              _push2(`<option${ssrRenderAttr("value", r.id)} data-v-39d3c296${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, r.id) : ssrLooseEqual(form.role_id, r.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
            });
            _push2(`<!--]--></select><p class="error" data-v-39d3c296${_scopeId}>${ssrInterpolate(errors.role_id)}</p><input${ssrRenderAttr("value", form.email)} class="input" placeholder="Email" data-v-39d3c296${_scopeId}><p class="error" data-v-39d3c296${_scopeId}>${ssrInterpolate(errors.email)}</p><input type="password"${ssrRenderAttr("value", form.password)} class="input" placeholder="Password" data-v-39d3c296${_scopeId}><p class="error" data-v-39d3c296${_scopeId}>${ssrInterpolate(errors.password)}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.emp_id = $event,
                  class: "input"
                }, [
                  createVNode("option", { value: -1 }, "Choose Employee"),
                  (openBlock(true), createBlock(Fragment, null, renderList(employees.value, (e) => {
                    return openBlock(), createBlock("option", {
                      key: e.id,
                      value: e.id
                    }, toDisplayString(e.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [
                    vModelSelect,
                    form.emp_id,
                    void 0,
                    { number: true }
                  ]
                ]),
                createVNode("p", { class: "error" }, toDisplayString(errors.emp_id), 1),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.role_id = $event,
                  class: "input",
                  onChange: ($event) => applyRolePermissions(form.role_id)
                }, [
                  createVNode("option", { value: -1 }, "Choose Role"),
                  (openBlock(true), createBlock(Fragment, null, renderList(roles.value, (r) => {
                    return openBlock(), createBlock("option", {
                      key: r.id,
                      value: r.id
                    }, toDisplayString(r.label), 9, ["value"]);
                  }), 128))
                ], 40, ["onUpdate:modelValue", "onChange"]), [
                  [
                    vModelSelect,
                    form.role_id,
                    void 0,
                    { number: true }
                  ]
                ]),
                createVNode("p", { class: "error" }, toDisplayString(errors.role_id), 1),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => form.email = $event,
                  class: "input",
                  placeholder: "Email"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.email]
                ]),
                createVNode("p", { class: "error" }, toDisplayString(errors.email), 1),
                withDirectives(createVNode("input", {
                  type: "password",
                  "onUpdate:modelValue": ($event) => form.password = $event,
                  class: "input",
                  placeholder: "Password"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.password]
                ]),
                createVNode("p", { class: "error" }, toDisplayString(errors.password), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, { title: "Settings" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3" data-v-39d3c296${_scopeId}><input${ssrRenderAttr("value", form.identifier_token)} class="input" placeholder="Token" data-v-39d3c296${_scopeId}><label class="flex gap-2" data-v-39d3c296${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.active) ? ssrLooseContain(form.active, null) : form.active) ? " checked" : ""} data-v-39d3c296${_scopeId}> Active </label></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => form.identifier_token = $event,
                  class: "input",
                  placeholder: "Token"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.identifier_token]
                ]),
                createVNode("label", { class: "flex gap-2" }, [
                  withDirectives(createVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": ($event) => form.active = $event
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelCheckbox, form.active]
                  ]),
                  createTextVNode(" Active ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6" data-v-39d3c296>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Permissions" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PermissionTable, {
              modelValue: form.permissions,
              "onUpdate:modelValue": ($event) => form.permissions = $event,
              data: unref(allRolePermissions)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PermissionTable, {
                modelValue: form.permissions,
                "onUpdate:modelValue": ($event) => form.permissions = $event,
                data: unref(allRolePermissions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "data"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6 text-right" data-v-39d3c296><button class="btn-primary" data-v-39d3c296>${ssrInterpolate(loading.value ? "Saving..." : "Save User")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/user-permissions/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-39d3c296"]]);

export { create as default };
//# sourceMappingURL=create-BDxvbrvP.mjs.map
