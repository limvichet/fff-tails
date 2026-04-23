import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-CiMmuijx.mjs';
import { useRoute } from 'vue-router';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
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
  __name: "print-sched copy",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const dd = ref(null);
    const capital = computed(() => dd.value?.capital ?? null);
    const loanrecord = computed(() => dd.value?.loanrecord ?? null);
    const schedules = computed(() => dd.value?.schedules ?? []);
    const sumSchedule = computed(() => dd.value?.sum_schedule_principle ?? 0);
    const invoice = computed(() => dd.value?.invoice ?? null);
    const loading = ref(false);
    const pad = (num) => String(num).padStart(8, "0");
    const formatDate = (d) => {
      const date = new Date(d);
      return date.toLocaleDateString("en-GB");
    };
    const formatMonthYear = (d) => {
      const date = new Date(d);
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      if (loading.value) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-f2d2066b>Loading...</div>`);
      } else if (!dd.value) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-f2d2066b>No Data (API failed)</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-f2d2066b><header class="row" data-v-f2d2066b><div class="col-8 row end" data-v-f2d2066b><img${ssrRenderAttr("src", _imports_0)} class="logo" data-v-f2d2066b><div class="pl" data-v-f2d2066b><h3 data-v-f2d2066b><strong data-v-f2d2066b>${ssrInterpolate(capital.value?.organization)}</strong></h3><h3 data-v-f2d2066b>កាលវិភាគសងប្រាក់</h3></div></div><div class="col-4" data-v-f2d2066b><table class="table border" data-v-f2d2066b><tbody data-v-f2d2066b><tr data-v-f2d2066b><td data-v-f2d2066b>  លេខសម្គាល់កម្ចី</td><td class="right" data-v-f2d2066b>${ssrInterpolate(pad(loanrecord.value?.id || 0))}  </td></tr><tr data-v-f2d2066b><td data-v-f2d2066b>  លេខអតិថិជន</td><td class="right" data-v-f2d2066b>${ssrInterpolate(pad(loanrecord.value?.customer?.id || 0))}  </td></tr><tr data-v-f2d2066b><td data-v-f2d2066b>  អត្រាកាប្រាក់%</td><td class="right" data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.loan_interest_rate)}  </td></tr></tbody></table></div></header><main data-v-f2d2066b><table data-v-f2d2066b><tbody data-v-f2d2066b><tr data-v-f2d2066b><td class="label" data-v-f2d2066b>អតិថិជន</td><td data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.customer?.nametitle1?.nametitle_kh)} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_1)}</td><td data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.customer?.nametitle2?.nametitle_kh || " ")} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_2 || " ")}</td></tr><tr data-v-f2d2066b><td class="label" data-v-f2d2066b>សរុបទឹកប្រាក់</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(loanrecord.value?.loan_totalcash || 0)))} ${ssrInterpolate(loanrecord.value?.currency?.currency_kh)}</td><td data-v-f2d2066b> រយៈពេលខ្ចី ${ssrInterpolate(loanrecord.value?.loan_peroid)} ${ssrInterpolate(loanrecord.value?.loantype?.loantype_shortcut)}</td></tr></tbody></table><table class="table mt" data-v-f2d2066b><thead data-v-f2d2066b><tr data-v-f2d2066b><th data-v-f2d2066b>ល.រ</th><th data-v-f2d2066b>ថ្ងៃខែឆ្នាំ</th><th data-v-f2d2066b>ទូទាត់ខែ</th><th data-v-f2d2066b>ប្រាក់ដើម</th><th data-v-f2d2066b>រំលោះដើម</th><th data-v-f2d2066b>ការប្រាក់</th><th data-v-f2d2066b>សរុប</th><th data-v-f2d2066b>ប្រាក់បើកបាន</th><th data-v-f2d2066b>ប្រាក់បង់</th><th data-v-f2d2066b>ប្រាក់សល់</th></tr></thead><tbody data-v-f2d2066b><!--[-->`);
        ssrRenderList(schedules.value, (s) => {
          _push(`<tr data-v-f2d2066b><td class="center" data-v-f2d2066b>${ssrInterpolate(s.schedule_paymentnumber)}</td><td data-v-f2d2066b>${ssrInterpolate(formatDate(s.schedule_principle_date))}</td><td data-v-f2d2066b>${ssrInterpolate(formatMonthYear(s.schedule_principle_date))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_outstanding || 0)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_principle || 0)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_interest)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_totalpay || 0)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_totalcashin || 0)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_paidcash || 0)))}</td><td data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_lessmoney || 0)))}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot data-v-f2d2066b><tr class="bold" data-v-f2d2066b><td colspan="3" class="center bold" data-v-f2d2066b>សរុប</td><td colspan="7" data-v-f2d2066b>${ssrInterpolate(unref(formatNumber)(sumSchedule.value))}</td></tr></tfoot></table><div class="row mt note" data-v-f2d2066b><div class="col-2" data-v-f2d2066b>កំណត់សម្គាល់</div><div class="col-10" data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.loan_note || "........................")}</div></div></main><footer data-v-f2d2066b><div class="center l-space mt" data-v-f2d2066b><div data-v-f2d2066b>${ssrInterpolate(invoice.value?.datesignChhankitek)}</div><div data-v-f2d2066b>${ssrInterpolate(invoice.value?.datesignSoriyakitek)}</div></div><div class="row center mt" data-v-f2d2066b><div class="col-3" data-v-f2d2066b><div data-v-f2d2066b>ស្នាមម្រាមដៃ</div><div data-v-f2d2066b>សាក្សី</div><div class="v-space" data-v-f2d2066b></div><div class="sign" data-v-f2d2066b>....................</div></div><div class="col-3" data-v-f2d2066b><div data-v-f2d2066b>ស្នាមម្រាមដៃ</div><div data-v-f2d2066b>អ្នកធានា</div><div class="v-space" data-v-f2d2066b></div><div class="sign" data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.guarantor?.cust_name_1 || "........")}</div></div><div class="col-3" data-v-f2d2066b><div data-v-f2d2066b>ស្នាមម្រាមដៃ</div><div data-v-f2d2066b>អ្នកខ្ចីប្រាក់</div><div class="v-space" data-v-f2d2066b></div><div class="sign" data-v-f2d2066b>${ssrInterpolate(loanrecord.value?.customer?.cust_name_1)} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_2)}</div></div><div class="col-3" data-v-f2d2066b><div data-v-f2d2066b>ស្នាមម្រាមដៃ</div><div data-v-f2d2066b>ម្ចាស់ប្រាក់</div><div class="v-space" data-v-f2d2066b></div><div class="mt" data-v-f2d2066b>${ssrInterpolate(capital.value?.name)}</div></div></div></footer></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/prints/[id]/print-sched copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const printSched_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f2d2066b"]]);

export { printSched_copy as default };
//# sourceMappingURL=print-sched copy-DZ0yoieP.mjs.map
