import { defineComponent, ref, reactive, withAsyncContext, computed, watchEffect, watch, unref, withCtx, createVNode, withDirectives, createBlock, createCommentVNode, withModifiers, openBlock, Fragment, renderList, toDisplayString, vModelSelect, isRef, vModelText, createTextVNode, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { z } from 'zod';
import { useRoute } from 'vue-router';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as ComponentSubmitCard } from './ComponentSubmitCard-DMcrW17G.mjs';
import { _ as _export_sfc, w as useRequestHeaders } from './server.mjs';
import { u as useAsyncData } from './asyncData-CQK02fck.mjs';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
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
import 'perfect-debounce';

const MIN_FILE_SIZE = 1.01 * 1024 * 1024;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id] copy",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { successMsg, errorMsg } = useMessage();
    const loading = ref(false);
    const errors = reactive({});
    const route = useRoute();
    const id = route.params.id;
    errorMsg.value = null;
    successMsg.value = null;
    const customerName1 = ref([]);
    const currencies = ref([]);
    const loanTypes = ref([]);
    const sourceMoneys = ref([]);
    const paybacks = ref([]);
    const loanStatuses = ref([]);
    const loanCheckStatuses = ref([]);
    const loanGroupPositions = ref([]);
    const form = reactive({
      cust_id: -1,
      currency_id: 1,
      loan_lastcash: 0,
      loan_newcash: 0,
      loan_totalcash: 0,
      loan_principle: 0,
      source_money: "",
      loantype_id: -1,
      loan_over_draft: 0,
      payback_id: 1,
      loan_peroid: 1,
      loan_startdate: "",
      loan_enddate: "",
      loan_interest_rate: 0,
      invoice_id: "",
      loan_status_id: 1,
      cust_comission_id: -1,
      cust_comission_interest_rate: 0,
      cust_loangroup_id: -1,
      cust_guarantor_id: -1,
      cust_position_loangroup_id: -1,
      loan_collateral_1: "",
      loan_collateral_map_link_1: "",
      loan_collateral_doc_1: null,
      loan_collateral_doc_1_src: null,
      loan_collateral_doc_1_check: false,
      loan_collateral_2: "",
      loan_collateral_map_link_2: "",
      loan_collateral_doc_2: null,
      loan_collateral_doc_2_src: null,
      loan_collateral_doc_2_check: false,
      loan_note: "",
      active: 1,
      loan_check_status: 0,
      loan_check_approver: 0,
      loan_check_date: "",
      loan_startdate_principle: ""
    });
    const headers = useRequestHeaders(["cookie"]);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `loanrecord-${id}`,
      () => $fetch(`/api/admin-secure/loanrecords/${id}`, { headers })
    )), __temp = await __temp, __restore(), __temp);
    const loanrecord = computed(() => data.value?.data ?? null);
    function formatDateForInput(date) {
      if (!date) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const [d, m, y] = date.split("-");
      return `${y}-${m}-${d}`;
    }
    watchEffect(() => {
      const lastCash = Number(String(form.loan_lastcash).replace(/,/g, "") || 0);
      const newCash = Number(String(form.loan_newcash).replace(/,/g, "") || 0);
      form.loan_totalcash = lastCash + newCash;
    });
    watch(loanrecord, (l) => {
      if (!l) return;
      Object.assign(form, {
        id: l.id,
        cust_id: l.cust_id ?? -1,
        currency_id: l.currency_id ?? 1,
        loan_lastcash: l.loan_lastcash ?? 0,
        loan_newcash: l.loan_newcash ?? 0,
        loan_totalcash: l.loan_totalcash ?? 0,
        loan_principle: l.loan_principle ?? 0,
        source_money: l.source_money ?? "",
        loantype_id: l.loantype_id ?? -1,
        loan_over_draft: l.loan_over_draft ?? 0,
        payback_id: l.payback_id ?? 1,
        loan_peroid: l.loan_peroid ?? 1,
        loan_startdate: formatDateForInput(l.loan_startdate ?? ""),
        loan_enddate: formatDateForInput(l.loan_enddate ?? ""),
        loan_interest_rate: l.loan_interest_rate ?? 0,
        invoice_id: (l.invoice?.invoice_type ?? "") + String(l.invoice_id).padStart(8, "0"),
        loan_status_id: l.loan_status_id ?? 1,
        loan_check_status: l.loan_check_status ?? 0,
        cust_comission_id: l.cust_comission_id ?? -1,
        cust_comission_interest_rate: l.cust_comission_interest_rate ?? 0,
        cust_loangroup_id: l.cust_loangroup_id ?? -1,
        cust_guarantor_id: l.cust_guarantor_id ?? -1,
        cust_position_loangroup_id: l.cust_position_loangroup_id ?? -1,
        loan_collateral_1: l.loan_collateral_1 ?? "",
        loan_collateral_map_link_1: l.loan_collateral_map_link_1 ?? "",
        loan_collateral_doc_1: l.loan_collateral_doc_1 ?? "",
        loan_collateral_doc_1_src: l.loan_collateral_doc_1_url ?? null,
        loan_collateral_doc_1_check: !!l.loan_collateral_doc_1_url,
        loan_collateral_2: l.loan_collateral_2 ?? "",
        loan_collateral_map_link_2: l.loan_collateral_map_link_2 ?? "",
        loan_collateral_doc_2: l.loan_collateral_doc_2 ?? "",
        loan_collateral_doc_2_src: l.loan_collateral_doc_2_url ?? null,
        loan_collateral_doc_2_check: !!l.loan_collateral_doc_2_url,
        loan_note: l.loan_note ?? ""
      });
    }, { immediate: true });
    watch(
      () => [form.loan_startdate, form.loan_peroid, form.loantype_id],
      ([start, period, loantype]) => {
        if (!start || !period || loantype === void 0 || loantype === null) return;
        const startDate = new Date(start);
        form.loan_startdate = String(start);
        let endDate = new Date(startDate);
        const loanTypeNum = Number(loantype);
        const periodNum = Number(period);
        if (loanTypeNum <= 31) {
          endDate.setMonth(endDate.getMonth() + periodNum);
          endDate.setDate(endDate.getDate() - 1);
        } else if (loanTypeNum === 32) {
          endDate.setDate(endDate.getDate() + periodNum * 7 - 1);
        } else if (loanTypeNum === 35) {
          endDate.setDate(endDate.getDate() + periodNum * 10 - 1);
        } else {
          endDate.setDate(endDate.getDate() + periodNum - 1);
        }
        form.loan_enddate = endDate.toISOString().split("T")[0] ?? "";
      }
    );
    const schema = z.object({
      cust_id: z.number().min(1, "Please select"),
      currency_id: z.number().min(1, "Please select"),
      loan_lastcash: z.coerce.number().min(0, "Required"),
      loan_newcash: z.coerce.number().min(0, "Required"),
      loan_totalcash: z.coerce.number().min(0, "Required"),
      loan_principle: z.coerce.number().min(0, "Required"),
      source_money: z.string().nonempty("Required"),
      loantype_id: z.number().min(1, "Please select"),
      loan_over_draft: z.coerce.number().optional(),
      payback_id: z.number().min(1, "Please select"),
      loan_peroid: z.coerce.number().min(1, "Required"),
      loan_startdate: z.string().nonempty("Required"),
      loan_enddate: z.string().nonempty("Required"),
      loan_interest_rate: z.coerce.number().min(1e-6, "Required"),
      invoice_id: z.string().optional(),
      loan_status_id: z.number().min(1, "Please select"),
      loan_check_status: z.number().optional(),
      cust_comission_id: z.number().min(1, "Please select"),
      cust_comission_interest_rate: z.coerce.number().min(0, "Required"),
      cust_loangroup_id: z.number().min(1, "Please select"),
      active: z.number().min(1, "required"),
      cust_guarantor_id: z.number().optional(),
      cust_position_loangroup_id: z.number().min(1, "Please select"),
      loan_collateral_1: z.string().optional(),
      loan_collateral_map_link_1: z.string().optional(),
      loan_collateral_doc_1: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" }),
      loan_collateral_2: z.string().optional(),
      loan_collateral_map_link_2: z.string().optional(),
      loan_collateral_doc_2: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" }),
      loan_note: z.string().optional()
    });
    const updateForm = async () => {
      loading.value = true;
      errorMsg.value = "";
      successMsg.value = "";
      form.loan_startdate_principle = form.loan_startdate;
      Object.keys(errors).forEach((k) => errors[k] = "");
      try {
        const newForm = { ...form };
        newForm.loan_collateral_doc_1 = form.loan_collateral_doc_1;
        newForm.loan_collateral_doc_2 = form.loan_collateral_doc_2;
        const numericFields = [
          "loan_lastcash",
          "loan_newcash",
          "loan_totalcash",
          "loan_principle",
          "loan_over_draft",
          "loan_interest_rate",
          "cust_comission_interest_rate",
          "loan_peroid",
          "currency_id",
          "loantype_id",
          "payback_id",
          "loan_status_id",
          "loan_check_status",
          "cust_id",
          "cust_comission_id",
          "cust_loangroup_id",
          "cust_guarantor_id",
          "cust_position_loangroup_id",
          "active"
        ];
        numericFields.forEach((field) => {
          const value = newForm[field];
          if (typeof value === "string") {
            newForm[field] = parseFloat(value.replace(/,/g, "")) || 0;
          } else {
            newForm[field] = Number(value) || 0;
          }
        });
        const parsed = schema.safeParse(newForm);
        if (!parsed.success) {
          parsed.error.errors.forEach((e) => {
            const path = e.path[0];
            if (typeof path === "string" || typeof path === "number") {
              errors[path] = e.message;
            }
          });
          errorMsg.value = "Please fix the validation errors before submitting.";
          loading.value = false;
          return;
        }
        const body = parsed.data;
        const safeBody = Object.fromEntries(
          Object.entries(body).map(([k, v]) => {
            if (v === "" || v === -1) return [k, null];
            return [k, v];
          })
        );
        await $fetch(`/api/admin-secure/loanrecords/${id}`, {
          method: "PUT",
          body: safeBody
        });
        successMsg.value = "Loan updated successfully!";
      } catch (err) {
        if (err.errors) {
          err.errors.forEach((e) => {
            errors[e.path[0]] = e.message;
          });
        } else {
          errorMsg.value = "Error while saving";
        }
      } finally {
        loading.value = false;
      }
    };
    const search = ref("");
    const isOpen = ref(false);
    const highlightedIndex = ref(0);
    const filteredCustomers = computed(() => {
      if (!search.value) return customerName1.value;
      const term = search.value.toLowerCase();
      return customerName1.value.filter(
        (c) => String(c.id).includes(term) || c.label.toLowerCase().includes(term)
      );
    });
    function selectCustomer(c) {
      form.cust_id = c.id;
      search.value = c.label;
      isOpen.value = false;
      highlightedIndex.value = 0;
    }
    function onKeydown(e) {
      if (!isOpen.value) return;
      if (e.key === "ArrowDown") {
        highlightedIndex.value = (highlightedIndex.value + 1) % filteredCustomers.value.length;
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        highlightedIndex.value = (highlightedIndex.value - 1 + filteredCustomers.value.length) % filteredCustomers.value.length;
        e.preventDefault();
      } else if (e.key === "Enter") {
        selectCustomer(filteredCustomers.value[highlightedIndex.value]);
        e.preventDefault();
      } else if (e.key === "Escape") {
        isOpen.value = false;
      }
    }
    watch(form, () => {
      const selected = customerName1.value.find((c) => c.id === form.cust_id);
      if (selected) search.value = selected.label;
    });
    function onInput(event, field) {
      const target = event.target;
      if (!target) return;
      const cleanValue = target.value.replace(/,/g, "");
      const numericValue = parseFloat(cleanValue);
      form[field] = isNaN(numericValue) ? 0 : numericValue;
      target.value = form[field].toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const isloan_collateral_map_link_1_Valid = computed(() => {
      return form.loan_collateral_map_link_1;
    });
    const isloan_collateral_map_link_2_Valid = computed(() => {
      return form.loan_collateral_map_link_2;
    });
    const openLink = (url) => {
      if (!url) return;
      (void 0).open(url, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-130c8583>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-130c8583>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loanrecord)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4" data-v-130c8583>`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. General Information" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative select-container" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Customer</label><select class="input w-full" data-v-130c8583${_scopeId}><option value="" class="hidden" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_id) ? ssrLooseContain(unref(form).cust_id, "") : ssrLooseEqual(unref(form).cust_id, "")) ? " selected" : ""}${_scopeId}>Select customer</option><!--[-->`);
              ssrRenderList(unref(customerName1), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} class="hidden" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_id) ? ssrLooseContain(unref(form).cust_id, c.id) : ssrLooseEqual(unref(form).cust_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (unref(isOpen)) {
                _push2(`<div class="absolute z-10 w-full mt-1" data-v-130c8583${_scopeId}><input type="text"${ssrRenderAttr("value", unref(search))} placeholder="Search ..." class="input w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" autocomplete="off" data-v-130c8583${_scopeId}>`);
                if (unref(filteredCustomers).length) {
                  _push2(`<ul class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" data-v-130c8583${_scopeId}><!--[-->`);
                  ssrRenderList(unref(filteredCustomers), (c, index) => {
                    _push2(`<li class="${ssrRenderClass([
                      "px-3 py-1 cursor-pointer transition-colors",
                      index === unref(highlightedIndex) ? "bg-blue-500 text-white dark:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    ])}" data-v-130c8583${_scopeId}>${ssrInterpolate(c.id)} - ${ssrInterpolate(c.label)}</li>`);
                  });
                  _push2(`<!--]--></ul>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Currency<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).currency_id)}</span></div><select class="input" data-v-130c8583${_scopeId}><!--[-->`);
              ssrRenderList(unref(currencies), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).currency_id) ? ssrLooseContain(unref(form).currency_id, c.id) : ssrLooseEqual(unref(form).currency_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Last Cash<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_lastcash)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_lastcash.toLocaleString())} data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>New Cash<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_newcash)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_newcash.toLocaleString())} data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Total Cash<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_totalcash)}</span></div><input type="text" class="input bg-gray-100 cursor-not-allowed"${ssrRenderAttr("value", unref(form).loan_totalcash.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} readonly data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Principle<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_principle)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_principle.toLocaleString())} data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Source Money<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).source_money)}</span></div><input${ssrRenderAttr("value", unref(form).source_money)} list="sourceMoneyList" class="input" placeholder="Type source..." data-v-130c8583${_scopeId}><datalist id="sourceMoneyList" data-v-130c8583${_scopeId}><!--[-->`);
              ssrRenderList(unref(sourceMoneys), (s) => {
                _push2(`<option${ssrRenderAttr("value", s)} data-v-130c8583${_scopeId}></option>`);
              });
              _push2(`<!--]--></datalist></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Loan Type<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loantype_id)}</span></div><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).loantype_id) ? ssrLooseContain(unref(form).loantype_id, "-1") : ssrLooseEqual(unref(form).loantype_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(loanTypes), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).loantype_id) ? ssrLooseContain(unref(form).loantype_id, l.id) : ssrLooseEqual(unref(form).loantype_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Over Draft</label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_over_draft)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_over_draft.toLocaleString())} data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Payback<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).payback_id)}</span></div><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).payback_id) ? ssrLooseContain(unref(form).payback_id, "-1") : ssrLooseEqual(unref(form).payback_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(paybacks), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).payback_id) ? ssrLooseContain(unref(form).payback_id, l.id) : ssrLooseEqual(unref(form).payback_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Loan Period<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_peroid)}</span></div><input${ssrRenderAttr("value", unref(form).loan_peroid)} type="number" class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Start Date<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_startdate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_startdate)} type="date" class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>End Date<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_enddate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_enddate)} type="date" class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Interest Rate (%) <span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_interest_rate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_interest_rate)} type="number" step="0.01" class="input" data-v-130c8583${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "relative select-container" }, [
                  createVNode("label", { class: "label" }, "Customer"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_id = $event,
                    class: "input w-full",
                    onClick: withModifiers(($event) => isOpen.value = true, ["prevent"])
                  }, [
                    createVNode("option", {
                      value: "",
                      class: "hidden"
                    }, "Select customer"),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(customerName1), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id,
                        class: "hidden"
                      }, toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue", "onClick"]), [
                    [
                      vModelSelect,
                      unref(form).cust_id,
                      void 0,
                      { number: true }
                    ]
                  ]),
                  unref(isOpen) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute z-10 w-full mt-1"
                  }, [
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                      onKeydown,
                      placeholder: "Search ...",
                      class: "input w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
                      autocomplete: "off"
                    }, null, 40, ["onUpdate:modelValue"]), [
                      [vModelText, unref(search)]
                    ]),
                    unref(filteredCustomers).length ? (openBlock(), createBlock("ul", {
                      key: 0,
                      class: "absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredCustomers), (c, index) => {
                        return openBlock(), createBlock("li", {
                          key: c.id,
                          onMousedown: withModifiers(($event) => selectCustomer(c), ["prevent"]),
                          onMouseenter: ($event) => highlightedIndex.value = index,
                          class: [
                            "px-3 py-1 cursor-pointer transition-colors",
                            index === unref(highlightedIndex) ? "bg-blue-500 text-white dark:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          ]
                        }, toDisplayString(c.id) + " - " + toDisplayString(c.label), 43, ["onMousedown", "onMouseenter"]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Currency"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).currency_id), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).currency_id = $event,
                    class: "input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(currencies), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id
                      }, toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).currency_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Last Cash"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_lastcash), 1)
                  ]),
                  createVNode("input", {
                    type: "text",
                    class: "input",
                    value: unref(form).loan_lastcash.toLocaleString(),
                    onInput: (e) => onInput(e, "loan_lastcash")
                  }, null, 40, ["value", "onInput"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("New Cash"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_newcash), 1)
                  ]),
                  createVNode("input", {
                    type: "text",
                    class: "input",
                    value: unref(form).loan_newcash.toLocaleString(),
                    onInput: (e) => onInput(e, "loan_newcash")
                  }, null, 40, ["value", "onInput"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Total Cash"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_totalcash), 1)
                  ]),
                  createVNode("input", {
                    type: "text",
                    class: "input bg-gray-100 cursor-not-allowed",
                    value: unref(form).loan_totalcash.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    readonly: ""
                  }, null, 8, ["value"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Principle"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_principle), 1)
                  ]),
                  createVNode("input", {
                    type: "text",
                    class: "input",
                    value: unref(form).loan_principle.toLocaleString(),
                    onInput: (e) => onInput(e, "loan_principle")
                  }, null, 40, ["value", "onInput"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Source Money"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).source_money), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).source_money = $event,
                    list: "sourceMoneyList",
                    class: "input",
                    placeholder: "Type source..."
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).source_money]
                  ]),
                  createVNode("datalist", { id: "sourceMoneyList" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(sourceMoneys), (s) => {
                      return openBlock(), createBlock("option", {
                        key: s,
                        value: s
                      }, null, 8, ["value"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Loan Type"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loantype_id), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).loantype_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(loanTypes), (l) => {
                      return openBlock(), createBlock("option", {
                        key: l.id,
                        value: l.id
                      }, toDisplayString(l.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).loantype_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Over Draft"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_over_draft), 1)
                  ]),
                  createVNode("input", {
                    type: "text",
                    class: "input",
                    value: unref(form).loan_over_draft.toLocaleString(),
                    onInput: (e) => onInput(e, "loan_over_draft")
                  }, null, 40, ["value", "onInput"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Payback"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).payback_id), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).payback_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(paybacks), (l) => {
                      return openBlock(), createBlock("option", {
                        key: l.id,
                        value: l.id
                      }, toDisplayString(l.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).payback_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Loan Period"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_peroid), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_peroid = $event,
                    type: "number",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).loan_peroid,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Start Date"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_startdate), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_startdate = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_startdate]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("End Date"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_enddate), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_enddate = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_enddate]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Interest Rate (%) "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_interest_rate), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_interest_rate = $event,
                    type: "number",
                    step: "0.01",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).loan_interest_rate,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ComponentCard, { title: "2. Guarantor/Comission" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Comission Customer<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).cust_comission_id)}</span><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_comission_id) ? ssrLooseContain(unref(form).cust_comission_id, "-1") : ssrLooseEqual(unref(form).cust_comission_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
              ssrRenderList(unref(customerName1), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_comission_id) ? ssrLooseContain(unref(form).cust_comission_id, c.id) : ssrLooseEqual(unref(form).cust_comission_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(String(c.id).padStart(8, "0"))} - ${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Comission Interest Rate (%)<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).cust_comission_interest_rate)}</span><input${ssrRenderAttr("value", unref(form).cust_comission_interest_rate)} type="number" step="0.01" class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Loan Group<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).cust_loangroup_id)}</span><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_loangroup_id) ? ssrLooseContain(unref(form).cust_loangroup_id, "-1") : ssrLooseEqual(unref(form).cust_loangroup_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
              ssrRenderList(unref(customerName1), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_loangroup_id) ? ssrLooseContain(unref(form).cust_loangroup_id, c.id) : ssrLooseEqual(unref(form).cust_loangroup_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(String(c.id).padStart(8, "0"))} - ${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Guarantor Customer</label><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_guarantor_id) ? ssrLooseContain(unref(form).cust_guarantor_id, "-1") : ssrLooseEqual(unref(form).cust_guarantor_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
              ssrRenderList(unref(customerName1), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_guarantor_id) ? ssrLooseContain(unref(form).cust_guarantor_id, c.id) : ssrLooseEqual(unref(form).cust_guarantor_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(String(c.id).padStart(8, "0"))} - ${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Position in Loan Group<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).cust_position_loangroup_id)}</span><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_position_loangroup_id) ? ssrLooseContain(unref(form).cust_position_loangroup_id, "-1") : ssrLooseEqual(unref(form).cust_position_loangroup_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
              ssrRenderList(unref(loanGroupPositions), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_position_loangroup_id) ? ssrLooseContain(unref(form).cust_position_loangroup_id, c.id) : ssrLooseEqual(unref(form).cust_position_loangroup_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Invoice ID</label></div><input${ssrRenderAttr("value", unref(form).invoice_id)} type="text" class="input" readonly data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Status<span class="text-red-500 text-sm" data-v-130c8583${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_status_id)}</span></div><select class="input" data-v-130c8583${_scopeId}><option value="-1" data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_status_id) ? ssrLooseContain(unref(form).loan_status_id, "-1") : ssrLooseEqual(unref(form).loan_status_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(loanStatuses), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_status_id) ? ssrLooseContain(unref(form).loan_status_id, l.id) : ssrLooseEqual(unref(form).loan_status_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Approver</label></div><select class="input" data-v-130c8583${_scopeId}><!--[-->`);
              ssrRenderList(unref(loanCheckStatuses), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-130c8583${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_check_status) ? ssrLooseContain(unref(form).loan_check_status, l.id) : ssrLooseEqual(unref(form).loan_check_status, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Comission Customer"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_comission_id), 1),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_comission_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose ..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(customerName1), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id
                      }, toDisplayString(String(c.id).padStart(8, "0")) + " - " + toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_comission_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Comission Interest Rate (%)"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_comission_interest_rate), 1),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_comission_interest_rate = $event,
                    type: "number",
                    step: "0.01",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).cust_comission_interest_rate,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Loan Group"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_loangroup_id), 1),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_loangroup_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose ..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(customerName1), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id
                      }, toDisplayString(String(c.id).padStart(8, "0")) + " - " + toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_loangroup_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Guarantor Customer"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_guarantor_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose ..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(customerName1), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id
                      }, toDisplayString(String(c.id).padStart(8, "0")) + " - " + toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_guarantor_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Position in Loan Group"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_position_loangroup_id), 1),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_position_loangroup_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose ..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(loanGroupPositions), (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.id
                      }, toDisplayString(c.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_position_loangroup_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Invoice ID")
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).invoice_id = $event,
                    type: "text",
                    class: "input",
                    readonly: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).invoice_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Status"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_status_id), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_status_id = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, "Choose..."),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(loanStatuses), (l) => {
                      return openBlock(), createBlock("option", {
                        key: l.id,
                        value: l.id
                      }, toDisplayString(l.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).loan_status_id,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Approver")
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_check_status = $event,
                    class: "input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(loanCheckStatuses), (l) => {
                      return openBlock(), createBlock("option", {
                        key: l.id,
                        value: l.id
                      }, toDisplayString(l.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).loan_check_status,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ComponentSubmitCard, {
          title: "3. Collateral/Note",
          class: "h-full"
        }, {
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-130c8583${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400" data-v-130c8583${_scopeId}>`);
              if (unref(loading)) {
                _push2(`<svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-130c8583${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-130c8583${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" data-v-130c8583${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-130c8583${_scopeId}>${ssrInterpolate(unref(loading) ? "Saving..." : "Update Loan")}</span></button></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("button", {
                    onClick: updateForm,
                    type: "button",
                    disabled: unref(loading),
                    class: "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  }, [
                    unref(loading) ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "w-5 h-5 animate-spin text-white",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("circle", {
                        class: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        "stroke-width": "4"
                      }),
                      createVNode("path", {
                        class: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      })
                    ])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(unref(loading) ? "Saving..." : "Update Loan"), 1)
                  ], 8, ["disabled"])
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Collateral 1</label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_1)}</span></div><textarea class="input" rows="6" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_1)}</textarea></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isloan_collateral_map_link_1_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-130c8583${_scopeId}> Collateral 1 Map link `);
              if (unref(isloan_collateral_map_link_1_Valid)) {
                _push2(`<span data-v-130c8583${_scopeId}> 📌</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).loan_collateral_map_link_1)} class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Collateral 2</label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_2)}</span></div><textarea class="input" rows="6" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_2)}</textarea></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isloan_collateral_map_link_2_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-130c8583${_scopeId}> Collateral 2 Map link `);
              if (unref(isloan_collateral_map_link_2_Valid)) {
                _push2(`<span data-v-130c8583${_scopeId}> 📌</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).loan_collateral_map_link_2)} class="input" data-v-130c8583${_scopeId}></div><div data-v-130c8583${_scopeId}><div class="flex items-center justify-between" data-v-130c8583${_scopeId}><label class="label" data-v-130c8583${_scopeId}>Note</label><span class="text-red-500 text-sm" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(errors).loan_note)}</span></div><textarea class="input" rows="6" data-v-130c8583${_scopeId}>${ssrInterpolate(unref(form).loan_note)}</textarea></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Collateral 1"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_collateral_1), 1)
                  ]),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_collateral_1 = $event,
                    class: "input",
                    rows: "6"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_collateral_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", {
                      class: [
                        "label",
                        unref(isloan_collateral_map_link_1_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
                      ],
                      onClick: ($event) => unref(isloan_collateral_map_link_1_Valid) && openLink(unref(form).loan_collateral_map_link_1)
                    }, [
                      createTextVNode(" Collateral 1 Map link "),
                      unref(isloan_collateral_map_link_1_Valid) ? (openBlock(), createBlock("span", { key: 0 }, " 📌")) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_collateral_map_link_1 = $event,
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_collateral_map_link_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Collateral 2"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_collateral_2), 1)
                  ]),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_collateral_2 = $event,
                    class: "input",
                    rows: "6"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_collateral_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", {
                      class: [
                        "label",
                        unref(isloan_collateral_map_link_2_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
                      ],
                      onClick: ($event) => unref(isloan_collateral_map_link_2_Valid) && openLink(unref(form).loan_collateral_map_link_2)
                    }, [
                      createTextVNode(" Collateral 2 Map link "),
                      unref(isloan_collateral_map_link_2_Valid) ? (openBlock(), createBlock("span", { key: 0 }, " 📌")) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_collateral_map_link_2 = $event,
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_collateral_map_link_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Note"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_note), 1)
                  ]),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_note = $event,
                    class: "input",
                    rows: "6"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_note]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/[id] copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id__copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-130c8583"]]);

export { _id__copy as default };
//# sourceMappingURL=_id_ copy-C0MHLC7b.mjs.map
