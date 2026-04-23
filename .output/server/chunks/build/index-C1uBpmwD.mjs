import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createBlock, createCommentVNode, withDirectives, openBlock, vModelText, toDisplayString, Fragment, renderList, createTextVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { C as ComponentCard, u as useMessage } from './useMessage-Doqk68dv.mjs';
import { useRouter } from 'vue-router';
import { u as useCustomToast } from './useCustomToast-3sc7Vkqz.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import './number-BUJwr6QZ.mjs';
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

const { showToast } = useCustomToast();
const useChequeSchedule = () => {
  const showModal = ref(false);
  const loading = ref(false);
  const schedules = ref([]);
  const period = ref();
  const banks = ref([]);
  const isEditMode = ref(false);
  const createEmptyCheques = () => Array.from({ length: 4 }, (_, i) => ({
    cheque_order: i + 1,
    cheque_number: "",
    from: 0,
    to: 0,
    total: ""
  }));
  const form = reactive({
    chequeschedule_cust_name_1: "",
    chequeschedule_loan_id: "",
    chequeschedule_loan_peroid: "",
    chequeschedule_bank_id: -1,
    cheques: createEmptyCheques()
  });
  const resetForm = () => {
    form.chequeschedule_cust_name_1 = "";
    form.chequeschedule_loan_id = "";
    form.chequeschedule_loan_peroid = "";
    form.chequeschedule_bank_id = -1;
    form.cheques = createEmptyCheques();
  };
  const fetchChequeData = async (url) => {
    loading.value = true;
    try {
      const res = await $fetch(url);
      const root = res?.data ?? res;
      const data = root?.data ?? root;
      isEditMode.value = data.cheque === 1;
      schedules.value = data.schedules ?? [];
      period.value = data.loanrecord?.loan_peroid ?? 0;
      form.chequeschedule_cust_name_1 = data.loanrecord?.customer?.cust_name_1 ?? "";
      form.chequeschedule_loan_id = String(data.loanrecord?.id ?? "");
      form.chequeschedule_loan_peroid = String(
        data.loanrecord?.loan_peroid ?? ""
      );
      banks.value = Object.entries(data.banks ?? {}).map(
        ([id, name]) => ({
          id: Number(id),
          label: String(name)
        })
      );
      const chequesSource = isEditMode.value ? data.bank_loanrecords?.cheques ?? [] : [];
      const mapped = createEmptyCheques().map((_, index2) => {
        const saved = chequesSource[index2];
        const schedule = data.schedules?.[index2];
        if (saved) {
          return {
            id: saved.id,
            cheque_order: saved.cheque_order,
            cheque_number: saved.cheque_number,
            from: saved.schedule_paymentnumber_from,
            to: saved.schedule_paymentnumber_to,
            total: saved.schedule_totalpay
          };
        }
        return {
          cheque_order: index2 + 1,
          cheque_number: "",
          from: schedule?.schedule_paymentnumber ?? 0,
          to: schedule?.schedule_paymentnumber ?? 0,
          total: schedule?.schedule_totalpay ?? ""
        };
      });
      form.cheques = [...mapped];
    } catch (err) {
      console.error("fetchChequeData error:", err);
    } finally {
      loading.value = false;
    }
  };
  const openModal = async (dataUrl, editUrl) => {
    resetForm();
    showModal.value = true;
    await fetchChequeData(dataUrl);
    const res = await $fetch(editUrl);
    const data = res?.data ?? res;
    isEditMode.value = data.cheque === 1;
    if (!isEditMode.value) {
      form.cheques = createEmptyCheques().map((row, i) => ({
        ...row,
        from: 0,
        to: 0,
        total: ""
      }));
      return;
    }
    form.chequeschedule_bank_id = data.bank_loanrecords?.bank_id ?? -1;
    form.cheques = createEmptyCheques().map((_, i) => {
      const c = data.bank_loanrecords?.cheques?.[i];
      return c ? {
        id: c.id,
        cheque_order: c.cheque_order,
        cheque_number: c.cheque_number,
        from: c.schedule_paymentnumber_from,
        to: c.schedule_paymentnumber_to,
        total: c.schedule_totalpay
      } : {
        cheque_order: i + 1,
        cheque_number: "",
        from: 0,
        to: 0,
        total: ""
      };
    });
  };
  const closeModal = () => {
    showModal.value = false;
    resetForm();
    initialized.value = false;
  };
  const initialized = ref(false);
  const calculateTotals = () => {
    let lastTo = 0;
    const maxPay = period.value;
    form.cheques.forEach((row, index2) => {
      row.locked = index2 === 2 || index2 === 3;
      if (index2 === 0) row.from = 1;
      else if (index2 === 3) row.from = 1;
      else row.from = lastTo + 1;
      let to = Number(row.to) || 0;
      if (index2 === 3) {
        to = maxPay;
      }
      if (!to) {
        row.total = "";
        return;
      }
      to = Math.max(to, row.from);
      to = Math.min(to, maxPay);
      row.to = to;
      let sum = 0;
      for (let i = row.from; i <= to; i++) {
        const found = schedules.value.find(
          (s) => s.schedule_paymentnumber === i
        );
        if (found) {
          sum += Number(found.schedule_totalpay);
        }
      }
      row.total = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(sum);
      lastTo = to;
    });
    initialized.value = true;
  };
  const submitForm = async () => {
    try {
      loading.value = true;
      const payload = {
        chequeschedule_loan_id: form.chequeschedule_loan_id,
        chequeschedule_bank_id: form.chequeschedule_bank_id,
        cheques: form.cheques.map((c) => ({
          cheque_order: c.cheque_order,
          cheque_number: c.cheque_number,
          schedule_paymentnumber_from: c.from,
          schedule_paymentnumber_to: c.to,
          schedule_totalpay: Number(c.total.replace(/,/g, "") || 0)
        }))
      };
      await $fetch(`/api/admin-secure/schedules-cheque-save/${form.chequeschedule_loan_id}`, {
        method: "PUT",
        body: payload
      });
      showToast(
        `ID #${form.chequeschedule_loan_id}`,
        `Updated cheque successfully!`,
        `success`
      );
      closeModal();
    } catch (err) {
      console.error("submitForm error:", err);
    } finally {
      loading.value = false;
    }
  };
  return {
    showModal,
    form,
    loading,
    banks,
    isEditMode,
    openModal,
    closeModal,
    calculateTotals,
    submitForm
  };
};
const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Search schedules",
      meta: [{ name: "loanrecords", content: "search schedules" }]
    });
    const {
      showModal,
      form,
      openModal,
      banks
    } = useChequeSchedule();
    const router = useRouter();
    const { errorMsg } = useMessage();
    const schedules = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const searchQuery = ref("");
    const page = ref(1);
    const total = ref(0);
    const lastPageValue = ref(1);
    const fetchSchedules = async () => {
      loading.value = true;
      errorMsg.value = null;
      try {
        const res = await $fetch("/api/admin-secure/schedules", {
          method: "GET",
          query: {
            page: page.value,
            param: searchQuery.value || void 0
          }
        });
        schedules.value = res.data.data ?? [];
        total.value = res.data.total ?? 0;
        lastPageValue.value = res.data.last_page ?? 1;
      } catch (err) {
        errorMsg.value = err?.statusMessage || "Failed to fetch schedules";
        schedules.value = [];
      } finally {
        loading.value = false;
      }
    };
    const paginated = computed(() => schedules.value);
    let debounceTimeout = null;
    watch(searchInput, (val) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuery.value = val;
        page.value = 1;
        fetchSchedules();
      }, 400);
    });
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchSchedules();
      }
    };
    const nextPage = () => {
      if (page.value < lastPageValue.value) {
        page.value++;
        fetchSchedules();
      }
    };
    const viewSchedule = (loanId) => {
      router.push(`/app/dashboard/schedules/${loanId}`);
    };
    watch(() => form.chequeschedule_bank_id, (val) => {
    });
    if (banks.value.length > 0) {
      form.chequeschedule_bank_id = banks.value[0].id;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1" }, _attrs))} data-v-3d04ed3c>`);
      _push(ssrRenderComponent(ComponentCard, { title: "Schedules" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative" data-v-3d04ed3c${_scopeId}><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3d04ed3c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" data-v-3d04ed3c${_scopeId}></path></svg><input${ssrRenderAttr("value", searchInput.value)} type="text" placeholder="Search records..." class="input text-sm !pl-9" data-v-3d04ed3c${_scopeId}></div>`);
            if (unref(errorMsg)) {
              _push2(`<div class="mb-3 p-2 bg-red-500/20 text-red-400 text-sm rounded" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(unref(errorMsg))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (loading.value) {
              _push2(`<div class="text-center py-6 text-gray-400" data-v-3d04ed3c${_scopeId}> Loading... </div>`);
            } else {
              _push2(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" data-v-3d04ed3c${_scopeId}><div class="max-w-full overflow-x-auto custom-scrollbar" data-v-3d04ed3c${_scopeId}><table class="min-w-full" data-v-3d04ed3c${_scopeId}><thead class="border-b" data-v-3d04ed3c${_scopeId}><tr class="border-b border-gray-200 dark:border-gray-700" data-v-3d04ed3c${_scopeId}><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>#</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>LID</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Customer</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Start</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>End</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Curr</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Total</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Created</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Updated</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Status</th><th class="px-2 py-3 text-left text-sm" data-v-3d04ed3c${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700" data-v-3d04ed3c${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (s, i) => {
                _push2(`<tr class="hover:bg-blue-300/20 transition" data-v-3d04ed3c${_scopeId}><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate((page.value - 1) * perPage + i + 1)}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.loan_id)}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.cust_name_1)}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.loan_startdate)))}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.loan_enddate)))}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.currency_en)}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.loan_totalcash)}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.created_by)} - ${ssrInterpolate(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.created_at)))}</td><td class="px-2 py-1 text-sm" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.updated_by)} - ${ssrInterpolate(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.updated_at)))}</td><td class="px-2 py-1 text-left" data-v-3d04ed3c${_scopeId}><span class="${ssrRenderClass([
                  "px-2 py-1 rounded text-xs",
                  s.loan_check_status == 1 ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                ])}" data-v-3d04ed3c${_scopeId}>${ssrInterpolate(s.loan_check_status == 1 ? "Approved" : "Pending")}</span></td><td class="px-2 py-1 text-left" data-v-3d04ed3c${_scopeId}><button class="px-2 py-1 bg-blue-600 text-white rounded text-xs mr-1" data-v-3d04ed3c${_scopeId}> Cheque </button><button class="px-2 py-1 bg-blue-600 text-white rounded text-xs" data-v-3d04ed3c${_scopeId}> View </button></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginated.value.length === 0) {
                _push2(`<tr data-v-3d04ed3c${_scopeId}><td colspan="9" class="text-center py-6 text-gray-400" data-v-3d04ed3c${_scopeId}> No schedules found. </td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div></div>`);
            }
            _push2(`<div class="mt-4 flex justify-between" data-v-3d04ed3c${_scopeId}><button${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-3d04ed3c${_scopeId}> Prev </button><span class="text-sm" data-v-3d04ed3c${_scopeId}> Page ${ssrInterpolate(page.value)} / ${ssrInterpolate(lastPageValue.value)} Total Records: <b data-v-3d04ed3c${_scopeId}>${ssrInterpolate(total.value)}</b></span><button${ssrIncludeBooleanAttr(page.value === lastPageValue.value) ? " disabled" : ""} class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-3d04ed3c${_scopeId}> Next </button></div>`);
          } else {
            return [
              createVNode("div", { class: "relative" }, [
                (openBlock(), createBlock("svg", {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  })
                ])),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => searchInput.value = $event,
                  type: "text",
                  placeholder: "Search records...",
                  class: "input text-sm !pl-9"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, searchInput.value]
                ])
              ]),
              unref(errorMsg) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 p-2 bg-red-500/20 text-red-400 text-sm rounded"
              }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
              loading.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-6 text-gray-400"
              }, " Loading... ")) : (openBlock(), createBlock("div", {
                key: 2,
                class: "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              }, [
                createVNode("div", { class: "max-w-full overflow-x-auto custom-scrollbar" }, [
                  createVNode("table", { class: "min-w-full" }, [
                    createVNode("thead", { class: "border-b" }, [
                      createVNode("tr", { class: "border-b border-gray-200 dark:border-gray-700" }, [
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "#"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "LID"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Customer"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Start"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "End"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Curr"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Total"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Created"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Updated"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Status"),
                        createVNode("th", { class: "px-2 py-3 text-left text-sm" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (s, i) => {
                        return openBlock(), createBlock("tr", {
                          key: s.id,
                          class: "hover:bg-blue-300/20 transition"
                        }, [
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString((page.value - 1) * perPage + i + 1), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.loan_id), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.cust_name_1), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.loan_startdate))), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.loan_enddate))), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.currency_en), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.loan_totalcash), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.created_by) + " - " + toDisplayString(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.created_at))), 1),
                          createVNode("td", { class: "px-2 py-1 text-sm" }, toDisplayString(s.updated_by) + " - " + toDisplayString(("formatDateForOutput" in _ctx ? _ctx.formatDateForOutput : unref(formatDateForOutput))(new Date(s.updated_at))), 1),
                          createVNode("td", { class: "px-2 py-1 text-left" }, [
                            createVNode("span", {
                              class: [
                                "px-2 py-1 rounded text-xs",
                                s.loan_check_status == 1 ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                              ]
                            }, toDisplayString(s.loan_check_status == 1 ? "Approved" : "Pending"), 3)
                          ]),
                          createVNode("td", { class: "px-2 py-1 text-left" }, [
                            createVNode("button", {
                              class: "px-2 py-1 bg-blue-600 text-white rounded text-xs mr-1",
                              onClick: ($event) => unref(openModal)(
                                `/api/admin-secure/schedules-cheque-data/${s.id}`,
                                `/api/admin-secure/schedules-cheque-edit/${s.id}`
                              )
                            }, " Cheque ", 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => viewSchedule(s.loan_id),
                              class: "px-2 py-1 bg-blue-600 text-white rounded text-xs"
                            }, " View ", 8, ["onClick"])
                          ])
                        ]);
                      }), 128)),
                      paginated.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "9",
                          class: "text-center py-6 text-gray-400"
                        }, " No schedules found. ")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ])),
              createVNode("div", { class: "mt-4 flex justify-between" }, [
                createVNode("button", {
                  onClick: prevPage,
                  disabled: page.value === 1,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Prev ", 8, ["disabled"]),
                createVNode("span", { class: "text-sm" }, [
                  createTextVNode(" Page " + toDisplayString(page.value) + " / " + toDisplayString(lastPageValue.value) + " Total Records: ", 1),
                  createVNode("b", null, toDisplayString(total.value), 1)
                ]),
                createVNode("button", {
                  onClick: nextPage,
                  disabled: page.value === lastPageValue.value,
                  class: "px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                }, " Next ", 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(showModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" data-v-3d04ed3c><div class="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200" data-v-3d04ed3c><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800" data-v-3d04ed3c><h2 class="text-lg text-blue-800 dark:text-white" data-v-3d04ed3c>Cheque Schedule</h2><button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600" data-v-3d04ed3c><span class="text-xl" data-v-3d04ed3c>✕</span></button></div><div class="p-6 overflow-y-auto space-y-8" data-v-3d04ed3c><section data-v-3d04ed3c><h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase" data-v-3d04ed3c>Information</h3><div class="grid grid-cols-5 gap-1 bg-slate-50 dark:bg-gray-800/50 p-4 rounded-lg" data-v-3d04ed3c><div data-v-3d04ed3c><label class="block text-xs font-medium text-slate-500 mb-1" data-v-3d04ed3c>Customer</label><input${ssrRenderAttr("value", unref(form).chequeschedule_cust_name_1)} readonly class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" data-v-3d04ed3c></div><div data-v-3d04ed3c><label class="block text-xs font-medium text-slate-500 mb-1" data-v-3d04ed3c>Loan</label><input${ssrRenderAttr("value", unref(form).chequeschedule_loan_id)} readonly class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" data-v-3d04ed3c></div><div data-v-3d04ed3c><label class="block text-xs font-medium text-slate-500 mb-1" data-v-3d04ed3c>Period</label><input${ssrRenderAttr("value", unref(form).chequeschedule_loan_peroid)} readonly class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" data-v-3d04ed3c></div><div class="col-span-2" data-v-3d04ed3c><label class="block text-xs font-medium text-slate-500 mb-1" data-v-3d04ed3c>Banks</label><select class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" data-v-3d04ed3c><option${ssrRenderAttr("value", -1)} disabled data-v-3d04ed3c${ssrIncludeBooleanAttr(Array.isArray(unref(form).chequeschedule_bank_id) ? ssrLooseContain(unref(form).chequeschedule_bank_id, -1) : ssrLooseEqual(unref(form).chequeschedule_bank_id, -1)) ? " selected" : ""}>Choose bank...</option><!--[-->`);
        ssrRenderList(unref(banks), (dd) => {
          _push(`<option${ssrRenderAttr("value", dd.id)} data-v-3d04ed3c${ssrIncludeBooleanAttr(Array.isArray(unref(form).chequeschedule_bank_id) ? ssrLooseContain(unref(form).chequeschedule_bank_id, dd.id) : ssrLooseEqual(unref(form).chequeschedule_bank_id, dd.id)) ? " selected" : ""}>${ssrInterpolate(dd.label)}</option>`);
        });
        _push(`<!--]--></select></div></div></section><section data-v-3d04ed3c><h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase" data-v-3d04ed3c>Cheques</h3><div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto" data-v-3d04ed3c><table class="min-w-[300px] w-full custom-scrollbar text-sm" data-v-3d04ed3c><thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700" data-v-3d04ed3c><tr data-v-3d04ed3c><th class="px-2 py-3 font-semibold" data-v-3d04ed3c>#</th><th class="px-2 py-3 font-semibold text-left" data-v-3d04ed3c>Cheque#</th><th class="px-2 py-3 font-semibold text-left" data-v-3d04ed3c>From</th><th class="px-2 py-3 font-semibold text-left" data-v-3d04ed3c>To</th><th class="px-2 py-3 font-semibold text-left" data-v-3d04ed3c>Total</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800" data-v-3d04ed3c><!--[-->`);
        ssrRenderList(unref(form).cheques || [], (c, i) => {
          _push(`<tr class="${ssrRenderClass(c.locked ? "read-only:bg-slate-50 read-only:text-slate-500 read-only:cursor-not-allowed" : "hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors")}" data-v-3d04ed3c><td class="px-2 py-2 font-medium text-slate-400" data-v-3d04ed3c>${ssrInterpolate(c.cheque_order)}</td><td class="px-2 py-2" data-v-3d04ed3c><input${ssrRenderAttr("value", c.cheque_number)} type="number" class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" data-v-3d04ed3c></td><td class="px-2 py-2" data-v-3d04ed3c><input${ssrRenderAttr("value", c.from)} type="number" class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" data-v-3d04ed3c></td><td class="px-2 py-2" data-v-3d04ed3c><input${ssrRenderAttr("value", c.to)} type="number" class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" data-v-3d04ed3c></td><td class="px-2 py-2" data-v-3d04ed3c>${ssrInterpolate(c.total)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section></div><div class="px-6 py-4 bg-slate-50 dark:bg-gray-800/50 flex items-center justify-end gap-1 border-t border-gray-100 dark:border-gray-800" data-v-3d04ed3c><button class="px-5 py-2 bg-slate-400 hover:bg-slate-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all" data-v-3d04ed3c> Cancel </button><button class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all" data-v-3d04ed3c> Save Cheque </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3d04ed3c"]]);

export { index as default };
//# sourceMappingURL=index-C1uBpmwD.mjs.map
