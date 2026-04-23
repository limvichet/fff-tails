import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-CiMmuijx.mjs';
import { useRoute } from 'vue-router';
import { f as formatNumber } from './number-BUJwr6QZ.mjs';
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
  __name: "print-sched",
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
        _push(`<div${ssrRenderAttrs(_attrs)}><p>Preparing Document...</p></div>`);
      } else if (!dd.value) {
        _push(`<div${ssrRenderAttrs(_attrs)}>No Data (API failed)</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><header class="row"><div class="col-8 row end"><img${ssrRenderAttr("src", _imports_0)} class="logo"><div class="pl"><h3><strong>${ssrInterpolate(capital.value?.organization)}</strong></h3><h3>កាលវិភាគសងប្រាក់</h3></div></div><div class="col-4"><table class="table border"><tbody><tr><td>  លេខសម្គាល់កម្ចី</td><td class="right">${ssrInterpolate(pad(loanrecord.value?.id || 0))}  </td></tr><tr><td>  លេខអតិថិជន</td><td class="right">${ssrInterpolate(pad(loanrecord.value?.customer?.id || 0))}  </td></tr><tr><td>  អត្រាកាប្រាក់%</td><td class="right">${ssrInterpolate(loanrecord.value?.loan_interest_rate)}  </td></tr></tbody></table></div></header><main><table><tbody><tr><td>អតិថិជន</td><td>${ssrInterpolate(loanrecord.value?.customer?.nametitle1?.nametitle_kh)} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_1)}</td><td>${ssrInterpolate(loanrecord.value?.customer?.nametitle2?.nametitle_kh || " ")} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_2 || " ")}</td></tr><tr><td>សរុបទឹកប្រាក់</td><td>${ssrInterpolate(unref(formatNumber)(Number(loanrecord.value?.loan_totalcash || 0)))} ${ssrInterpolate(loanrecord.value?.currency?.currency_kh)}</td><td> រយៈពេលខ្ចី ${ssrInterpolate(loanrecord.value?.loan_peroid)} ${ssrInterpolate(loanrecord.value?.loantype?.loantype_shortcut)}</td></tr></tbody></table><table class="table mt"><thead><tr><th>ល.រ</th><th>ថ្ងៃខែឆ្នាំ</th><th>ទូទាត់ខែ</th><th>ប្រាក់ដើម</th><th>រំលោះដើម</th><th>ការប្រាក់</th><th>សរុប</th><th>ប្រាក់បើកបាន</th><th>ប្រាក់បង់</th><th>ប្រាក់សល់</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(schedules.value, (s) => {
          _push(`<tr><td class="center">${ssrInterpolate(s.schedule_paymentnumber)}</td><td>${ssrInterpolate(formatDate(s.schedule_principle_date))}</td><td>${ssrInterpolate(formatMonthYear(s.schedule_principle_date))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_outstanding || 0)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_principle || 0)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_interest)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_totalpay || 0)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_totalcashin || 0)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_paidcash || 0)))}</td><td>${ssrInterpolate(unref(formatNumber)(Number(s.schedule_lessmoney || 0)))}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot><tr class="bold"><td colspan="3" class="center bold">សរុប</td><td colspan="7">${ssrInterpolate(unref(formatNumber)(sumSchedule.value))}</td></tr></tfoot></table><div class="row mt note"><div class="col-2">កំណត់សម្គាល់</div><div class="col-10">${ssrInterpolate(loanrecord.value?.loan_note || "........................")}</div></div></main><footer><div class="center l-space mt"><div>${ssrInterpolate(invoice.value?.datesignChhankitek)}</div><div>${ssrInterpolate(invoice.value?.datesignSoriyakitek)}</div></div><div class="row center mt"><div class="col-3"><div>ស្នាមម្រាមដៃ</div><div>សាក្សី</div><div class="v-space"></div><div class="sign">....................</div></div><div class="col-3"><div>ស្នាមម្រាមដៃ</div><div>អ្នកធានា</div><div class="v-space"></div><div class="sign">${ssrInterpolate(loanrecord.value?.guarantor?.cust_name_1 || "........")}</div></div><div class="col-3"><div>ស្នាមម្រាមដៃ</div><div>អ្នកខ្ចីប្រាក់</div><div class="v-space"></div><div class="sign">${ssrInterpolate(loanrecord.value?.customer?.cust_name_1)} ${ssrInterpolate(loanrecord.value?.customer?.cust_name_2)}</div></div><div class="col-3"><div>ស្នាមម្រាមដៃ</div><div>ម្ចាស់ប្រាក់</div><div class="v-space"></div><div class="mt">${ssrInterpolate(capital.value?.name)}</div></div></div></footer></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/prints/[id]/print-sched.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=print-sched-BLAiy5gO.mjs.map
