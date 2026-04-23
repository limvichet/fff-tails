import { defineComponent, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EachPage",
  __ssrInlineRender: true,
  props: {
    headline: {},
    title: {},
    desc: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PublicIconLogo = resolveComponent("PublicIconLogo");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-16 w-full h-full bg-zinc-950" }, _attrs))}><div class="w-full h-full flex flex-col gap-2 relative justify-start"><h3 id="headline" class="uppercase font-bold font-mono text-3xl text-[#f64838]">${ssrInterpolate(__props.headline)}</h3><h4 id="title" class="text-5xl w-3/4 text-pretty leading-11 font-bold text-white">${ssrInterpolate(__props.title)}</h4><p id="desc" class="text-3xl w-2/3 line-clamp-3 text-zinc-400 text-pretty">${ssrInterpolate(__props.desc)}</p>`);
      _push(ssrRenderComponent(_component_PublicIconLogo, { class: "w-28 h-28 absolute bottom-0 right-0" }, null, _parent));
      _push(`<svg class="absolute -right-16 -top-16" width="629" height="593" viewBox="0 0 629 593" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_f_199_94966)"><path d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z" fill="#f64838"></path></g><defs><filter id="filter0_f_199_94966" x="0.873535" y="-659" width="1255.25" height="1251.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="40.5" result="effect1_foregroundBlur_199_94966"></feGaussianBlur></filter></defs></svg></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OgImage/EachPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EachPage = Object.assign(_sfc_main, { __name: "OgImageEachPage" });

export { EachPage as default };
//# sourceMappingURL=EachPage-B0t73kRI.mjs.map
