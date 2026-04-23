import { defineComponent, watch, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PermissionTable",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    data: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    watch(() => props.modelValue, () => {
      emit("update:modelValue", props.modelValue);
    });
    const modules = computed(() => {
      const map = {};
      props.data?.forEach((p) => {
        const parts = p.slug.split("-");
        const module = parts.slice(1).join("-");
        if (!module) return;
        if (!map[module]) {
          map[module] = {
            key: module,
            label: module.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            // ✅ ALWAYS SHOW ALL
            actions: {
              view: true,
              create: true,
              edit: true,
              delete: true
            }
          };
        }
      });
      return Object.values(map);
    });
    watch(() => props.data, () => {
      const updated = { ...props.modelValue };
      const actions = ["view", "create", "edit", "delete"];
      props.data?.forEach((p) => {
        const parts = p.slug.split("-");
        const module = parts.slice(1).join("-");
        actions.forEach((action) => {
          const key = `${action}-${module}`;
          if (updated[key] === void 0) {
            updated[key] = 0;
          }
        });
      });
      emit("update:modelValue", updated);
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto mt-4 rounded-lg border border-gray-200 dark:border-gray-700" }, _attrs))}><table class="w-full text-sm"><thead class="bg-gray-50 dark:bg-gray-800 text-xs uppercase"><tr><th class="px-4 py-3 text-left">Module</th><th class="px-4 py-3 text-center">View</th><th class="px-4 py-3 text-center">Create</th><th class="px-4 py-3 text-center">Edit</th><th class="px-4 py-3 text-center">Delete</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(modules.value, (m) => {
        _push(`<tr class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"><td class="px-4 py-3 font-medium">${ssrInterpolate(m.label)}</td><td class="text-center">`);
        if (m.actions.view) {
          _push(`<input type="checkbox"${ssrIncludeBooleanAttr(props.modelValue[`view-${m.key}`] === 1) ? " checked" : ""} class="w-4 h-4">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="text-center">`);
        if (m.actions.create) {
          _push(`<input type="checkbox"${ssrIncludeBooleanAttr(props.modelValue[`create-${m.key}`] === 1) ? " checked" : ""} class="w-4 h-4">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="text-center">`);
        if (m.actions.edit) {
          _push(`<input type="checkbox"${ssrIncludeBooleanAttr(props.modelValue[`edit-${m.key}`] === 1) ? " checked" : ""} class="w-4 h-4">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="text-center">`);
        if (m.actions.delete) {
          _push(`<input type="checkbox"${ssrIncludeBooleanAttr(props.modelValue[`delete-${m.key}`] === 1) ? " checked" : ""} class="w-4 h-4">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/PermissionTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PermissionTable = Object.assign(_sfc_main, { __name: "FormsPermissionTable" });

export { PermissionTable as P };
//# sourceMappingURL=PermissionTable-C7T-bJxD.mjs.map
