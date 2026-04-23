import { _ as _sfc_main } from './ThemeProvider.vue-uY2oZNqf.mjs';
import { useSSRContext } from 'vue';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/ThemeProvider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LayoutThemeProvider" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ThemeProvider-DC2sl9V8.mjs.map
