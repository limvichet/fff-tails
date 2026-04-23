import { n as numUnicode, f as formatNumber } from './number-BUJwr6QZ.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-DEzbsXfd.mjs';
import { useRoute } from 'vue-router';
import { b as formatFullDate } from './date-D_--uZCu.mjs';
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

class UnicodeHelper {
  static strleft(str, length) {
    return str.substring(0, length);
  }
  static strright(str, length) {
    return str.substring(str.length - length);
  }
  static strmid(str, start, count) {
    try {
      return str.substring(start - 1, start - 1 + count);
    } catch {
      return str;
    }
  }
  static numkh(n, cf) {
    const cf1 = {
      1: "មួយ",
      2: "ពីរ",
      3: "បី",
      4: "បួន",
      5: "ប្រាំ",
      6: "ប្រាំមួយ",
      7: "ប្រាំពីរ",
      8: "ប្រាំបី",
      9: "ប្រាំបួន",
      10: "ដប់",
      11: "ដប់មួយ",
      12: "ដប់ពីរ",
      13: "ដប់បី",
      14: "ដប់បួន",
      15: "ដប់ប្រាំ",
      16: "ដប់ប្រាំមួយ",
      17: "ដប់ប្រាំពីរ",
      18: "ដប់ប្រាំបី",
      19: "ដប់ប្រាំបួន"
    };
    const cf2 = {
      2: "ម្ភៃ",
      3: "សាមសិប",
      4: "សែសិប",
      5: "ហាសិប",
      6: "ហុកសិប",
      7: "ចិតសិប",
      8: "ប៉ែតសិប",
      9: "កៅសិប"
    };
    let ftxt = "";
    if (parseInt(this.strmid(cf, 1, 1)) !== 0) {
      ftxt += cf1[parseInt(this.strmid(cf, 1, 1))] + "រយ";
    }
    if (parseInt(this.strmid(cf, 2, 1)) < 2) {
      ftxt += cf1[parseInt(this.strmid(cf, 2, 2))] || "";
    } else {
      ftxt += cf2[parseInt(this.strmid(cf, 2, 1))] || "";
      if (parseInt(this.strmid(cf, 3, 1)) !== 0) {
        ftxt += cf1[parseInt(this.strmid(cf, 3, 1))];
      }
    }
    if (n === 1) ftxt += "លាន";
    if (n === 2) ftxt += "ពាន់";
    return ftxt;
  }
  static spellkhmer(numl = 0) {
    let num = numl === 0 ? 0 : Math.abs(Math.floor(numl));
    let txt = "";
    let xt = this.strright(
      String(Math.floor(num / 1e6)).padStart(3, "0"),
      3
    );
    if (parseInt(xt) !== 0) {
      txt += this.numkh(1, xt);
    }
    xt = this.strright(
      String(Math.floor(num / 1e3)).padStart(3, "0"),
      3
    );
    if (parseInt(xt) !== 0) {
      txt += this.numkh(2, xt);
    }
    xt = this.strright(
      String(num).padStart(3, "0"),
      3
    );
    if (parseInt(xt) !== 0) {
      txt += this.numkh(3, xt);
    }
    return txt;
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "print-receipt2",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.lid;
    const dd = ref(null);
    const capital = computed(() => dd.value?.capital ?? null);
    const loanrecord = computed(() => dd.value?.loanrecord ?? null);
    const invoice = computed(() => dd.value?.invoice ?? null);
    const schedule_amount = computed(() => dd.value?.schedule_amount ?? 0);
    const loading = ref(false);
    function formatYear(date) {
      return date ? new Date(date).getFullYear() : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (!loading.value && loanrecord.value && capital.value && invoice.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-dc35f94d><header class="row" style="${ssrRenderStyle({})}" data-v-dc35f94d><div style="${ssrRenderStyle({ "margin-top": "20px", "margin-left": "-10px", "display": "flex", "flex-direction": "column", "align-items": "center" })}" data-v-dc35f94d><img${ssrRenderAttr("src", _imports_0)} class="logo" data-v-dc35f94d><p data-v-dc35f94d><strong data-v-dc35f94d>${ssrInterpolate(capital.value.organization)}</strong></p></div><div style="${ssrRenderStyle({ "margin-left": "20px" })}" data-v-dc35f94d><h1 data-v-dc35f94d>ព្រះរាជាណាចក្រកម្ពុជា</h1><h1 data-v-dc35f94d>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1><p class="tacteng" data-v-dc35f94d>3</p><h2 data-v-dc35f94d>កិច្ចសន្យាខ្ចីប្រាក់ និង លិខិតទទួលប្រគល់-ទទួលប្រាក់កម្ចី</h2></div><div data-v-dc35f94d></div></header><main class="justify mt" data-v-dc35f94d><p data-v-dc35f94d>${ssrInterpolate(loanrecord.value.customer.nametitle1?.nametitle_kh)} <strong data-v-dc35f94d>${ssrInterpolate(loanrecord.value.customer.cust_name_1)}</strong> ឆ្នាំ${ssrInterpolate(unref(numUnicode)(formatYear(loanrecord.value.customer.cust_dob_1)))} កាន់${ssrInterpolate(loanrecord.value.customer.identification1?.identification_kh)} លេខ${ssrInterpolate(unref(numUnicode)(loanrecord.value.customer.cust_idcardnum_1))} ចុះថ្ងៃទី `);
        if (loanrecord.value.customer.cust_idcardnum_date_1) {
          _push(`<span data-v-dc35f94d>${ssrInterpolate(unref(formatFullDate)(loanrecord.value.customer.cust_idcardnum_date_1))}</span>`);
        } else {
          _push(`<span data-v-dc35f94d>......................</span>`);
        }
        if (loanrecord.value.customer.cust_address) {
          _push(`<span data-v-dc35f94d> មានអាសយដ្ឋានស្ថិតនៅ${ssrInterpolate(loanrecord.value.customer.cust_address)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (loanrecord.value.guarantor?.cust_name_1) {
          _push(`<span data-v-dc35f94d> និង ${ssrInterpolate(loanrecord.value.guarantor.nametitle1?.nametitle_kh)} <strong data-v-dc35f94d>${ssrInterpolate(loanrecord.value.guarantor.cust_name_1)}</strong> កើតថ្ងៃទី${ssrInterpolate(unref(formatFullDate)(loanrecord.value.guarantor.cust_dob_1))} កាន់${ssrInterpolate(loanrecord.value.guarantor.identification1?.identification_kh)} លេខ${ssrInterpolate(unref(numUnicode)(loanrecord.value.guarantor.cust_idcardnum_1))} `);
          if (loanrecord.value.guarantor.cust_address) {
            _push(`<span data-v-dc35f94d> សព្វថ្ងៃរស់នៅ${ssrInterpolate(loanrecord.value.guarantor.cust_address)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p><p data-v-dc35f94d> បានទទួលប្រាក់កម្ចីចំនួន <strong data-v-dc35f94d>${ssrInterpolate(unref(numUnicode)(("formatNumber" in _ctx ? _ctx.formatNumber : unref(formatNumber))(schedule_amount.value)))} ${ssrInterpolate(loanrecord.value.currency.currency_kh)}</strong> (${ssrInterpolate(unref(UnicodeHelper).spellkhmer(schedule_amount.value))}${ssrInterpolate(loanrecord.value.currency?.currency_kh)}) </p><p data-v-dc35f94d> លិខិតនេះធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំ... </p></main><footer class="mt" data-v-dc35f94d><div class="center" data-v-dc35f94d><p data-v-dc35f94d>${ssrInterpolate(invoice.value.datesignChhankitek)}</p><p data-v-dc35f94d>ធ្វើនៅកំពង់ធំ ${ssrInterpolate(invoice.value.datesignSoriyakitek)}</p></div><div class="row between mt" data-v-dc35f94d><div class="fingerprint-article" data-v-dc35f94d><h2 data-v-dc35f94d>អ្នកប្រគល់ប្រាក់</h2><h2 data-v-dc35f94d>${ssrInterpolate(capital.value.name)}</h2></div><div class="fingerprint-article" data-v-dc35f94d><h2 data-v-dc35f94d>អ្នកទទួលប្រាក់</h2><h2 data-v-dc35f94d>${ssrInterpolate(loanrecord.value.customer.cust_name_1)} `);
        if (loanrecord.value.customer.cust_name_2) {
          _push(`<span data-v-dc35f94d>  ${ssrInterpolate(loanrecord.value.customer.cust_name_2)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h2></div>`);
        if (loanrecord.value.guarantor?.cust_name_1) {
          _push(`<div class="fingerprint-article" data-v-dc35f94d><h2 data-v-dc35f94d>អ្នកធានា</h2><h2 data-v-dc35f94d>${ssrInterpolate(loanrecord.value.guarantor.cust_name_1)}</h2></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></footer></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "center mt" }, _attrs))} data-v-dc35f94d>Loading...</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/prints/[lid]/print-receipt2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printReceipt2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dc35f94d"]]);

export { printReceipt2 as default };
//# sourceMappingURL=print-receipt2-DeilFpV3.mjs.map
