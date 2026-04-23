import { defineComponent, ref, reactive, watch, unref, withCtx, createVNode, createBlock, withDirectives, openBlock, vModelText, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as CommonCustomerSelect2 } from './CommonCustomerSelect2-DhkPWY8w.mjs';
import { C as ComponentGrowCard } from './ComponentGrowCard-D1HotIDG.mjs';
import { u as useSchedule } from './useSchedule-2pm0j-3j.mjs';
import { f as formatDateForOutput } from './date-D_--uZCu.mjs';
import { u as usePagination } from './usePagination-DqIPbfBm.mjs';
import { _ as _export_sfc, u as useHead, n as navigateTo } from './server.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Create schedules",
      meta: [{ name: "loanrecords", content: "create schedules" }]
    });
    const { schedules, generateSchedule } = useSchedule();
    const {
      currentPage,
      totalPages,
      paginatedData: paginatedSchedules,
      nextPage,
      prevPage
    } = usePagination(schedules, 10);
    const { successMsg, errorMsg } = useMessage();
    const loading = ref(false);
    const errors = reactive({});
    errorMsg.value = null;
    successMsg.value = null;
    const customers = ref([]);
    const loanrecords = ref([]);
    const form = reactive({
      loan_id: -1,
      cust_name_1: "",
      cust_name_2: "",
      loan_startdate: "",
      loan_first_paid_date: "",
      loan_enddate: "",
      currency_en: "",
      loan_totalcash: "",
      loan_principle: "",
      loan_interest_rate: "",
      loan_peroid: 0,
      loantype_id: 0,
      loantype_detail: "",
      loan_over_draft: ""
    });
    watch(
      () => form.loan_id,
      (newLoanId) => {
        if (newLoanId == -1) {
          form.cust_name_1 = "";
          form.cust_name_2 = "";
          form.loan_startdate = "";
          form.loan_first_paid_date = "";
          form.loan_enddate = "";
          form.currency_en = "";
          form.loan_totalcash = "";
          form.loan_principle = "";
          form.loan_interest_rate = "";
          form.loan_peroid = 0;
          form.loantype_detail = "";
          form.loantype_id = 0;
          form.loan_over_draft = "";
          return;
        }
        const selectedLoan = loanrecords.value.find((lr) => lr.id === newLoanId);
        if (selectedLoan) {
          form.cust_name_2 = selectedLoan.customer?.cust_name_2 ?? "";
          form.cust_name_2 = selectedLoan.customer?.cust_name_2 ?? "";
          form.loan_startdate = selectedLoan.loan_startdate ?? "";
          form.loan_first_paid_date = selectedLoan.loan_first_paid_date ?? "";
          form.loan_enddate = selectedLoan.loan_enddate ?? "";
          form.currency_en = selectedLoan.currency?.currency_en ?? "";
          form.loan_totalcash = selectedLoan.loan_totalcash;
          form.loan_principle = selectedLoan.loan_principle;
          form.loan_interest_rate = selectedLoan.loan_interest_rate;
          form.loan_peroid = selectedLoan.loan_peroid ?? 0;
          form.loantype_id = selectedLoan.loantype_id ?? 0;
          form.loantype_detail = selectedLoan.loantype?.loantype_detail ?? "";
          form.loan_over_draft = selectedLoan.loan_over_draft ?? "";
          generateSchedule(form);
        }
      },
      { immediate: true }
      // 🔥 important
    );
    const submitForm = async () => {
      loading.value = true;
      errorMsg.value = null;
      successMsg.value = null;
      console.log("Schedules:", schedules.value);
      const payload = {
        loan_id: form.loan_id,
        schedule_paymentnumber: schedules.value.map((s) => s.schedule_paymentnumber),
        schedule_startdate: schedules.value.map((s) => s.schedule_startdate),
        schedule_enddate: schedules.value.map((s) => s.schedule_enddate),
        schedule_totaldays: schedules.value.map((s) => Number(s.schedule_totaldays || 0)),
        schedule_outstanding: schedules.value.map((s) => Number(s.schedule_outstanding || 0)),
        schedule_over_draft: schedules.value.map((s) => Number(s.schedule_over_draft || 0)),
        schedule_principle: schedules.value.map((s) => Number(s.schedule_principle || 0)),
        schedule_interest_rate: schedules.value.map((s) => Number(s.schedule_interest_rate || 0)),
        schedule_interest: schedules.value.map((s) => Number(s.schedule_interest || 0)),
        schedule_totalpay: schedules.value.map((s) => Number(s.schedule_totalpay || 0))
      };
      console.log("Payload:", payload);
      try {
        const res = await $fetch("/api/admin-secure/schedules", {
          method: "POST",
          body: payload
        });
        console.log(res.loan_id);
        successMsg.value = res.message;
        if (res && res.loan_id) {
          await navigateTo(`/app/dashboard/schedules/${res.loan_id}`);
        }
      } catch (err) {
        console.log("FULL ERROR:", err);
        console.log("DATA:", err?.data);
        console.log("MESSAGE:", err?.data?.message);
        if (err.errors) {
          err.errors.forEach((e) => {
            const path = e.path[0];
            if (typeof path === "string" || typeof path === "number") {
              errors[path] = e.message;
            }
          });
        } else {
          errorMsg.value = "Error while saving loanrecord";
        }
      } finally {
        loading.value = false;
      }
    };
    watch(
      () => [form.loantype_id, form.loan_over_draft],
      // watch relevant dependencies
      () => {
        if (form.loan_id > 0) {
          generateSchedule(form);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-a5b5d0ad>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-a5b5d0ad>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(ComponentCard, { title: "1. Infomation" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-v-a5b5d0ad${_scopeId}><div data-v-a5b5d0ad${_scopeId}>`);
            _push2(ssrRenderComponent(CommonCustomerSelect2, {
              label: "Customer",
              modelValue: form.loan_id,
              "onUpdate:modelValue": ($event) => form.loan_id = $event,
              required: true,
              error: errors.cust_id,
              options: customers.value
            }, null, _parent2, _scopeId));
            _push2(`<div class="py-3" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Spouse/Partner</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.cust_name_2)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Loan ID</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_id)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div></div><div data-v-a5b5d0ad${_scopeId}><div class="" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Start Date</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", unref(formatDateForOutput)(new Date(form.loan_startdate)))} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>First Paid Date</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_first_paid_date ? unref(formatDateForOutput)(new Date(form.loan_first_paid_date)) : "")} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Currency</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.currency_en)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div></div><div data-v-a5b5d0ad${_scopeId}><div class="" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Total Cash</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_totalcash)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Principle</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_principle)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Interest Rate</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_interest_rate)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div></div><div data-v-a5b5d0ad${_scopeId}><div class="" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Period</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_peroid)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Loan Type</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loantype_detail)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div><div class="py-2" data-v-a5b5d0ad${_scopeId}><label class="label" data-v-a5b5d0ad${_scopeId}>Over Draft</label>`);
            if (form.loan_id === -1) {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly data-v-a5b5d0ad${_scopeId}>`);
            } else {
              _push2(`<input class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"${ssrRenderAttr("value", form.loan_over_draft)} readonly data-v-a5b5d0ad${_scopeId}>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }, [
                createVNode("div", null, [
                  createVNode(CommonCustomerSelect2, {
                    label: "Customer",
                    modelValue: form.loan_id,
                    "onUpdate:modelValue": ($event) => form.loan_id = $event,
                    required: true,
                    error: errors.cust_id,
                    options: customers.value
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error", "options"]),
                  createVNode("div", { class: "py-3" }, [
                    createVNode("label", { class: "label" }, "Spouse/Partner"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.cust_name_2 = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.cust_name_2]
                    ])
                  ]),
                  createVNode("div", { class: "" }, [
                    createVNode("label", { class: "label" }, "Loan ID"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_id = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_id]
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "" }, [
                    createVNode("label", { class: "label" }, "Start Date"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : (openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      value: unref(formatDateForOutput)(new Date(form.loan_startdate)),
                      readonly: ""
                    }, null, 8, ["value"]))
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "First Paid Date"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : (openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      value: form.loan_first_paid_date ? unref(formatDateForOutput)(new Date(form.loan_first_paid_date)) : "",
                      readonly: ""
                    }, null, 8, ["value"]))
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "Currency"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.currency_en = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.currency_en]
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "" }, [
                    createVNode("label", { class: "label" }, "Total Cash"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_totalcash = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_totalcash]
                    ])
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "Principle"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_principle = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_principle]
                    ])
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "Interest Rate"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_interest_rate = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_interest_rate]
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "" }, [
                    createVNode("label", { class: "label" }, "Period"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_peroid = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_peroid]
                    ])
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "Loan Type"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loantype_detail = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loantype_detail]
                    ])
                  ]),
                  createVNode("div", { class: "py-2" }, [
                    createVNode("label", { class: "label" }, "Over Draft"),
                    form.loan_id === -1 ? (openBlock(), createBlock("input", {
                      key: 0,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      readonly: ""
                    })) : withDirectives((openBlock(), createBlock("input", {
                      key: 1,
                      class: "input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.loan_over_draft = $event,
                      readonly: ""
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.loan_over_draft]
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentGrowCard, {
        title: "2. Generate Schedule",
        class: "mt-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-full overflow-x-auto custom-scrollbar" data-v-a5b5d0ad${_scopeId}><table class="min-w-full" data-v-a5b5d0ad${_scopeId}><thead data-v-a5b5d0ad${_scopeId}><tr class="border-b border-gray-200 dark:border-gray-700" data-v-a5b5d0ad${_scopeId}><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>#</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Start</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>End</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Days</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Rate</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Outstanding</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>OverDraft</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Principle</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>Interest</td><td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" data-v-a5b5d0ad${_scopeId}>TotalPay</td></tr></thead><tbody class="border-b divide-y divide-gray-200 dark:divide-gray-700" data-v-a5b5d0ad${_scopeId}><!--[-->`);
            ssrRenderList(unref(paginatedSchedules), (s, index) => {
              _push2(`<tr class="hover:bg-blue-50 dark:hover:bg-white/5 transition" data-v-a5b5d0ad${_scopeId}><td class="text-[14px] px-3 py-2 font-medium text-gray-500" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(s.schedule_paymentnumber)}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(s.schedule_startdate))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(unref(formatDateForOutput)(s.schedule_enddate))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(s.schedule_totaldays)}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_interest_rate || 0).toLocaleString(void 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_outstanding || 0).toLocaleString(void 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_over_draft || 0).toLocaleString(void 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_principle || 0).toLocaleString(void 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}</td><td class="text-[14px] px-3 py-2" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_interest || 0).toLocaleString(void 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }))}</td><td class="text-[14px] px-3 py-2 text-left text-blue-600" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(Number(s.schedule_totalpay || 0).toLocaleString(
                void 0,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              ))}</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (form.loan_id > 0) {
              _push2(`<div class="flex justify-between items-center mt-4" data-v-a5b5d0ad${_scopeId}><div class="flex items-center gap-1" data-v-a5b5d0ad${_scopeId}><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-a5b5d0ad${_scopeId}> Prev </button><span class="text-sm" data-v-a5b5d0ad${_scopeId}> Page ${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))}</span><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50" data-v-a5b5d0ad${_scopeId}> Next </button></div><div class="flex gap-1" data-v-a5b5d0ad${_scopeId}><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-v-a5b5d0ad${_scopeId}>${ssrInterpolate(loading.value ? "Saving..." : "Create")}</button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "max-w-full overflow-x-auto custom-scrollbar" }, [
                createVNode("table", { class: "min-w-full" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "border-b border-gray-200 dark:border-gray-700" }, [
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "#"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Start"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "End"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Days"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Rate"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Outstanding"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "OverDraft"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Principle"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "Interest"),
                      createVNode("td", { class: "px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200" }, "TotalPay")
                    ])
                  ]),
                  createVNode("tbody", { class: "border-b divide-y divide-gray-200 dark:divide-gray-700" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(paginatedSchedules), (s, index) => {
                      return openBlock(), createBlock("tr", {
                        key: index,
                        class: "hover:bg-blue-50 dark:hover:bg-white/5 transition"
                      }, [
                        createVNode("td", { class: "text-[14px] px-3 py-2 font-medium text-gray-500" }, toDisplayString(s.schedule_paymentnumber), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(unref(formatDateForOutput)(s.schedule_startdate)), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(unref(formatDateForOutput)(s.schedule_enddate)), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(s.schedule_totaldays), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(Number(s.schedule_interest_rate || 0).toLocaleString(void 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(Number(s.schedule_outstanding || 0).toLocaleString(void 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(Number(s.schedule_over_draft || 0).toLocaleString(void 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(Number(s.schedule_principle || 0).toLocaleString(void 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2" }, toDisplayString(Number(s.schedule_interest || 0).toLocaleString(void 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })), 1),
                        createVNode("td", { class: "text-[14px] px-3 py-2 text-left text-blue-600" }, toDisplayString(Number(s.schedule_totalpay || 0).toLocaleString(
                          void 0,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )), 1)
                      ]);
                    }), 128))
                  ])
                ])
              ]),
              form.loan_id > 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-between items-center mt-4"
              }, [
                createVNode("div", { class: "flex items-center gap-1" }, [
                  createVNode("button", {
                    onClick: unref(prevPage),
                    disabled: unref(currentPage) === 1,
                    class: "px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  }, " Prev ", 8, ["onClick", "disabled"]),
                  createVNode("span", { class: "text-sm" }, " Page " + toDisplayString(unref(currentPage)) + " / " + toDisplayString(unref(totalPages)), 1),
                  createVNode("button", {
                    onClick: unref(nextPage),
                    disabled: unref(currentPage) === unref(totalPages),
                    class: "px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  }, " Next ", 8, ["onClick", "disabled"])
                ]),
                createVNode("div", { class: "flex gap-1" }, [
                  createVNode("button", {
                    onClick: submitForm,
                    disabled: loading.value,
                    class: "px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  }, toDisplayString(loading.value ? "Saving..." : "Create"), 9, ["disabled"])
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/schedules/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a5b5d0ad"]]);

export { create as default };
//# sourceMappingURL=create-GzWTJOx6.mjs.map
