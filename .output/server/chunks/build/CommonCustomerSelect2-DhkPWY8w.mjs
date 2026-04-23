import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CommonCustomerSelect2",
  __ssrInlineRender: true,
  props: {
    label: {},
    modelValue: {},
    required: { type: Boolean },
    error: {},
    options: { default: () => [] }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const search = ref("");
    const isOpen = ref(false);
    const highlightedIndex = ref(0);
    const filtered = computed(() => {
      let list = props.options;
      if (search.value) {
        const term = search.value.toLowerCase();
        list = list.filter(
          (c) => String(c.id).includes(term) || c.label.toLowerCase().includes(term)
        );
      }
      return [...list].sort((a, b) => b.id - a.id);
    });
    watch(() => props.modelValue, (val) => {
      const selected = props.options.find((c) => c.id === val);
      if (selected) search.value = selected.label;
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative select-container" }, _attrs))} data-v-e410888b><div class="flex items-center justify-between" data-v-e410888b><label class="label" data-v-e410888b>${ssrInterpolate(__props.label)} `);
      if (__props.required) {
        _push(`<span class="text-red-500 text-sm" data-v-e410888b> *</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><span class="text-red-500 text-sm" data-v-e410888b>${ssrInterpolate(__props.error)}</span></div><select${ssrRenderAttr("value", __props.modelValue)} class="input w-full" data-v-e410888b><option disabled value="-1" class="hidden" data-v-e410888b>Choose ...</option><!--[-->`);
      ssrRenderList(__props.options, (c) => {
        _push(`<option${ssrRenderAttr("value", c.id)} class="hidden" data-v-e410888b>${ssrInterpolate(c.label)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (unref(isOpen)) {
        _push(`<div class="absolute z-10 w-full mt-1" data-v-e410888b><input type="text"${ssrRenderAttr("value", unref(search))} placeholder="Search..." class="input w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" data-v-e410888b>`);
        if (unref(isOpen) && unref(filtered).length) {
          _push(`<ul class="absolute z-10 w-full bg-white border rounded text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 max-h-60 overflow-y-auto" data-v-e410888b><!--[-->`);
          ssrRenderList(unref(filtered), (c, index) => {
            _push(`<li class="${ssrRenderClass([
              "px-3 py-1 cursor-pointer text-[14px]",
              index === unref(highlightedIndex) ? "bg-blue-500 text-white" : ""
            ])}" data-v-e410888b>${ssrInterpolate(c.id)} - ${ssrInterpolate(c.label)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/CommonCustomerSelect2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CommonCustomerSelect2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-e410888b"]]), { __name: "CommonCustomerSelect2" });

export { CommonCustomerSelect2 as C };
//# sourceMappingURL=CommonCustomerSelect2-DhkPWY8w.mjs.map
