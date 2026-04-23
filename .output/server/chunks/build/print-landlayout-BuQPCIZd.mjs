import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { n as numUnicode } from './number-BUJwr6QZ.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "print-landlayout",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.lid;
    const dd = ref(null);
    const capital = computed(() => dd.value?.capital ?? null);
    const loanrecord = computed(() => dd.value?.loanrecord ?? null);
    const invoice = computed(
      () => dd.value?.invoice ?? null
    );
    const loading = ref(false);
    function formatDay(date) {
      return date ? new Date(date).getDate() : "";
    }
    function formatMonth(date) {
      return date ? new Date(date).getMonth() + 1 : "";
    }
    function formatYear(date) {
      return date ? new Date(date).getFullYear() : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_center = resolveComponent("center");
      if (!loading.value && loanrecord.value && capital.value && invoice.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-f5030b65><header class="center mt" data-v-f5030b65><h1 data-v-f5030b65>ព្រះរាជាណាចក្រកម្ពុជា</h1><h1 data-v-f5030b65>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1><p class="tacteng" data-v-f5030b65>3</p><h2 data-v-f5030b65>លិខិតស្នើសុំតម្កល់ និងរក្សាទុកប្លង់</h2></header><main class="mt" data-v-f5030b65><p class="inden" data-v-f5030b65>${ssrInterpolate(loanrecord.value.customer.nametitle1.type)}ឈ្មោះ   <strong data-v-f5030b65>${ssrInterpolate(loanrecord.value.customer.cust_name_1)}</strong>   កើតនៅថ្ងៃទី${ssrInterpolate(unref(numUnicode)(formatDay(loanrecord.value.customer.cust_dob_1)))} ខែ${ssrInterpolate(unref(numUnicode)(formatMonth(loanrecord.value.customer.cust_dob_1)))} ឆ្នាំ${ssrInterpolate(unref(numUnicode)(formatYear(loanrecord.value.customer.cust_dob_1)))} អាសយដ្ឋានបច្ចុប្បន្ន${ssrInterpolate(loanrecord.value.customer.cust_address)}</p><h2 class="center mt" data-v-f5030b65>សូមគោរពជូន</h2><h2 class="center" data-v-f5030b65>លោកស្រីប្រធាន${ssrInterpolate(capital.value.organization)}</h2><p class="inden" data-v-f5030b65> ដោយខ្លាចក្រែងបាត់បង់ ឬខូចខាតដោយប្រការណាមួយនូវប្លង់ដែលបានដាក់ហ៊ីប៉ូតែក យើងខ្ញុំឯកភាពស្នើសុំលោកស្រីប្រធាន <strong data-v-f5030b65>${ssrInterpolate(capital.value.organization)}</strong> ជួយគ្រប់គ្រង និងថែរក្សាប្លង់(ច្បាប់ដើម)ដូចមានក្នុងតារាងខាងក្រោម៖ </p><p class="inden" data-v-f5030b65>`);
        if (!loanrecord.value.loan_collateral_1) {
          _push(`<span data-v-f5030b65> -  ......................................................... </span>`);
        } else {
          _push(`<span data-v-f5030b65> -  ${ssrInterpolate(loanrecord.value.loan_collateral_1)}</span>`);
        }
        _push(`</p><p class="inden" data-v-f5030b65>`);
        if (!loanrecord.value.loan_collateral_2) {
          _push(`<span data-v-f5030b65> -  ......................................................... </span>`);
        } else {
          _push(`<span data-v-f5030b65> -  ${ssrInterpolate(loanrecord.value.loan_collateral_2)}</span>`);
        }
        _push(`</p><p class="inden mt" data-v-f5030b65><strong data-v-f5030b65>${ssrInterpolate(capital.value.organization)}</strong> ទទួលខុសត្រូវលើការខូចខាត ឬបាត់បង់ដែលកើតឡើងក្នុងកំឡុងពេលរក្សាទុកប្លង់ និងវត្ថុតម្កល់ផ្សេងៗ។ </p><p class="inden" data-v-f5030b65> -  ក្នុងករណីមិនបានបំពេញកាតព្វកិច្ចស្របតាមកិច្ចសន្យាខ្ចីប្រាក់នោះទេ យល់ព្រមឲ្យអ្នកធានា\`ឬសាច់ញាតិ ទូទាត់សងបំណុលផ្ដាច់ជំនួស និងអនុញ្ញាតប្រគល់ប្លង់ និងវត្ថុតម្កល់ផ្សេងៗទៅអ្នកធានា ឬសាច់ញាតិ យកទៅគ្រប់គ្រង រក្សាទុកក្លាយជាម្ចាស់បំណុលជំនួស និងទទួលខុសត្រូវលើការរក្សាទុកចាប់ពីថ្ងៃសងផ្ដាច់តទៅ។ </p></main><footer data-v-f5030b65><div class="center l-space mt" data-v-f5030b65><p data-v-f5030b65>${ssrInterpolate(invoice.value.datesignChhankitek)}</p><p data-v-f5030b65>ខេត្តកំពង់ធំ ${ssrInterpolate(invoice.value.datesignSoriyakitek)}</p></div><div class="fingerprint mt" data-v-f5030b65><div class="fingerprint-article" data-v-f5030b65><div data-v-f5030b65><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`ស្នាមម្រាមដៃ`);
            } else {
              return [
                createTextVNode("ស្នាមម្រាមដៃ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`អ្នកស្នើសុំតម្កល់​ឯកសារ`);
            } else {
              return [
                createTextVNode("អ្នកស្នើសុំតម្កល់​ឯកសារ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p></div><p data-v-f5030b65><strong data-v-f5030b65>${ssrInterpolate(loanrecord.value.customer.cust_name_1)} `);
        if (loanrecord.value?.customer?.cust_name_2) {
          _push(`<!--[-->       ${ssrInterpolate(loanrecord.value.customer.cust_name_2)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</strong></p></div><div class="fingerprint-article" data-v-f5030b65><div data-v-f5030b65><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`យល់ព្រមតាមការស្នើសុំ`);
            } else {
              return [
                createTextVNode("យល់ព្រមតាមការស្នើសុំ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(capital.value.organization)}`);
            } else {
              return [
                createTextVNode(toDisplayString(capital.value.organization), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`ហត្ថលេខា`);
            } else {
              return [
                createTextVNode("ហត្ថលេខា")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p></div><p data-v-f5030b65><strong data-v-f5030b65>`);
        _push(ssrRenderComponent(_component_center, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(capital.value.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(capital.value.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</strong></p></div></div></footer></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "center" }, _attrs))} data-v-f5030b65>Loading...</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/prints/[lid]/print-landlayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printLandlayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f5030b65"]]);

export { printLandlayout as default };
//# sourceMappingURL=print-landlayout-BuQPCIZd.mjs.map
