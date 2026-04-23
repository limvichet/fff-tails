import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ComponentGrowCard",
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
          "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col h-full",
          __props.className
        ]
      }, _attrs))}><div class="px-6 py-2"><h3 class="text-base font-medium text-blue-900 dark:text-white/90">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.desc) {
        _push(`<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(__props.desc)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-6 flex-1 flex flex-col"><div class="space-y-5 flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><div class="mt-auto flex justify-end space-x-2 pt-5">`);
      ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/ComponentGrowCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ComponentGrowCard = Object.assign(_sfc_main, { __name: "CommonComponentGrowCard" });

export { ComponentGrowCard as C };
//# sourceMappingURL=ComponentGrowCard-D1HotIDG.mjs.map
