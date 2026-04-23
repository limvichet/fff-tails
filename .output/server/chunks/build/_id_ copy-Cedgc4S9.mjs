import __nuxt_component_0 from './index-BUfmGtf9.mjs';
import { defineComponent, ref, reactive, withAsyncContext, computed, watch, unref, withCtx, createVNode, withDirectives, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, vModelSelect, vModelText, createCommentVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { z } from 'zod';
import { useRoute } from 'vue-router';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as ComponentGrowCard } from './ComponentGrowCard-D1HotIDG.mjs';
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
    const formReady = ref(false);
    const errors = reactive({});
    const nameTitles = ref([]);
    const identifications = ref([]);
    const idLicenses = ref([]);
    const occupations = ref([]);
    const route = useRoute();
    const id = route.params.id;
    const form = reactive({
      id: null,
      cust_title_1: -1,
      cust_name_1: "",
      cust_dob_1: "",
      cust_idcardnum_1: "",
      iden_id_1: -1,
      cust_idcardnum_date_1: "",
      idli_id_1: -1,
      occu_id_1: -1,
      cust_phone_1: "",
      cust_title_2: -1,
      cust_name_2: "",
      cust_dob_2: "",
      cust_idcardnum_2: "",
      iden_id_2: -1,
      cust_idcardnum_date_2: "",
      idli_id_2: -1,
      occu_id_2: -1,
      cust_phone_2: "",
      cust_account_num: "",
      cust_atm_num: "",
      cust_facebook: "",
      cust_telegram: "",
      cust_address: "",
      cust_address_link: "",
      img1: null,
      img1_src: null,
      img1_check: false,
      img2: null,
      img2_src: null,
      img2_check: false,
      photo1: null,
      photo1_src: null,
      photo1_check: false,
      photo2: null,
      photo2_src: null,
      photo2_check: false
    });
    const headers = useRequestHeaders(["cookie"]);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `customer-${id}`,
      () => $fetch(`/api/admin-secure/customers/${id}`, { headers })
    )), __temp = await __temp, __restore(), __temp);
    const customer = computed(() => data.value?.data ?? null);
    const handleImageChange = (event, imageKey, previewKey, checkKey) => {
      const target = event.target;
      const file = target.files?.[0];
      if (!file) {
        form[imageKey] = null;
        form[previewKey] = null;
        form[checkKey] = false;
        return;
      }
      form[imageKey] = file;
      form[checkKey] = true;
      form[previewKey] = URL.createObjectURL(file);
    };
    const onFileChange1 = (e) => handleImageChange(e, "img1", "img1_src", "img1_check");
    const onFileChange2 = (e) => handleImageChange(e, "img2", "img2_src", "img2_check");
    const onFileChange3 = (e) => handleImageChange(e, "photo1", "photo1_src", "photo1_check");
    const onFileChange4 = (e) => handleImageChange(e, "photo2", "photo2_src", "photo2_check");
    const openImg1 = () => {
      if (!form.img1_src) return;
      const newTab = (void 0).open();
      if (newTab) {
        newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.img1_src}" style="width:100%" />
          </body>
        </html>
      `);
        newTab.document.close();
      }
    };
    const openImg2 = () => {
      if (!form.img2_src) return;
      const newTab = (void 0).open();
      if (newTab) {
        newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.img2_src}" style="width:100%" />
          </body>
        </html>
      `);
        newTab.document.close();
      }
    };
    const openPhoto1 = () => {
      if (!form.photo1_src) return;
      const newTab = (void 0).open();
      if (newTab) {
        newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.photo1_src}" style="width:100%" />
          </body>
        </html>
      `);
        newTab.document.close();
      }
    };
    const openPhoto2 = () => {
      if (!form.photo2_src) return;
      const newTab = (void 0).open();
      if (newTab) {
        newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.photo2_src}" style="width:100%" />
          </body>
        </html>
      `);
        newTab.document.close();
      }
    };
    const isFacebookValid = computed(() => {
      return form.cust_facebook;
    });
    const isTelegramValid = computed(() => {
      return form.cust_telegram;
    });
    const isAddressValid = computed(() => {
      return form.cust_address_link;
    });
    const openLink = (url) => {
      if (!url) return;
      (void 0).open(url, "_blank");
    };
    const openTelegram = (username) => {
      if (!username || username.trim().length === 0) return;
      const user = username.replace(/^@/, "").trim();
      if (!user) return;
      const isMobile = /Mobi|Android/i.test((void 0).userAgent);
      const url = isMobile ? `tg://resolve?domain=${user}` : `https://web.telegram.org/k/#${user}`;
      (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    function formatDateForInput(date) {
      if (!date) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const [d, m, y] = date.split("-");
      return `${y}-${m}-${d}`;
    }
    watch(customer, (c) => {
      if (!c) return;
      Object.assign(form, {
        id: c.id ?? null,
        // 1st customer — required fields
        cust_title_1: c.cust_title_1 ?? -1,
        cust_name_1: c.cust_name_1 ?? "",
        cust_dob_1: formatDateForInput(c.cust_dob_1 ?? ""),
        cust_idcardnum_1: c.cust_idcardnum_1 ?? "",
        iden_id_1: c.iden_id_1 ?? -1,
        cust_idcardnum_date_1: formatDateForInput(c.cust_idcardnum_date_1 ?? ""),
        idli_id_1: c.idli_id_1 ?? -1,
        occu_id_1: c.occu_id_1 ?? -1,
        cust_phone_1: c.cust_phone_1 ?? "",
        // 2nd customer — optional fields
        cust_title_2: c.cust_title_2 ?? -1,
        cust_name_2: c.cust_name_2 ?? "",
        cust_dob_2: formatDateForInput(c.cust_dob_2 ?? ""),
        cust_idcardnum_2: c.cust_idcardnum_2 ?? "",
        iden_id_2: c.iden_id_2 ?? -1,
        cust_idcardnum_date_2: formatDateForInput(c.cust_idcardnum_date_2 ?? ""),
        idli_id_2: c.idli_id_2 ?? -1,
        occu_id_2: c.occu_id_2 ?? -1,
        cust_phone_2: c.cust_phone_2 ?? "",
        // Bank / Social / Address info
        cust_account_num: c.cust_account_num ?? "",
        cust_atm_num: c.cust_atm_num ?? "",
        cust_facebook: c.cust_facebook ?? "",
        cust_telegram: c.cust_telegram ?? "",
        cust_address: c.cust_address ?? "",
        cust_address_link: c.cust_address_link ?? "",
        // Image preview from backend
        img1_src: c.img1_url ?? null,
        img2_src: c.img2_url ?? null,
        img1_check: !!c.img1_url,
        img2_check: !!c.img2_url,
        // 🔥 ADD THIS (MISSING)
        photo1_src: c.photo1_url ?? null,
        photo2_src: c.photo2_url ?? null,
        photo1_check: !!c.photo1_url,
        photo2_check: !!c.photo2_url
      });
      formReady.value = true;
    }, { immediate: true });
    const schema = z.object({
      // Primary ID
      id: z.number().nullable().optional(),
      // ===== Customer 1 (Required) =====
      cust_title_1: z.number().min(0, "Required"),
      iden_id_1: z.number().min(0, "Required"),
      idli_id_1: z.number().min(0, "Required"),
      occu_id_1: z.number().min(0, "Required"),
      cust_name_1: z.string().nonempty("Required"),
      cust_dob_1: z.string().nonempty("Required"),
      cust_idcardnum_1: z.string().nonempty("Required"),
      cust_idcardnum_date_1: z.string().nonempty("Required"),
      cust_phone_1: z.string().nonempty("Required"),
      cust_address: z.string().nonempty("Required"),
      cust_address_link: z.string().optional(),
      // ===== Customer 2 (Optional Section) =====
      cust_title_2: z.number().optional(),
      iden_id_2: z.number().optional(),
      idli_id_2: z.number().optional(),
      occu_id_2: z.number().optional(),
      cust_name_2: z.string().optional(),
      cust_dob_2: z.string().optional(),
      cust_idcardnum_2: z.string().optional(),
      cust_idcardnum_date_2: z.string().optional(),
      cust_phone_2: z.string().optional(),
      // ===== Extra Optional Info =====
      cust_account_num: z.string().optional(),
      cust_atm_num: z.string().optional(),
      cust_facebook: z.string().optional(),
      cust_telegram: z.string().optional(),
      // Image Customer 1 (Optional)
      img1: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" }),
      img2: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" }),
      photo1: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" }),
      photo2: z.any().optional().refine((file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file?.[0];
        if (!f) return true;
        return f.size <= MIN_FILE_SIZE;
      }, { message: "Size must be less than 1MB" })
    });
    const validateField = (field) => {
      try {
        schema.shape[field].parse(form[field]);
        errors[field] = "";
      } catch (err) {
        errors[field] = err.errors?.[0]?.message || "";
      }
    };
    Object.keys(schema.shape).forEach((field) => {
      watch(
        () => form[field],
        () => validateField(field)
      );
    });
    const compressImage = (file, maxSizeMB = 1) => {
      return new Promise((resolve) => {
        const img = new Image();
        const canvas = (void 0).createElement("canvas");
        const ctx = canvas.getContext("2d");
        img.onload = () => {
          const scale = Math.sqrt(maxSizeMB * 1024 * 1024 / file.size);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                resolve(file);
              }
            },
            file.type,
            0.7
            // quality
          );
        };
        img.src = URL.createObjectURL(file);
      });
    };
    const images = {
      img1: { file: null, src: null, check: false },
      img2: { file: null, src: null, check: false },
      photo1: { file: null, src: null, check: false },
      photo2: { file: null, src: null, check: false }
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
      Object.keys(errors).forEach((k) => errors[k] = "");
      const compressIfNeeded = async (file) => {
        if (!file) return file;
        const f = file instanceof FileList ? file[0] : file;
        if (f && f.size > 1024 * 1024) {
          return await compressImage(f);
        }
        return f;
      };
      const newForm = { ...form };
      newForm.img1 = await compressIfNeeded(form.img1);
      newForm.img2 = await compressIfNeeded(form.img2);
      newForm.photo1 = await compressIfNeeded(form.photo1);
      newForm.photo2 = await compressIfNeeded(form.photo2);
      try {
        const parsed = schema.safeParse(newForm);
        if (!parsed.success) {
          const errorList = [];
          parsed.error.errors.forEach((e) => {
            const field = e.path.join(".");
            errors[field] = e.message;
            errorList.push(`${field}: ${e.message}`);
          });
          errorMsg.value = "Please fix the validation errors.";
          return;
        }
        console.log("PARSED FORM:", parsed);
        const fd = new FormData();
        const formDataObj = parsed.data;
        Object.entries(formDataObj).forEach(([k, v]) => {
          if (v === -1 || v === "") {
            fd.append(k, "");
          } else {
            fd.append(k, String(v));
          }
        });
        if (newForm.img1 && form.img1_check) fd.append("img1", newForm.img1);
        if (newForm.img2 && form.img2_check) fd.append("img2", newForm.img2);
        if (newForm.photo1 && form.photo1_check) fd.append("photo1", newForm.photo1);
        if (newForm.photo2 && form.photo2_check) fd.append("photo2", newForm.photo2);
        if (form.img1_check) fd.append("img1_check", "1");
        if (form.img2_check) fd.append("img2_check", "1");
        if (form.photo1_check) fd.append("photo1_check", "1");
        if (form.photo2_check) fd.append("photo2_check", "1");
        fd.append("_method", "PUT");
        await $fetch(`/api/admin-secure/customers/${id}`, {
          method: "POST",
          body: fd
        });
        successMsg.value = "Customer updated successfully!";
        const refreshed = await $fetch(`/api/admin-secure/customers/${id}`);
        updateFromBackend("img1", refreshed.data.img1_url);
        updateFromBackend("img2", refreshed.data.img2_url);
        updateFromBackend("photo1", refreshed.data.photo1_url);
        updateFromBackend("photo2", refreshed.data.photo2_url);
      } catch (err) {
        if (err.errors) {
          err.errors.forEach((e) => {
            errors[e.path[0]] = e.message;
          });
        } else {
          errorMsg.value = "Error while saving customer";
        }
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-a54e489f>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-a54e489f>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(customer)) {
        _push(`<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-v-a54e489f><div class="space-y-4" data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. Basic" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Title <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_title_1)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" disabled data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_title_1) ? ssrLooseContain(unref(form).cust_title_1, "-1") : ssrLooseEqual(unref(form).cust_title_1, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(nameTitles), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_title_1) ? ssrLooseContain(unref(form).cust_title_1, dd.id) : ssrLooseEqual(unref(form).cust_title_1, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Name <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_name_1)}</span></div><input${ssrRenderAttr("value", unref(form).cust_name_1)} type="text" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Date of Birth <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_dob_1)}</span></div><input${ssrRenderAttr("value", unref(form).cust_dob_1)} type="date" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>ID Card Number <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_idcardnum_1)}</span></div><input${ssrRenderAttr("value", unref(form).cust_idcardnum_1)} type="text" class="input" maxlength="9" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Identity Type <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).iden_id_1)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" disabled data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).iden_id_1) ? ssrLooseContain(unref(form).iden_id_1, "-1") : ssrLooseEqual(unref(form).iden_id_1, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(identifications), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).iden_id_1) ? ssrLooseContain(unref(form).iden_id_1, dd.id) : ssrLooseEqual(unref(form).iden_id_1, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Date Identification <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_idcardnum_date_1)}</span></div><input${ssrRenderAttr("value", unref(form).cust_idcardnum_date_1)} type="date" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Identification Licenses <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).idli_id_1)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" disabled data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).idli_id_1) ? ssrLooseContain(unref(form).idli_id_1, "-1") : ssrLooseEqual(unref(form).idli_id_1, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(idLicenses), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).idli_id_1) ? ssrLooseContain(unref(form).idli_id_1, dd.id) : ssrLooseEqual(unref(form).idli_id_1, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Occupation <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).occu_id_1)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" disabled data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).occu_id_1) ? ssrLooseContain(unref(form).occu_id_1, "-1") : ssrLooseEqual(unref(form).occu_id_1, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(occupations), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).occu_id_1) ? ssrLooseContain(unref(form).occu_id_1, dd.id) : ssrLooseEqual(unref(form).occu_id_1, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Phone <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_phone_1)}</span></div><input${ssrRenderAttr("value", unref(form).cust_phone_1)} type="text" maxlength="10" class="input" data-v-a54e489f${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Title "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_title_1), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_title_1 = $event,
                    class: "input"
                  }, [
                    createVNode("option", {
                      value: "-1",
                      disabled: ""
                    }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(nameTitles), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_title_1,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Name "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_name_1), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_name_1 = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_name_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Date of Birth "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_dob_1), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_dob_1 = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_dob_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("ID Card Number "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_idcardnum_1), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_idcardnum_1 = $event,
                    type: "text",
                    class: "input",
                    maxlength: "9"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_idcardnum_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Identity Type "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).iden_id_1), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).iden_id_1 = $event,
                    class: "input"
                  }, [
                    createVNode("option", {
                      value: "-1",
                      disabled: ""
                    }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(identifications), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).iden_id_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Date Identification "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_idcardnum_date_1), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_idcardnum_date_1 = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_idcardnum_date_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Identification Licenses "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).idli_id_1), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).idli_id_1 = $event,
                    class: "input"
                  }, [
                    createVNode("option", {
                      value: "-1",
                      disabled: ""
                    }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(idLicenses), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).idli_id_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Occupation "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).occu_id_1), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).occu_id_1 = $event,
                    class: "input"
                  }, [
                    createVNode("option", {
                      value: "-1",
                      disabled: ""
                    }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(occupations), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).occu_id_1]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Phone "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_phone_1), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_phone_1 = $event,
                    type: "text",
                    maxlength: "10",
                    onInput: ($event) => unref(form).cust_phone_1 = unref(form).cust_phone_1.replace(/[^0-9]/g, "").slice(0, 10),
                    class: "input"
                  }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                    [vModelText, unref(form).cust_phone_1]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-4" data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentCard, { title: "2. Basic" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Title</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_title_2)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_title_2) ? ssrLooseContain(unref(form).cust_title_2, "-1") : ssrLooseEqual(unref(form).cust_title_2, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(nameTitles), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).cust_title_2) ? ssrLooseContain(unref(form).cust_title_2, dd.id) : ssrLooseEqual(unref(form).cust_title_2, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Name</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_name_2)}</span></div><input${ssrRenderAttr("value", unref(form).cust_name_2)} type="text" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Date of Birth</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_dob_2)}</span></div><input${ssrRenderAttr("value", unref(form).cust_dob_2)} type="date" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>ID Card Number</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_idcardnum_2)}</span></div><input${ssrRenderAttr("value", unref(form).cust_idcardnum_2)} type="text" class="input" maxlength="9" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Identity Type</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).iden_id_2)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).iden_id_2) ? ssrLooseContain(unref(form).iden_id_2, "-1") : ssrLooseEqual(unref(form).iden_id_2, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(identifications), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).iden_id_2) ? ssrLooseContain(unref(form).iden_id_2, dd.id) : ssrLooseEqual(unref(form).iden_id_2, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Date Identification</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_idcardnum_date_2)}</span></div><input${ssrRenderAttr("value", unref(form).cust_idcardnum_date_2)} type="date" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Identification Licenses</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).idli_id_2)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).idli_id_2) ? ssrLooseContain(unref(form).idli_id_2, "-1") : ssrLooseEqual(unref(form).idli_id_2, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(idLicenses), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).idli_id_2) ? ssrLooseContain(unref(form).idli_id_2, dd.id) : ssrLooseEqual(unref(form).idli_id_2, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Occupation</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).occu_id_2)}</span></div><select class="input" data-v-a54e489f${_scopeId}><option value="-1" data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).occu_id_2) ? ssrLooseContain(unref(form).occu_id_2, "-1") : ssrLooseEqual(unref(form).occu_id_2, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
              ssrRenderList(unref(occupations), (dd) => {
                _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-a54e489f${ssrIncludeBooleanAttr(Array.isArray(unref(form).occu_id_2) ? ssrLooseContain(unref(form).occu_id_2, dd.id) : ssrLooseEqual(unref(form).occu_id_2, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Phone</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_phone_2)}</span></div><input${ssrRenderAttr("value", unref(form).cust_phone_2)} type="text" maxlength="10" class="input" data-v-a54e489f${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Title"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_title_2), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_title_2 = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(nameTitles), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [
                      vModelSelect,
                      unref(form).cust_title_2,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Name"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_name_2), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_name_2 = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_name_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Date of Birth"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_dob_2), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_dob_2 = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_dob_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "ID Card Number"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_idcardnum_2), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_idcardnum_2 = $event,
                    type: "text",
                    class: "input",
                    maxlength: "9"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_idcardnum_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Identity Type"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).iden_id_2), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).iden_id_2 = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(identifications), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).iden_id_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Date Identification"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_idcardnum_date_2), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_idcardnum_date_2 = $event,
                    type: "date",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_idcardnum_date_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Identification Licenses"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).idli_id_2), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).idli_id_2 = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(idLicenses), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).idli_id_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Occupation"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).occu_id_2), 1)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).occu_id_2 = $event,
                    class: "input"
                  }, [
                    createVNode("option", { value: "-1" }, " Choose ... "),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(occupations), (dd) => {
                      return openBlock(), createBlock("option", {
                        key: dd.id,
                        value: dd.id
                      }, toDisplayString(dd.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).occu_id_2]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Phone"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_phone_2), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_phone_2 = $event,
                    type: "text",
                    maxlength: "10",
                    onInput: ($event) => unref(form).cust_phone_1 = unref(form).cust_phone_1.replace(/[^0-9]/g, "").slice(0, 10),
                    class: "input"
                  }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                    [vModelText, unref(form).cust_phone_2]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-4" data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentCard, { title: "3. Identification Photo" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>ID Card Image 1</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).img1)}</span></div><input type="file" class="input" data-v-a54e489f${_scopeId}>`);
              if (unref(form).img1_src) {
                _push2(`<div class="mt-4" data-v-a54e489f${_scopeId}><div class="relative group w-full" data-v-a54e489f${_scopeId}><a${ssrRenderAttr("href", unref(form).img1_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-a54e489f${_scopeId}><img${ssrRenderAttr("src", unref(form).img1_src)} class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-a54e489f${_scopeId}></a><div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-a54e489f${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).img1_check) ? ssrLooseContain(unref(form).img1_check, null) : unref(form).img1_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-a54e489f${_scopeId}><span class="text-sm text-gray-700" data-v-a54e489f${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>ID Card Image 2</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).img2)}</span></div><input type="file" class="input" data-v-a54e489f${_scopeId}>`);
              if (unref(form).img2_src) {
                _push2(`<div class="mt-4" data-v-a54e489f${_scopeId}><div class="relative group w-full" data-v-a54e489f${_scopeId}><a${ssrRenderAttr("href", unref(form).img2_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-a54e489f${_scopeId}><img${ssrRenderAttr("src", unref(form).img2_src)} class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-a54e489f${_scopeId}></a><div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-a54e489f${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).img2_check) ? ssrLooseContain(unref(form).img2_check, null) : unref(form).img2_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-a54e489f${_scopeId}><span class="text-sm text-gray-700" data-v-a54e489f${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Photo 1</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).photo1)}</span></div><input type="file" class="input" data-v-a54e489f${_scopeId}>`);
              if (unref(form).photo1_src) {
                _push2(`<div class="mt-4" data-v-a54e489f${_scopeId}><div class="relative group w-1/2" data-v-a54e489f${_scopeId}><a${ssrRenderAttr("href", unref(form).photo1_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-a54e489f${_scopeId}><img${ssrRenderAttr("src", unref(form).photo1_src)} class="w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-a54e489f${_scopeId}></a><div class="absolute top-1 right-1 bg-white/50 backdrop-blur px-2 py-1 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-a54e489f${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).photo1_check) ? ssrLooseContain(unref(form).photo1_check, null) : unref(form).photo1_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-a54e489f${_scopeId}><span class="text-sm text-gray-700" data-v-a54e489f${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Photo 2</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).photo2)}</span></div><input type="file" class="input" data-v-a54e489f${_scopeId}>`);
              if (unref(form).photo2_src) {
                _push2(`<div class="mt-4" data-v-a54e489f${_scopeId}><div class="relative group w-1/2" data-v-a54e489f${_scopeId}><a${ssrRenderAttr("href", unref(form).photo2_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-a54e489f${_scopeId}><img${ssrRenderAttr("src", unref(form).photo2_src)} class="w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-a54e489f${_scopeId}></a><div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-a54e489f${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).photo2_check) ? ssrLooseContain(unref(form).photo2_check, null) : unref(form).photo2_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-a54e489f${_scopeId}><span class="text-sm text-gray-700" data-v-a54e489f${_scopeId}>Check</span></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "ID Card Image 1"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).img1), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange1,
                    class: "input"
                  }, null, 32),
                  unref(form).img1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: unref(form).img1_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: unref(form).img1_src,
                          onClick: openImg1,
                          class: "w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).img1_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).img1_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "ID Card Image 2"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).img2), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange2,
                    class: "input"
                  }, null, 32),
                  unref(form).img2_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: unref(form).img2_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: unref(form).img2_src,
                          onClick: openImg2,
                          class: "w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).img2_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).img2_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Photo 1"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).photo1), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange3,
                    class: "input"
                  }, null, 32),
                  unref(form).photo1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-1/2" }, [
                      createVNode("a", {
                        href: unref(form).photo1_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: unref(form).photo1_src,
                          onClick: openPhoto1,
                          class: "w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-1 right-1 bg-white/50 backdrop-blur px-2 py-1 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).photo1_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).photo1_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Photo 2"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).photo2), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange4,
                    class: "input"
                  }, null, 32),
                  unref(form).photo2_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-1/2" }, [
                      createVNode("a", {
                        href: unref(form).photo2_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: unref(form).photo2_src,
                          onClick: openPhoto2,
                          class: "w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).photo2_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).photo2_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentCard, { title: "4.Bank Infomation" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Account Number</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_account_num)}</span></div><input${ssrRenderAttr("value", unref(form).cust_account_num)} type="text" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>ATM Number</label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_atm_num)}</span></div><input${ssrRenderAttr("value", unref(form).cust_atm_num)} type="text" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isFacebookValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-a54e489f${_scopeId}> Facebook `);
              if (unref(isFacebookValid)) {
                _push2(`<span data-v-a54e489f${_scopeId}> 🔗</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).cust_facebook)} type="text" class="input" data-v-a54e489f${_scopeId}></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label style="${ssrRenderStyle({ "margin-bottom": "4px", "font-size": "14px", "color": "#555" })}" class="${ssrRenderClass([
                "inline-flex items-center gap-1 hover:text-blue-700",
                unref(isTelegramValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-a54e489f${_scopeId}> Telegram `);
              if (unref(isTelegramValid)) {
                _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" data-v-a54e489f${_scopeId}><path d="M9.5 13.01l-.39 4.44c.56 0 .8-.24 1.1-.52l2.64-2.53 5.48 4.01c1 .53 1.72.25 1.98-.93L23 2.98c.26-1.18-.43-1.65-1.3-1.38L1.74 9.66c-1.17.46-1.15 1.11-.2 1.38l5.5 1.7 12.77-8c.6-.38 1.15-.17.7.25l-10.6 10z" data-v-a54e489f${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).cust_telegram)} type="text" class="input" data-v-a54e489f${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Account Number"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_account_num), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_account_num = $event,
                    type: "text",
                    onInput: ($event) => unref(form).cust_account_num = unref(form).cust_account_num.replace(/[^0-9]/g, "").slice(0, 14),
                    class: "input"
                  }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                    [vModelText, unref(form).cust_account_num]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "ATM Number"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_atm_num), 1)
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_atm_num = $event,
                    type: "text",
                    onInput: ($event) => unref(form).cust_atm_num = unref(form).cust_atm_num.replace(/[^0-9]/g, "").slice(0, 20),
                    class: "input"
                  }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                    [vModelText, unref(form).cust_atm_num]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", {
                      class: [
                        "label",
                        unref(isFacebookValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
                      ],
                      onClick: ($event) => unref(isFacebookValid) && openLink(unref(form).cust_facebook)
                    }, [
                      createTextVNode(" Facebook "),
                      unref(isFacebookValid) ? (openBlock(), createBlock("span", { key: 0 }, " 🔗")) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_facebook = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_facebook]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", {
                      style: { "margin-bottom": "4px", "font-size": "14px", "color": "#555" },
                      class: [
                        "inline-flex items-center gap-1 hover:text-blue-700",
                        unref(isTelegramValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
                      ],
                      onClick: ($event) => unref(isTelegramValid) && openTelegram(unref(form).cust_telegram)
                    }, [
                      createTextVNode(" Telegram "),
                      unref(isTelegramValid) ? (openBlock(), createBlock("svg", {
                        key: 0,
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "w-4 h-4",
                        viewBox: "0 0 24 24",
                        fill: "currentColor"
                      }, [
                        createVNode("path", { d: "M9.5 13.01l-.39 4.44c.56 0 .8-.24 1.1-.52l2.64-2.53 5.48 4.01c1 .53 1.72.25 1.98-.93L23 2.98c.26-1.18-.43-1.65-1.3-1.38L1.74 9.66c-1.17.46-1.15 1.11-.2 1.38l5.5 1.7 12.77-8c.6-.38 1.15-.17.7.25l-10.6 10z" })
                      ])) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_telegram = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_telegram]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-4" data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentGrowCard, { title: "5.Address Infomation" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="label" data-v-a54e489f${_scopeId}>Address <span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(errors).cust_address)}</span></div><textarea class="input" rows="4" data-v-a54e489f${_scopeId}>${ssrInterpolate(unref(form).cust_address)}</textarea></div><div data-v-a54e489f${_scopeId}><div class="flex items-center justify-between" data-v-a54e489f${_scopeId}><label class="${ssrRenderClass([
                "label",
                unref(isAddressValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
              ])}" data-v-a54e489f${_scopeId}> Map link `);
              if (unref(isAddressValid)) {
                _push2(`<span data-v-a54e489f${_scopeId}> 📌</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label></div><input${ssrRenderAttr("value", unref(form).cust_address_link)} class="input" data-v-a54e489f${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, [
                      createTextVNode("Address "),
                      createVNode("span", { class: "text-red-500 text-sm" }, " *")
                    ]),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(unref(errors).cust_address), 1)
                  ]),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_address = $event,
                    class: "input",
                    rows: "4"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_address]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", {
                      class: [
                        "label",
                        unref(isAddressValid) ? "cursor-pointer !text-blue-900" : "text-gray-400"
                      ],
                      onClick: ($event) => unref(isAddressValid) && openLink(unref(form).cust_address_link)
                    }, [
                      createTextVNode(" Map link "),
                      unref(isAddressValid) ? (openBlock(), createBlock("span", { key: 0 }, " 📌")) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).cust_address_link = $event,
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).cust_address_link]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-4" data-v-a54e489f>`);
        _push(ssrRenderComponent(ComponentSubmitCard, { title: "" }, {
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition" data-v-a54e489f${_scopeId}>`);
              if (unref(loading)) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "svg-spinners:180-ring-with-bg",
                  class: "text-lg"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(unref(loading) ? "Saving..." : "Save Customer")}</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: updateForm,
                  disabled: unref(loading),
                  class: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                }, [
                  unref(loading) ? (openBlock(), createBlock(_component_Icon, {
                    key: 0,
                    name: "svg-spinners:180-ring-with-bg",
                    class: "text-lg"
                  })) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(unref(loading) ? "Saving..." : "Save Customer"), 1)
                ], 8, ["disabled"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/customers/[id] copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id__copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a54e489f"]]);

export { _id__copy as default };
//# sourceMappingURL=_id_ copy-Cedgc4S9.mjs.map
