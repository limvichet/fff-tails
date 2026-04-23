import { n as numUnicode, k as khMonth } from './number-BUJwr6QZ.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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
  __name: "print-atm",
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
      if (!loading.value && loanrecord.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-0d0217f0><header class="center mt" data-v-0d0217f0><h1 data-v-0d0217f0>ព្រះរាជាណាចក្រកម្ពុជា</h1><h1 data-v-0d0217f0>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1><p class="tacteng" data-v-0d0217f0>3</p><h2 data-v-0d0217f0>លិខិតផ្ទេកម្មសិទ្ធិ</h2></header><main class="mt" data-v-0d0217f0><p class="inden" data-v-0d0217f0>${ssrInterpolate(loanrecord.value.customer.nametitle1.type)}ឈ្មោះ   <strong data-v-0d0217f0>${ssrInterpolate(loanrecord.value.customer.cust_name_1)}</strong>   កើតនៅថ្ងៃទី${ssrInterpolate(unref(numUnicode)(formatDay(loanrecord.value.customer.cust_dob_1)))} ខែ${ssrInterpolate(("khMonth" in _ctx ? _ctx.khMonth : unref(khMonth))(formatMonth(loanrecord.value.customer.cust_dob_1)))} ឆ្នាំ${ssrInterpolate(unref(numUnicode)(formatYear(loanrecord.value.customer.cust_dob_1)))} អាសយដ្ឋាន ${ssrInterpolate(loanrecord.value.customer.cust_address)}</p><h2 class="center mt" data-v-0d0217f0>យល់ព្រម</h2><p class="inden justify" data-v-0d0217f0><strong data-v-0d0217f0>១-</strong> ប្រគល់កាត ATM លេខ `);
        if (!loanrecord.value?.customer?.cust_atm_num) {
          _push(`<span data-v-0d0217f0>............................</span>`);
        } else {
          _push(`<span data-v-0d0217f0>${ssrInterpolate(loanrecord.value?.customer?.cust_atm_num)}</span>`);
        }
        _push(` ទៅលោកស្រី <strong data-v-0d0217f0>${ssrInterpolate(capital.value?.name)}</strong> សព្វថ្ងៃរស់នៅភូមិ${ssrInterpolate(capital.value?.village)} សង្កាត់ ${ssrInterpolate(capital.value?.commune)} ក្រុង ${ssrInterpolate(capital.value?.district)} ខេត្ត ${ssrInterpolate(capital.value?.province)}។ ប្រើប្រាស់សម្រាប់ដកការប្រាក់ រំលោះប្រាក់ដើមប្រចាំខែ រហូតចប់តាមកាលវិភាគសងប្រាក់។ </p><p class="inden justify" data-v-0d0217f0><strong data-v-0d0217f0>២-</strong> ស្នើសុំធនាគារព្រីនរបាយការណ៍គណនីក្នុងករណីមានការស្នើសុំពីលោកស្រី ${ssrInterpolate(capital.value?.name)}</p><p class="inden justify" data-v-0d0217f0><strong data-v-0d0217f0>៣-</strong> ផ្ដាច់ការប្រើប្រាស់ប្រព័ន្ធធនាគារតាម APPទូរស័ព្ទដែ ឬប្រព័ន្ធយូនីធីជាដើមក្នុងកំឡុងពេល​ការទូទាត់តាម កាលវិភាគនៅមិនទាន់បានបញ្ចប់នៅឡើយ(ដើម្បីជៀសវាងការមិនទុកចិត្តគ្នាលើការដកប្រាក់)។</p><p class="inden justify" data-v-0d0217f0><strong data-v-0d0217f0>៤-</strong> មិនបើកកាត ATM ថ្មី ឬបិទគណនីធនាគារ ដោយមិនបានពិភាក្សាជាមួយលោកស្រី ${ssrInterpolate(capital.value?.name)}ជាមុនឡើយ។</p><p class="inden justify" data-v-0d0217f0> ខ្ញុំបាទ/នាងខ្ញុំ សូមធានាថាកាត ATM នេះជាកម្មសិទ្ធិរបស់ខ្ញុំបាទ/នាងខ្ញុំប្រាកដមែន។ ការប្រគល់កាត ATM ធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំពីជនណាម្នាក់ឡើយ។ </p><p class="inden justify" data-v-0d0217f0> ខ្ញុំបាទ/នាងខ្ញុំសូមផ្ដិតស្នាមមេដៃស្ដាំទុកជាភ័ស្ដុតាង។ </p></main><footer data-v-0d0217f0><div class="center mt" data-v-0d0217f0><p data-v-0d0217f0>${ssrInterpolate(invoice.value?.datesignChhankitek)}</p><p data-v-0d0217f0>${ssrInterpolate(invoice.value?.datesignSoriyakitek)}</p></div><div class="mt center" data-v-0d0217f0><span data-v-0d0217f0><strong data-v-0d0217f0>ស្នាមម្រាមដៃ</strong></span><div class="v-space" data-v-0d0217f0></div><span data-v-0d0217f0><strong data-v-0d0217f0>${ssrInterpolate(loanrecord.value.customer?.cust_name_1)}</strong></span></div></footer></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "center mt" }, _attrs))} data-v-0d0217f0> Loading... </div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/prints/[lid]/print-atm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printAtm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d0217f0"]]);

export { printAtm as default };
//# sourceMappingURL=print-atm-C4eaSAsa.mjs.map
