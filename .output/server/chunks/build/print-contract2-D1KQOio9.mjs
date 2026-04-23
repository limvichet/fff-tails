import { defineComponent, ref, computed, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _imports_0 } from './virtual_public-DEzbsXfd.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ContractType1",
  __ssrInlineRender: true,
  props: {
    data: {}
  },
  setup(__props) {
    function khNumber(val) {
      if (!val) return "";
      return val.toString().replace(/0/g, "០").replace(/1/g, "១").replace(/2/g, "២").replace(/3/g, "៣").replace(/4/g, "៤").replace(/5/g, "៥").replace(/6/g, "៦").replace(/7/g, "៧").replace(/8/g, "៨").replace(/9/g, "៩");
    }
    function formatMoney(val) {
      return Number(val).toLocaleString(void 0, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    function formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return `${khNumber(d.getDate())}/${khNumber(d.getMonth() + 1)}/${khNumber(d.getFullYear())}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrapper" }, _attrs))}><table><tr><td style="${ssrRenderStyle({ "text-align": "center", "width": "25%" })}"><img${ssrRenderAttr("src", _imports_0)} class="logo"><h4>${ssrInterpolate(__props.data.capital.organization)}</h4></td><td style="${ssrRenderStyle({ "width": "50%" })}"><h1>ព្រះរាជាណាចក្រកម្ពុជា</h1><h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1><h1 class="tacteng">3</h1><h2>កិច្ចសន្យាខ្ចីប្រាក់បង់រំលោះ</h2></td><td style="${ssrRenderStyle({ "width": "25%" })}"></td></tr><tr><td colspan="3"><p> លោកស្រី<strong>${ssrInterpolate(__props.data.capital.name)}</strong> កើតឆ្នាំ ${ssrInterpolate(khNumber(__props.data.capital.birth_year))}</p></td></tr><tr><td colspan="3"><p>${ssrInterpolate(__props.data.loanrecord.customer.nametitle1?.nametitle_kh)} <strong>${ssrInterpolate(__props.data.loanrecord.customer.cust_name_1)}</strong></p></td></tr><tr><td colspan="3"><p> ប្រាក់សរុប: <b>${ssrInterpolate(khNumber(formatMoney(__props.data.loan2.contract_schedule_totalpay_all)))} ${ssrInterpolate(__props.data.loanrecord.currency.currency_kh)}</b></p></td></tr><!--[-->`);
      ssrRenderList(__props.data.loan_cheques, (c, i) => {
        _push(`<tr><td colspan="3"><p>${ssrInterpolate(i)}. លេខ ${ssrInterpolate(khNumber(c.cheque_number))} ថ្ងៃទី ${ssrInterpolate(formatDate(c.schedule_cheque_to_date))} ចំនួន ${ssrInterpolate(khNumber(c.schedule_totalpay))}</p></td></tr>`);
      });
      _push(`<!--]--><tr><td colspan="3" class="center"><p><b>${ssrInterpolate(__props.data.invoice.datesignChhankitek)}</b></p><p><b>${ssrInterpolate(__props.data.invoice.datesignSoriyakitek)}</b></p></td></tr></table></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/loanrecords/contracts2/ContractType1.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ContractType1 = Object.assign(_sfc_main$1, { __name: "LoanrecordsContracts2ContractType1" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "print-contract2",
  __ssrInlineRender: true,
  setup(__props) {
    function getComponent(type) {
      switch (type) {
        case 1:
          return ContractType1;
        // case 4: return ContractType4
        default:
          return ContractType1;
      }
    }
    const route = useRoute();
    route.params.lid;
    const dd = ref(null);
    computed(() => dd.value?.capital ?? null);
    computed(() => dd.value?.loanrecord ?? null);
    computed(() => dd.value?.invoice ?? null);
    const loan2 = computed(() => dd.value?.loan2 ?? null);
    computed(() => dd.value?.schedules ?? null);
    computed(() => dd.value?.loan_cheques ?? null);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (loan2.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-3adf359f>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getComponent(loan2.value.contract_type)), { data: dd.value }, null), _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/prints/[lid]/print-contract2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printContract2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3adf359f"]]);

export { printContract2 as default };
//# sourceMappingURL=print-contract2-D1KQOio9.mjs.map
