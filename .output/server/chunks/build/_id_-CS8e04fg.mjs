import { C as CommonCustomerSelect2 } from './CommonCustomerSelect2-DhkPWY8w.mjs';
import { defineComponent, ref, reactive, withAsyncContext, computed, watchEffect, watch, unref, withCtx, createVNode, withDirectives, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, vModelSelect, vModelText, createCommentVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { z } from 'zod';
import { useRoute } from 'vue-router';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as ComponentGrowCard } from './ComponentGrowCard-D1HotIDG.mjs';
import { a as formatDateForInput } from './date-D_--uZCu.mjs';
import { u as useCustomToast } from './useCustomToast-3sc7Vkqz.mjs';
import { _ as _export_sfc, u as useHead, g as useAuth, w as useRequestHeaders } from './server.mjs';
import { u as useAsyncData } from './asyncData-CQK02fck.mjs';
import './number-BUJwr6QZ.mjs';
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

const MIN_FILE_SIZE = 2.01 * 1024 * 1024;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Edit loans",
      meta: [{ name: "loanrecords", content: "edit loan records" }]
    });
    const { showToast } = useCustomToast();
    const { hasRole } = useAuth();
    const { successMsg, errorMsg } = useMessage();
    const loading = ref(false);
    const errors = reactive({});
    const route = useRoute();
    const id = route.params.id;
    errorMsg.value = null;
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
      loan_first_paid_date: "",
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
        loan_first_paid_date: formatDateForInput(l.loan_first_paid_date ?? ""),
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
        loan_collateral_doc_1: l.loan_collateral_doc_1 ?? null,
        loan_collateral_doc_1_src: l.loan_collateral_doc_1_url ?? null,
        // loan_collateral_doc_1_check: !!l.loan_collateral_doc_1_url,
        loan_collateral_doc_1_check: l.loan_collateral_doc_1_url ? 1 : 0,
        loan_collateral_2: l.loan_collateral_2 ?? "",
        loan_collateral_map_link_2: l.loan_collateral_map_link_2 ?? "",
        loan_collateral_doc_2: l.loan_collateral_doc_2 ?? null,
        loan_collateral_doc_2_src: l.loan_collateral_doc_2_url ?? null,
        // loan_collateral_doc_2_check: !!l.loan_collateral_doc_2_url,
        loan_collateral_doc_2_check: l.loan_collateral_doc_2_url ? 1 : 0,
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
      loan_first_paid_date: z.string().nonempty("Required"),
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
      loan_collateral_doc_1: z.any().optional().nullable().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 2MB" }),
      loan_collateral_2: z.string().optional(),
      loan_collateral_map_link_2: z.string().optional(),
      loan_collateral_doc_2: z.any().optional().nullable().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 2MB" }),
      loan_note: z.string().optional()
    });
    const images = {
      loan_collateral_doc_1: { file: null, src: null, check: false },
      loan_collateral_doc_2: { file: null, src: null, check: false }
    };
    const updateFromBackend = (key, url) => {
      images[key].file = null;
      images[key].src = url ? "/storage/" + url + "?v=" + Date.now() : null;
      images[key].check = !!url;
    };
    const updateForm = async () => {
      loading.value = true;
      errorMsg.value = "";
      successMsg.value = "";
      form.loan_startdate_principle = form.loan_startdate;
      Object.keys(errors).forEach((k) => errors[k] = "");
      const newForm = { ...form };
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
      if (!(newForm.loan_collateral_doc_1 instanceof File)) {
        newForm.loan_collateral_doc_1 = void 0;
      }
      if (!(newForm.loan_collateral_doc_2 instanceof File)) {
        newForm.loan_collateral_doc_2 = void 0;
      }
      numericFields.forEach((field) => {
        const value = newForm[field];
        if (typeof value === "string") {
          newForm[field] = parseFloat(value.replace(/,/g, "")) || 0;
        } else {
          newForm[field] = Number(value) || 0;
        }
      });
      try {
        const parsed = schema.safeParse(newForm);
        if (!parsed.success) {
          const errorList = [];
          parsed.error.errors.forEach((e) => {
            const field = e.path.join(".");
            errors[field] = e.message;
            errorList.push(`${field}: ${e.message}`);
          });
          errorMsg.value = "Please fix the validation errors before submitting.";
          loading.value = false;
          return;
        }
        const fd = new FormData();
        const formDataObj = parsed.data;
        Object.entries(formDataObj).forEach(([k, v]) => {
          if (v === -1 || v === "") {
            fd.append(k, "");
          } else {
            fd.append(k, String(v));
          }
        });
        if (newForm.loan_collateral_doc_1 && form.loan_collateral_doc_1_check) fd.append("loan_collateral_doc_1", newForm.loan_collateral_doc_1);
        if (newForm.loan_collateral_doc_2 && form.loan_collateral_doc_2_check) fd.append("loan_collateral_doc_2", newForm.loan_collateral_doc_2);
        if (form.loan_collateral_doc_1_check) fd.append("loan_collateral_doc_1_check", "1");
        if (form.loan_collateral_doc_2_check) fd.append("loan_collateral_doc_2_check", "1");
        fd.append("_method", "PUT");
        await $fetch(`/api/admin-secure/loanrecords/${id}`, {
          method: "POST",
          body: fd
        });
        successMsg.value = "Loan updated successfully!";
        showToast(
          `ID #${id}`,
          `Updated successfully!`,
          `success`
        );
        const refreshed = await $fetch(`/api/admin-secure/loanrecords/${id}`);
        updateFromBackend("loan_collateral_doc_1", refreshed.data.loan_collateral_doc_1_url);
        updateFromBackend("loan_collateral_doc_2", refreshed.data.loan_collateral_doc_2_url);
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
    ref(false);
    ref(0);
    computed(() => {
      if (!search.value) return customerName1.value;
      const term = search.value.toLowerCase();
      return customerName1.value.filter(
        (c) => String(c.id).includes(term) || c.label.toLowerCase().includes(term)
      );
    });
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
    const onFileDocChange1 = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.includes("pdf")) {
        errors.loan_collateral_doc_1 = "Only PDF allowed";
        return;
      }
      errors.loan_collateral_doc_1 = "";
      if (form.loan_collateral_doc_1_src) {
        URL.revokeObjectURL(form.loan_collateral_doc_1_src);
      }
      form.loan_collateral_doc_1 = file;
      form.loan_collateral_doc_1_check = 1;
      form.loan_collateral_doc_1_src = URL.createObjectURL(file);
    };
    const onFileDocChange2 = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.includes("pdf")) {
        errors.loan_collateral_doc_2 = "Only PDF allowed";
        return;
      }
      errors.loan_collateral_doc_2 = "";
      if (form.loan_collateral_doc_2_src) {
        URL.revokeObjectURL(form.loan_collateral_doc_2_src);
      }
      form.loan_collateral_doc_2 = file;
      form.loan_collateral_doc_2_check = 1;
      form.loan_collateral_doc_2_src = URL.createObjectURL(file);
    };
    const formatFileSize = (size) => {
      if (!size) return "";
      const kb = size / 1024;
      if (kb < 1024) return kb.toFixed(1) + " KB";
      const mb = kb / 1024;
      return mb.toFixed(1) + " MB";
    };
    const getFileUrl = (src) => {
      if (!src) return "#";
      if (src.startsWith("blob:")) return src;
      if (src.startsWith("http://") || src.startsWith("https://")) {
        return src;
      }
      return "/storage/" + src;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonCustomerSelect2 = CommonCustomerSelect2;
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-f2a55f36>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-f2a55f36>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loanrecord)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4" data-v-f2a55f36>`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. General Information" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CommonCustomerSelect2, {
                label: "Customer",
                modelValue: unref(form).cust_id,
                "onUpdate:modelValue": ($event) => unref(form).cust_id = $event,
                required: true,
                error: unref(errors).cust_id,
                options: unref(customerName1)
              }, null, _parent2, _scopeId));
              _push2(`<div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Currency<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).currency_id)}</span></div><select class="input" data-v-f2a55f36${_scopeId}><!--[-->`);
              ssrRenderList(unref(currencies), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).currency_id) ? ssrLooseContain(unref(form).currency_id, c.id) : ssrLooseEqual(unref(form).currency_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Last Cash<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_lastcash)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_lastcash.toLocaleString())} data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>New Cash<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_newcash)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_newcash.toLocaleString())} data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Total Cash<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_totalcash)}</span></div><input type="text" class="input bg-gray-100 cursor-not-allowed"${ssrRenderAttr("value", unref(form).loan_totalcash.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} readonly data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Principle<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_principle)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_principle.toLocaleString())} data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Source Money<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).source_money)}</span></div><input${ssrRenderAttr("value", unref(form).source_money)} list="sourceMoneyList" class="input" placeholder="Type source..." data-v-f2a55f36${_scopeId}><datalist id="sourceMoneyList" data-v-f2a55f36${_scopeId}><!--[-->`);
              ssrRenderList(unref(sourceMoneys), (s) => {
                _push2(`<option${ssrRenderAttr("value", s)} data-v-f2a55f36${_scopeId}></option>`);
              });
              _push2(`<!--]--></datalist></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Loan Type<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loantype_id)}</span></div><select class="input" data-v-f2a55f36${_scopeId}><option value="-1" data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).loantype_id) ? ssrLooseContain(unref(form).loantype_id, "-1") : ssrLooseEqual(unref(form).loantype_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(loanTypes), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).loantype_id) ? ssrLooseContain(unref(form).loantype_id, l.id) : ssrLooseEqual(unref(form).loantype_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Over Draft</label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_over_draft)}</span></div><input type="text" class="input"${ssrRenderAttr("value", unref(form).loan_over_draft.toLocaleString())} data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Payback<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).payback_id)}</span></div><select class="input" data-v-f2a55f36${_scopeId}><option value="-1" data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).payback_id) ? ssrLooseContain(unref(form).payback_id, "-1") : ssrLooseEqual(unref(form).payback_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(paybacks), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).payback_id) ? ssrLooseContain(unref(form).payback_id, l.id) : ssrLooseEqual(unref(form).payback_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Loan Period<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_peroid)}</span></div><input${ssrRenderAttr("value", unref(form).loan_peroid)} type="number" class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Start Date<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_startdate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_startdate)} type="date" class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>First Paid Date<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_first_paid_date)}</span></div><input${ssrRenderAttr("value", unref(form).loan_first_paid_date)} type="date" class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>End Date<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_enddate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_enddate)} type="date" class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Interest Rate (%) <span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_interest_rate)}</span></div><input${ssrRenderAttr("value", unref(form).loan_interest_rate)} type="number" step="0.01" class="input" data-v-f2a55f36${_scopeId}></div>`);
            } else {
              return [
                createVNode(_component_CommonCustomerSelect2, {
                  label: "Customer",
                  modelValue: unref(form).cust_id,
                  "onUpdate:modelValue": ($event) => unref(form).cust_id = $event,
                  required: true,
                  error: unref(errors).cust_id,
                  options: unref(customerName1)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error", "options"]),
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
                      createTextVNode("First Paid Date"),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_first_paid_date), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).loan_first_paid_date = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).loan_first_paid_date]
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
              _push2(ssrRenderComponent(_component_CommonCustomerSelect2, {
                label: "Comission Customer",
                modelValue: unref(form).cust_comission_id,
                "onUpdate:modelValue": ($event) => unref(form).cust_comission_id = $event,
                required: true,
                error: unref(errors).cust_comission_id,
                options: unref(customerName1)
              }, null, _parent2, _scopeId));
              _push2(`<div data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Comission Interest Rate (%)<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).cust_comission_interest_rate)}</span><input${ssrRenderAttr("value", unref(form).cust_comission_interest_rate)} type="number" step="0.01" class="input" data-v-f2a55f36${_scopeId}></div>`);
              _push2(ssrRenderComponent(_component_CommonCustomerSelect2, {
                label: "Loan Group",
                modelValue: unref(form).cust_loangroup_id,
                "onUpdate:modelValue": ($event) => unref(form).cust_loangroup_id = $event,
                required: true,
                error: unref(errors).cust_loangroup_id,
                options: unref(customerName1)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CommonCustomerSelect2, {
                label: "Guarantor Customer",
                modelValue: unref(form).cust_guarantor_id,
                "onUpdate:modelValue": ($event) => unref(form).cust_guarantor_id = $event,
                required: false,
                error: unref(errors).cust_guarantor_id,
                options: unref(customerName1)
              }, null, _parent2, _scopeId));
              _push2(`<div data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Position in Loan Group<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).cust_position_loangroup_id)}</span><select class="input" data-v-f2a55f36${_scopeId}><option value="-1" data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_position_loangroup_id) ? ssrLooseContain(unref(form).cust_position_loangroup_id, "-1") : ssrLooseEqual(unref(form).cust_position_loangroup_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ...</option><!--[-->`);
              ssrRenderList(unref(loanGroupPositions), (c) => {
                _push2(`<option${ssrRenderAttr("value", c.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_position_loangroup_id) ? ssrLooseContain(unref(form).cust_position_loangroup_id, c.id) : ssrLooseEqual(unref(form).cust_position_loangroup_id, c.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(c.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Invoice ID</label></div><input${ssrRenderAttr("value", unref(form).invoice_id)} type="text" class="input" readonly data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Status<span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_status_id)}</span></div><select class="input" data-v-f2a55f36${_scopeId}><option value="-1" data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_status_id) ? ssrLooseContain(unref(form).loan_status_id, "-1") : ssrLooseEqual(unref(form).loan_status_id, "-1")) ? " selected" : ""}${_scopeId}>Choose...</option><!--[-->`);
              ssrRenderList(unref(loanStatuses), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_status_id) ? ssrLooseContain(unref(form).loan_status_id, l.id) : ssrLooseEqual(unref(form).loan_status_id, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="${ssrRenderClass({ hidden: !(unref(hasRole)("admin") || unref(hasRole)("ceo")) })}" data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Approver</label></div><select class="input" data-v-f2a55f36${_scopeId}><!--[-->`);
              ssrRenderList(unref(loanCheckStatuses), (l) => {
                _push2(`<option${ssrRenderAttr("value", l.id)} data-v-f2a55f36${ssrIncludeBooleanAttr(Array.isArray(unref(form).loan_check_status) ? ssrLooseContain(unref(form).loan_check_status, l.id) : ssrLooseEqual(unref(form).loan_check_status, l.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              return [
                createVNode(_component_CommonCustomerSelect2, {
                  label: "Comission Customer",
                  modelValue: unref(form).cust_comission_id,
                  "onUpdate:modelValue": ($event) => unref(form).cust_comission_id = $event,
                  required: true,
                  error: unref(errors).cust_comission_id,
                  options: unref(customerName1)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error", "options"]),
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
                createVNode(_component_CommonCustomerSelect2, {
                  label: "Loan Group",
                  modelValue: unref(form).cust_loangroup_id,
                  "onUpdate:modelValue": ($event) => unref(form).cust_loangroup_id = $event,
                  required: true,
                  error: unref(errors).cust_loangroup_id,
                  options: unref(customerName1)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error", "options"]),
                createVNode(_component_CommonCustomerSelect2, {
                  label: "Guarantor Customer",
                  modelValue: unref(form).cust_guarantor_id,
                  "onUpdate:modelValue": ($event) => unref(form).cust_guarantor_id = $event,
                  required: false,
                  error: unref(errors).cust_guarantor_id,
                  options: unref(customerName1)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error", "options"]),
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
                createVNode("div", {
                  class: { hidden: !(unref(hasRole)("admin") || unref(hasRole)("ceo")) }
                }, [
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
                ], 2)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ComponentGrowCard, {
          title: "3. Collateral/Note",
          class: "h-full"
        }, {
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-f2a55f36${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400" data-v-f2a55f36${_scopeId}>`);
              if (unref(loading)) {
                _push2(`<svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-f2a55f36${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-f2a55f36${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" data-v-f2a55f36${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(loading) ? "Saving..." : "Update Loan")}</span></button></div>`);
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
              _push2(`<div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label !text-blue-900 text-bold -ml-1" data-v-f2a55f36${_scopeId}>Collateral 1 - Description</label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_1)}</span></div><textarea class="input" rows="6" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_1)}</textarea></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isloan_collateral_map_link_1_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-f2a55f36${_scopeId}> Collateral 1 Map link `);
              if (unref(isloan_collateral_map_link_1_Valid)) {
                _push2(`<span data-v-f2a55f36${_scopeId}> 📌</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).loan_collateral_map_link_1)} class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Collateral 1 - Document <span class="!text-red-300" data-v-f2a55f36${_scopeId}>PDF</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_doc_1)}</span></div><input type="file" accept="application/pdf" class="input" data-v-f2a55f36${_scopeId}>`);
              if (unref(form).loan_collateral_doc_1_src) {
                _push2(`<div class="mt-3" data-v-f2a55f36${_scopeId}><div class="relative group w-full" data-v-f2a55f36${_scopeId}><a${ssrRenderAttr("href", getFileUrl(unref(form).loan_collateral_doc_1_src))} target="_blank" class="flex items-center justify-between p-3 hover:bg-gray-50 transition" data-v-f2a55f36${_scopeId}><div class="flex items-center gap-3" data-v-f2a55f36${_scopeId}><div class="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg" data-v-f2a55f36${_scopeId}> PDF </div><div class="flex flex-col" data-v-f2a55f36${_scopeId}><span class="text-sm font-medium text-gray-800" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_doc_1?.name || "document.pdf")}</span><span class="text-xs text-gray-500" data-v-f2a55f36${_scopeId}>${ssrInterpolate(formatFileSize(unref(form).loan_collateral_doc_1?.size))}</span></div></div></a><div class="absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2" data-v-f2a55f36${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).loan_collateral_doc_1_check, 1)) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded" data-v-f2a55f36${_scopeId}><span class="text-sm text-gray-700" data-v-f2a55f36${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="border-b border-gray-100 dark:border-gray-800 !pt-3" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Collateral 2</label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_2)}</span></div><textarea class="input" rows="6" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_2)}</textarea></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isloan_collateral_map_link_2_Valid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-f2a55f36${_scopeId}> Collateral 2 Map link `);
              if (unref(isloan_collateral_map_link_2_Valid)) {
                _push2(`<span data-v-f2a55f36${_scopeId}> 📌</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).loan_collateral_map_link_2)} class="input" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Collateral 2 - Document <span class="!text-red-300" data-v-f2a55f36${_scopeId}>PDF</span></label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_collateral_doc_2)}</span></div><input type="file" accept="application/pdf" class="input" data-v-f2a55f36${_scopeId}>`);
              if (unref(form).loan_collateral_doc_2_src) {
                _push2(`<div class="mt-3" data-v-f2a55f36${_scopeId}><div class="relative group w-full" data-v-f2a55f36${_scopeId}><a${ssrRenderAttr("href", getFileUrl(unref(form).loan_collateral_doc_2_src))} target="_blank" class="flex items-center justify-between p-3 hover:bg-gray-50 transition" data-v-f2a55f36${_scopeId}><div class="flex items-center gap-3" data-v-f2a55f36${_scopeId}><div class="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg" data-v-f2a55f36${_scopeId}> PDF </div><div class="flex flex-col" data-v-f2a55f36${_scopeId}><span class="text-sm font-medium text-gray-800" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(form).loan_collateral_doc_2?.name || "document.pdf")}</span><span class="text-xs text-gray-500" data-v-f2a55f36${_scopeId}>${ssrInterpolate(formatFileSize(unref(form).loan_collateral_doc_2?.size))}</span></div></div></a><div class="absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2" data-v-f2a55f36${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).loan_collateral_doc_2_check, 1)) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded" data-v-f2a55f36${_scopeId}><span class="text-sm text-gray-700" data-v-f2a55f36${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="border-b border-gray-100 dark:border-gray-800 pt-3" data-v-f2a55f36${_scopeId}></div><div data-v-f2a55f36${_scopeId}><div class="flex items-center justify-between" data-v-f2a55f36${_scopeId}><label class="label" data-v-f2a55f36${_scopeId}>Note</label><span class="text-red-500 text-sm" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(errors).loan_note)}</span></div><textarea class="input" rows="6" data-v-f2a55f36${_scopeId}>${ssrInterpolate(unref(form).loan_note)}</textarea></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label !text-blue-900 text-bold -ml-1" }, "Collateral 1 - Description"),
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
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Collateral 1 - Document "),
                      createVNode("span", { class: "!text-red-300" }, "PDF")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_collateral_doc_1), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    accept: "application/pdf",
                    onChange: onFileDocChange1,
                    class: "input"
                  }, null, 32),
                  unref(form).loan_collateral_doc_1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-3"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: getFileUrl(unref(form).loan_collateral_doc_1_src),
                        target: "_blank",
                        class: "flex items-center justify-between p-3 hover:bg-gray-50 transition"
                      }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode("div", { class: "w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg" }, " PDF "),
                          createVNode("div", { class: "flex flex-col" }, [
                            createVNode("span", { class: "text-sm font-medium text-gray-800" }, toDisplayString(unref(form).loan_collateral_doc_1?.name || "document.pdf"), 1),
                            createVNode("span", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(unref(form).loan_collateral_doc_1?.size)), 1)
                          ])
                        ])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).loan_collateral_doc_1_check = $event,
                          "true-value": 1,
                          "false-value": 0,
                          class: "w-4 h-4 text-blue-600 rounded"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).loan_collateral_doc_1_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "border-b border-gray-100 dark:border-gray-800 !pt-3" }),
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
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Collateral 2 - Document "),
                      createVNode("span", { class: "!text-red-300" }, "PDF")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).loan_collateral_doc_2), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    accept: "application/pdf",
                    onChange: onFileDocChange2,
                    class: "input"
                  }, null, 32),
                  unref(form).loan_collateral_doc_2_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-3"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: getFileUrl(unref(form).loan_collateral_doc_2_src),
                        target: "_blank",
                        class: "flex items-center justify-between p-3 hover:bg-gray-50 transition"
                      }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode("div", { class: "w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg" }, " PDF "),
                          createVNode("div", { class: "flex flex-col" }, [
                            createVNode("span", { class: "text-sm font-medium text-gray-800" }, toDisplayString(unref(form).loan_collateral_doc_2?.name || "document.pdf"), 1),
                            createVNode("span", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(unref(form).loan_collateral_doc_2?.size)), 1)
                          ])
                        ])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "true-value": 1,
                          "false-value": 0,
                          "onUpdate:modelValue": ($event) => unref(form).loan_collateral_doc_2_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).loan_collateral_doc_2_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "border-b border-gray-100 dark:border-gray-800 pt-3" }),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/loanrecords/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f2a55f36"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CS8e04fg.mjs.map
