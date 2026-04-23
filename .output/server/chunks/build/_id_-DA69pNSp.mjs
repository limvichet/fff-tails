import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, withDirectives, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createTextVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { P as PermissionTable } from './PermissionTable-C7T-bJxD.mjs';
import { _ as _export_sfc, h as useRoute } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { errorMsg } = useMessage();
    const route = useRoute();
    route.params.id;
    const loading = ref(false);
    const isReady = ref(false);
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
    const user = ref(null);
    const isHydrating = ref(true);
    const allPermissions = computed(() => {
      return rolePermissionsData.value.flatMap((r) => r.permissions);
    });
    const initializePermissions = () => {
      const all = {};
      rolePermissionsData.value.forEach((role) => {
        role.permissions.forEach((p) => {
          all[p.slug] = 0;
        });
      });
      form.permissions = all;
    };
    const resetPermissions = () => {
      Object.keys(form.permissions).forEach((k) => {
        form.permissions[k] = 0;
      });
    };
    watch(
      [user, rolePermissionsData],
      ([u]) => {
        if (!u || !rolePermissionsData.value.length) return;
        initializePermissions();
        form.emp_id = Number(u.emp_id ?? -1);
        form.role_id = Number(u.roles?.[0]?.id ?? -1);
        form.email = u.email ?? "";
        form.identifier_token = u.identifier_token ?? "";
        form.active = u.active == 1;
        form.password = "";
        const role = rolePermissionsData.value.find(
          (r) => r.id === form.role_id
        );
        role?.permissions.forEach((p) => {
          form.permissions[p.slug] = 1;
        });
        resetPermissions();
        u.permissions?.forEach((p) => {
          form.permissions[p.slug] = 1;
        });
        isHydrating.value = false;
        isReady.value = true;
      },
      { immediate: true }
    );
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto p-4" }, _attrs))} data-v-29893404>`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-4 p-3 bg-red-100 text-red-600 rounded" data-v-29893404>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-2 gap-6" data-v-29893404>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Account" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select class="input" data-v-29893404${_scopeId}><option${ssrRenderAttr("value", -1)} data-v-29893404${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, -1) : ssrLooseEqual(form.emp_id, -1)) ? " selected" : ""}${_scopeId}>Choose</option><!--[-->`);
            ssrRenderList(employees.value, (e) => {
              _push2(`<option${ssrRenderAttr("value", e.id)} data-v-29893404${ssrIncludeBooleanAttr(Array.isArray(form.emp_id) ? ssrLooseContain(form.emp_id, e.id) : ssrLooseEqual(form.emp_id, e.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(e.label)}</option>`);
            });
            _push2(`<!--]--></select><select class="input mt-2" data-v-29893404${_scopeId}><option${ssrRenderAttr("value", -1)} data-v-29893404${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, -1) : ssrLooseEqual(form.role_id, -1)) ? " selected" : ""}${_scopeId}>Choose</option><!--[-->`);
            ssrRenderList(roles.value, (r) => {
              _push2(`<option${ssrRenderAttr("value", r.id)} data-v-29893404${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, r.id) : ssrLooseEqual(form.role_id, r.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
            });
            _push2(`<!--]--></select><input${ssrRenderAttr("value", form.email)} class="input mt-2" placeholder="Email" data-v-29893404${_scopeId}><input${ssrRenderAttr("value", form.password)} class="input mt-2" placeholder="Password" data-v-29893404${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => form.emp_id = $event,
                class: "input"
              }, [
                createVNode("option", { value: -1 }, "Choose"),
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
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => form.role_id = $event,
                onChange: ($event) => applyRolePermissions(form.role_id),
                class: "input mt-2"
              }, [
                createVNode("option", { value: -1 }, "Choose"),
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
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => form.email = $event,
                class: "input mt-2",
                placeholder: "Email"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, form.email]
              ]),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => form.password = $event,
                class: "input mt-2",
                placeholder: "Password"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, form.password]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, { title: "Settings" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input${ssrRenderAttr("value", form.identifier_token)} class="input" placeholder="Token" data-v-29893404${_scopeId}><label class="flex gap-2 mt-3" data-v-29893404${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.active) ? ssrLooseContain(form.active, null) : form.active) ? " checked" : ""} data-v-29893404${_scopeId}> Active </label>`);
          } else {
            return [
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => form.identifier_token = $event,
                class: "input",
                placeholder: "Token"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, form.identifier_token]
              ]),
              createVNode("label", { class: "flex gap-2 mt-3" }, [
                withDirectives(createVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": ($event) => form.active = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelCheckbox, form.active]
                ]),
                createTextVNode(" Active ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(ComponentCard, {
        title: "Permissions",
        class: "mt-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PermissionTable, {
              modelValue: form.permissions,
              "onUpdate:modelValue": ($event) => form.permissions = $event,
              data: unref(allPermissions)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PermissionTable, {
                modelValue: form.permissions,
                "onUpdate:modelValue": ($event) => form.permissions = $event,
                data: unref(allPermissions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "data"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-6 text-right" data-v-29893404><button class="btn-primary" data-v-29893404>${ssrInterpolate(loading.value ? "Saving..." : "Update")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/user-permissions/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-29893404"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DA69pNSp.mjs.map
