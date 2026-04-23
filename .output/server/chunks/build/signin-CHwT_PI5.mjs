import { _ as _imports_0$1, a as _imports_1, b as _sfc_main$4 } from './virtual_public-DgezuB96.mjs';
import { defineComponent, ref, resolveComponent, withCtx, unref, mergeProps, createVNode, withModifiers, withDirectives, createBlock, createCommentVNode, openBlock, toDisplayString, vModelText, vModelDynamic, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrGetDynamicModelProps, ssrIncludeBooleanAttr, ssrRenderSlot } from 'vue/server-renderer';
import { g as useAuth, h as useRoute, n as navigateTo, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index-BUfmGtf9.mjs';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import z, { ZodEffects } from 'zod';
import { u as useFFFSeo } from './useFFFSeo-DMpTTtb2.mjs';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import './ThemeProvider.vue-uY2oZNqf.mjs';
import 'vue-router';
import 'devalue';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
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
import './asyncData-CQK02fck.mjs';
import 'perfect-debounce';

const _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_common_theme_toggler = _sfc_main$4;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><main>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div class="fixed bottom-10 right-10 z-[99]">`);
  _push(ssrRenderComponent(_component_common_theme_toggler, null, null, _parent));
  _push(`</div></main></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/FullScreenLayout.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]), { __name: "LayoutFullScreenLayout" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ShowAuthError",
  __ssrInlineRender: true,
  props: {
    err: {}
  },
  setup(__props) {
    const props = __props;
    const errorMessage = computed(() => {
      if (!props.err) return "";
      if (Array.isArray(props.err)) {
        return props.err[0];
      }
      const values = Object.values(props.err).flat();
      return values.length > 0 ? values[0] : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (errorMessage.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full rounded-md border border-red-200 bg-red-50 p-3" }, _attrs))}><div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><p class="text-sm font-medium public:text-red-700 dark:text-red-400">${ssrInterpolate(errorMessage.value)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ShowAuthError.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "ShowAuthError" });
const _imports_0 = publicAssetsURL("/images/shape/grid-01.svg");
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]"><img${ssrRenderAttr("src", _imports_0)} alt="grid"></div><div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]"><img${ssrRenderAttr("src", _imports_0)} alt="grid"></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/CommonGridShape.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "CommonGridShape" });
const schema = z.object({
  email: z.string().nonempty("Please enter your email!").email("Please enter a valid email!"),
  password: z.string().nonempty("Please enter your password!")
});
function useCustomFields(options) {
  const typedSchema = toTypedSchema(options.validationSchema);
  const form = useForm({
    ...options,
    validationSchema: typedSchema
  });
  const fields = {};
  let sourceSchema = options.validationSchema;
  while (sourceSchema instanceof ZodEffects) {
    sourceSchema = sourceSchema._def.schema;
  }
  const keys = Object.keys(sourceSchema.shape);
  keys.forEach((key) => {
    const [model, props] = form.defineField(key, {
      validateOnModelUpdate: true
      // This makes it validate while typing
    });
    fields[key] = { model, props };
  });
  return {
    ...form,
    fields
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signin",
  __ssrInlineRender: true,
  setup(__props) {
    useFFFSeo({
      // title: `${defaultSeo.title} - Sign In`,
      title: `Chhoukroit - Sign In`,
      description: "This is your dashboard where you can manage many things about your account!"
    });
    const { login, loading } = useAuth();
    const err = ref(null);
    const isSubmitted = ref(false);
    const showPassword = ref(false);
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    const { fields, handleSubmit, errors } = useCustomFields({
      validationSchema: schema
    });
    const submitForm = handleSubmit(
      async (data) => {
        isSubmitted.value = true;
        const route = useRoute();
        const redirectTo = route.query.redirectTo?.toString() || "/app/dashboard";
        err.value = null;
        try {
          const res = await login(data);
          await navigateTo(redirectTo);
        } catch (error) {
          if (!error?.data) {
            err.value = ["Server connection failed"];
            return;
          }
          if (!error.data.data) {
            err.value = [error.data.statusMessage || "Login failed"];
          } else {
            err.value = Object.values(error.data.data).flat();
          }
        }
      },
      () => {
        isSubmitted.value = true;
        console.warn("Form validation failed");
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutFullScreenLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      const _component_ShowAuthError = __nuxt_component_2;
      const _component_CommonGridShape = __nuxt_component_3;
      const _component_router_link = resolveComponent("router-link");
      let _temp0, _temp1;
      _push(ssrRenderComponent(_component_LayoutFullScreenLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0"${_scopeId}><div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"${_scopeId}><div class="flex flex-col flex-1 w-full lg:w-1/2"${_scopeId}><div class="w-full max-w-md pt-10 mx-auto"${_scopeId}><img class="dark:hidden"${ssrRenderAttr("src", _imports_0$1)} alt="Logo"${_scopeId}><img class="hidden dark:block"${ssrRenderAttr("src", _imports_1)} alt="Logo"${_scopeId}><p class="text-left text-gray-400 dark:text-white/60 py-3"${_scopeId}> Welcome Back to Admin Dashboard </p></div><div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto"${_scopeId}><div${_scopeId}><div class="mb-2 sm:mb-8"${_scopeId}><h1 class="mb-1 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"${_scopeId}> Sign In </h1><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Enter your email and password to sign in! </p></div><div${_scopeId}><div class="relative py-3 sm:py-5"${_scopeId}><div class="absolute inset-0 flex items-center"${_scopeId}><div class="w-full border-t border-gray-200 dark:border-gray-800"${_scopeId}></div></div></div><form${_scopeId}><div class="space-y-5"${_scopeId}><div${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"${_scopeId}> Email </label>`);
            if (unref(isSubmitted) || unref(errors).email) {
              _push2(`<span class="text-red-500 font-normal text-[12px]"${_scopeId}>${ssrInterpolate(unref(errors).email)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><input${ssrRenderAttrs((_temp0 = mergeProps({
              value: unref(fields).email.model.value
            }, unref(fields).email.props, {
              type: "email",
              id: "email",
              name: "email",
              placeholder: "info@gmail.com",
              class: "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(fields).email.model.value))))}${_scopeId}></div><div${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"${_scopeId}> Password </label>`);
            if (unref(isSubmitted) || unref(errors).password) {
              _push2(`<span class="text-red-500 font-normal text-[12px]"${_scopeId}>${ssrInterpolate(unref(errors).password)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="relative"${_scopeId}><input${ssrRenderAttrs((_temp1 = mergeProps(unref(fields).password.props, {
              type: unref(showPassword) ? "text" : "password",
              id: "password",
              placeholder: "Enter your password",
              class: "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            }), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, unref(fields).password.model.value))))}${_scopeId}><span class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"${_scopeId}>`);
            if (!unref(showPassword)) {
              _push2(`<svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path fill-rule="evenodd" clip-rule="evenodd" d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z" fill="#98A2B3"${_scopeId}></path></svg>`);
            }
            _push2(`</span></div></div><div${_scopeId}>`);
            if (!unref(loading)) {
              _push2(`<button type="submit" class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"${_scopeId}> Sign In </button>`);
            } else {
              _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"${_scopeId}>`);
              if (unref(loading)) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "svg-spinners:180-ring-with-bg",
                  class: "text-lg"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span${_scopeId}>${ssrInterpolate(unref(loading) ? "Signing in..." : "Sign In")}</span></button>`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_ShowAuthError, { err: unref(err) }, null, _parent2, _scopeId));
            _push2(`</div></form></div></div></div></div><div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"${_scopeId}><div class="flex items-center justify-center z-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonGridShape, null, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col items-center max-w-xs"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_router_link, {
              to: "/",
              class: "block mb-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img width="{231}" height="{48}"${ssrRenderAttr("src", _imports_1)} alt="Logo"${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      width: "{231}",
                      height: "{48}",
                      src: _imports_1,
                      alt: "Logo"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="text-center text-gray-400 dark:text-white/60"${_scopeId}> Admin Dashboard </p></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0" }, [
                createVNode("div", { class: "relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900" }, [
                  createVNode("div", { class: "flex flex-col flex-1 w-full lg:w-1/2" }, [
                    createVNode("div", { class: "w-full max-w-md pt-10 mx-auto" }, [
                      createVNode("img", {
                        class: "dark:hidden",
                        src: _imports_0$1,
                        alt: "Logo"
                      }),
                      createVNode("img", {
                        class: "hidden dark:block",
                        src: _imports_1,
                        alt: "Logo"
                      }),
                      createVNode("p", { class: "text-left text-gray-400 dark:text-white/60 py-3" }, " Welcome Back to Admin Dashboard ")
                    ]),
                    createVNode("div", { class: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "mb-2 sm:mb-8" }, [
                          createVNode("h1", { class: "mb-1 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md" }, " Sign In "),
                          createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Enter your email and password to sign in! ")
                        ]),
                        createVNode("div", null, [
                          createVNode("div", { class: "relative py-3 sm:py-5" }, [
                            createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                              createVNode("div", { class: "w-full border-t border-gray-200 dark:border-gray-800" })
                            ])
                          ]),
                          createVNode("form", {
                            onSubmit: withModifiers(unref(submitForm), ["prevent"])
                          }, [
                            createVNode("div", { class: "space-y-5" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "flex items-center justify-between" }, [
                                  createVNode("label", {
                                    for: "email",
                                    class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                  }, " Email "),
                                  unref(isSubmitted) || unref(errors).email ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-red-500 font-normal text-[12px]"
                                  }, toDisplayString(unref(errors).email), 1)) : createCommentVNode("", true)
                                ]),
                                withDirectives(createVNode("input", mergeProps({
                                  "onUpdate:modelValue": ($event) => unref(fields).email.model.value = $event
                                }, unref(fields).email.props, {
                                  type: "email",
                                  id: "email",
                                  name: "email",
                                  placeholder: "info@gmail.com",
                                  class: "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                }), null, 16, ["onUpdate:modelValue"]), [
                                  [vModelText, unref(fields).email.model.value]
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("div", { class: "flex items-center justify-between" }, [
                                  createVNode("label", {
                                    for: "password",
                                    class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                  }, " Password "),
                                  unref(isSubmitted) || unref(errors).password ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-red-500 font-normal text-[12px]"
                                  }, toDisplayString(unref(errors).password), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "relative" }, [
                                  withDirectives(createVNode("input", mergeProps({
                                    "onUpdate:modelValue": ($event) => unref(fields).password.model.value = $event
                                  }, unref(fields).password.props, {
                                    type: unref(showPassword) ? "text" : "password",
                                    id: "password",
                                    placeholder: "Enter your password",
                                    class: "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                  }), null, 16, ["onUpdate:modelValue", "type"]), [
                                    [vModelDynamic, unref(fields).password.model.value]
                                  ]),
                                  createVNode("span", {
                                    onClick: togglePasswordVisibility,
                                    class: "absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                                  }, [
                                    !unref(showPassword) ? (openBlock(), createBlock("svg", {
                                      key: 0,
                                      class: "fill-current",
                                      width: "20",
                                      height: "20",
                                      viewBox: "0 0 20 20",
                                      fill: "none",
                                      xmlns: "http://www.w3.org/2000/svg"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        "clip-rule": "evenodd",
                                        d: "M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z",
                                        fill: "#98A2B3"
                                      })
                                    ])) : (openBlock(), createBlock("svg", {
                                      key: 1,
                                      class: "fill-current",
                                      width: "20",
                                      height: "20",
                                      viewBox: "0 0 20 20",
                                      fill: "none",
                                      xmlns: "http://www.w3.org/2000/svg"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        "clip-rule": "evenodd",
                                        d: "M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z",
                                        fill: "#98A2B3"
                                      })
                                    ]))
                                  ])
                                ])
                              ]),
                              createVNode("div", null, [
                                !unref(loading) ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  type: "submit",
                                  class: "flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                }, " Sign In ")) : (openBlock(), createBlock("button", {
                                  key: 1,
                                  type: "submit",
                                  disabled: unref(loading),
                                  class: "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
                                }, [
                                  unref(loading) ? (openBlock(), createBlock(_component_Icon, {
                                    key: 0,
                                    name: "svg-spinners:180-ring-with-bg",
                                    class: "text-lg"
                                  })) : createCommentVNode("", true),
                                  createVNode("span", null, toDisplayString(unref(loading) ? "Signing in..." : "Sign In"), 1)
                                ], 8, ["disabled"]))
                              ]),
                              createVNode(_component_ShowAuthError, { err: unref(err) }, null, 8, ["err"])
                            ])
                          ], 40, ["onSubmit"])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid" }, [
                    createVNode("div", { class: "flex items-center justify-center z-1" }, [
                      createVNode(_component_CommonGridShape),
                      createVNode("div", { class: "flex flex-col items-center max-w-xs" }, [
                        createVNode(_component_router_link, {
                          to: "/",
                          class: "block mb-4"
                        }, {
                          default: withCtx(() => [
                            createVNode("img", {
                              width: "{231}",
                              height: "{48}",
                              src: _imports_1,
                              alt: "Logo"
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("p", { class: "text-center text-gray-400 dark:text-white/60" }, " Admin Dashboard ")
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/signin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=signin-CHwT_PI5.mjs.map
