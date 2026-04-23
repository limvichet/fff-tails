import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ComponentCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    className: {},
    desc: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]",
          __props.className
        ]
      }, _attrs))}><div class="px-6 py-2"><h3 class="text-base font-medium text-blue-900 dark:text-white/90">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.desc) {
        _push(`<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(__props.desc)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-6"><div class="space-y-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/ComponentCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ComponentCard = Object.assign(_sfc_main, { __name: "CommonComponentCard" });
const successMsg = ref(null);
const errorMsg = ref(null);
let successTimer = null;
let errorTimer = null;
const useMessage = () => {
  const success = (message, duration = 3e3) => {
    successMsg.value = message;
    if (successTimer) clearTimeout(successTimer);
    successTimer = setTimeout(() => {
      successMsg.value = null;
    }, duration);
  };
  const error = (message, duration = 4e3) => {
    errorMsg.value = message;
    if (errorTimer) clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
      errorMsg.value = null;
    }, duration);
  };
  return {
    successMsg,
    errorMsg,
    success,
    error
  };
};

export { ComponentCard as C, useMessage as u };
//# sourceMappingURL=useMessage-Doqk68dv.mjs.map
