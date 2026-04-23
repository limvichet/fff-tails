import __nuxt_component_0 from './index-BUfmGtf9.mjs';
import { defineComponent, reactive, ref, watch, unref, withCtx, createVNode, withDirectives, createTextVNode, toDisplayString, vModelText, createBlock, openBlock, Fragment, renderList, vModelSelect, createCommentVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as ComponentGrowCard } from './ComponentGrowCard-D1HotIDG.mjs';
import { E as EducationTable, W as WorkHistoryTable } from './WorkHistoryTable-DkVz33wi.mjs';
import { _ as _export_sfc, u as useHead, n as navigateTo } from './server.mjs';
import './asyncData-CQK02fck.mjs';
import 'perfect-debounce';
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
import 'vue-router';

const MIN_FILE_SIZE = 1.01 * 1024 * 1024;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Create employees",
      meta: [{ name: "employees", content: "create employees" }]
    });
    const { successMsg, errorMsg, success } = useMessage();
    const errors = reactive({});
    const loading = ref(false);
    errorMsg.value = null;
    successMsg.value = null;
    const form = reactive({
      surname: "",
      first_name: "",
      gender_id: -1,
      role_id: -1,
      dob: "",
      hire_date: "",
      leave_date: "",
      marital_status_id: -1,
      spouse_name: "",
      spouse_job: "",
      father_name: "",
      father_job: "",
      mother_name: "",
      mother_job: "",
      phone: "",
      telegram: "",
      facebook: "",
      current_address: "",
      note: "",
      guarantor_name: "",
      guarantor_job: "",
      guarantor_working_place: "",
      guarantor_address: "",
      guarantor_phone: "",
      status_id: -1,
      education: [],
      work_histories: [],
      img1: null,
      img1_src: null,
      img1_check: false,
      photo1: null,
      photo1_src: null,
      photo1_check: false
    });
    const genders = ref([]);
    const roles = ref([]);
    const maritalStatuses = ref([]);
    ref([]);
    const statuses = ref([]);
    ref([]);
    const tableEducationRowSchema = z.object({
      id: z.number().optional(),
      description: z.string().optional(),
      date: z.string().optional()
    });
    const tableWorkHistoryRowSchema = z.object({
      id: z.number().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      end_date: z.string().optional()
    });
    const schema = z.object({
      surname: z.string().min(1, "Required"),
      first_name: z.string().min(1, "Required"),
      gender_id: z.number().min(0, "Required"),
      role_id: z.number().min(0, "Required"),
      dob: z.string().min(1, "Required"),
      hire_date: z.string().min(1, "Required"),
      leave_date: z.string().optional(),
      marital_status_id: z.number().min(0, "Required"),
      spouse_name: z.string().optional(),
      spouse_job: z.string().optional(),
      father_name: z.string().optional(),
      father_job: z.string().optional(),
      mother_name: z.string().optional(),
      mother_job: z.string().optional(),
      phone: z.string().min(1, "Required"),
      telegram: z.string().min(1, "Required"),
      facebook: z.string().min(1, "Required"),
      current_address: z.string().min(1, "Required"),
      note: z.string().optional(),
      guarantor_name: z.string().min(1, "Required"),
      guarantor_job: z.string().optional(),
      guarantor_working_place: z.string().optional(),
      guarantor_address: z.string().optional(),
      guarantor_phone: z.string().optional(),
      status_id: z.number().min(0, "Required"),
      education: z.array(tableEducationRowSchema).optional(),
      work_histories: z.array(tableWorkHistoryRowSchema).optional(),
      // Image Customer 1 (Optional)
      img1: z.any().optional().refine((file) => {
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
    const submitForm = async () => {
      loading.value = true;
      errorMsg.value = null;
      successMsg.value = null;
      Object.keys(errors).forEach((k) => errors[k] = "");
      try {
        const compressIfNeeded = async (file) => {
          if (!file) return file;
          const f = file instanceof FileList ? file[0] : file;
          if (f && f.size > 1024 * 1024) {
            return await compressImage(f);
          }
          return f;
        };
        console.log("Raw Form State:", JSON.parse(JSON.stringify(form)));
        const newForm = JSON.parse(JSON.stringify(form));
        newForm.education = (form.education || []).filter((item) => item.description && item.description.trim() !== "");
        newForm.work_histories = (form.work_histories || []).filter((item) => item.description && item.description.trim() !== "");
        const numericFields = [
          "gender_id",
          "role_id",
          "marital_status_id",
          "status_id"
        ];
        numericFields.forEach((field) => {
          const value = newForm[field];
          if (typeof value === "string") {
            newForm[field] = parseFloat(value.replace(/,/g, "")) || 0;
          } else {
            newForm[field] = Number(value) || 0;
          }
        });
        console.log("Processed Object (Pre-Validation):", newForm);
        newForm.img1 = await compressIfNeeded(form.img1);
        newForm.photo1 = await compressIfNeeded(form.photo1);
        const parsed = schema.safeParse(newForm);
        if (!parsed.success) {
          const errorList = [];
          parsed.error.errors.forEach((e) => {
            const field = e.path.join(".");
            errors[field] = e.message;
            errorList.push(`${field}: ${e.message}`);
          });
          errorMsg.value = errorList.join(" | ");
          return;
        }
        const fd = new FormData();
        const formDataObj = parsed.data;
        Object.entries(formDataObj).forEach(([k, v]) => {
          if (k === "img1" || k === "photo1") return;
          if (v === -1 || v === "" || v === null) {
            fd.append(k, "");
          } else if (Array.isArray(v)) {
            if (v.length === 0) {
              fd.append(k, "");
            } else {
              fd.append(k, JSON.stringify(v));
            }
          } else {
            fd.append(k, String(v));
          }
        });
        if (newForm.img1 && form.img1_check) fd.append("img1", newForm.img1);
        if (newForm.photo1 && form.photo1_check) fd.append("photo1", newForm.photo1);
        if (form.img1_check) fd.append("img1_check", "1");
        if (form.photo1_check) fd.append("photo1_check", "1");
        console.log("--- Final FormData Sent to API ---");
        fd.forEach((value, key) => {
          if (value instanceof File) {
            console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        });
        const res = await $fetch("/api/admin-secure/employees", {
          headers: {
            Accept: "application/json"
          },
          method: "POST",
          body: fd
        });
        success("Employee created successfully!");
        if (res?.id) {
          await navigateTo(`/app/dashboard/employees/${res.id}`);
        }
      } catch (err) {
        if (err?.data?.errors) {
          const backendErrors = err.data.errors;
          Object.entries(backendErrors).forEach(([field, messages]) => {
            errors[field] = messages[0] || "";
          });
          if (backendErrors.img1) {
            errorMsg.value = "Image 1 is invalid";
          } else if (backendErrors.cust_telegram) {
            errorMsg.value = "Telegram username is not valid";
          } else {
            errorMsg.value = Object.values(errors).find((e) => e) || "Please fix the errors.";
          }
        } else {
          errorMsg.value = err?.data?.message || "Error while saving customer";
        }
      } finally {
        loading.value = false;
      }
    };
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
      const reader = new FileReader();
      reader.onload = () => form[previewKey] = reader.result;
      reader.readAsDataURL(file);
    };
    const onFileChange1 = (e) => handleImageChange(e, "img1", "img1_src", "img1_check");
    const onFileChange3 = (e) => handleImageChange(e, "photo1", "photo1_src", "photo1_check");
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-7104f0ee>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-7104f0ee>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-v-7104f0ee>`);
      _push(ssrRenderComponent(ComponentCard, { title: "1. General" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Surname<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.surname)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.surname)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>First Name<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.first_name)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.first_name)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Gender <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.gender_id)}</span></div><select class="input" data-v-7104f0ee${_scopeId}><option value="-1" disabled data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.gender_id) ? ssrLooseContain(form.gender_id, "-1") : ssrLooseEqual(form.gender_id, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
            ssrRenderList(unref(genders), (dd) => {
              _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.gender_id) ? ssrLooseContain(form.gender_id, dd.id) : ssrLooseEqual(form.gender_id, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Position <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.role_id)}</span></div><select class="input" data-v-7104f0ee${_scopeId}><option value="-1" disabled data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, "-1") : ssrLooseEqual(form.role_id, "-1")) ? " selected" : ""}${_scopeId}> Choose ... </option><!--[-->`);
            ssrRenderList(unref(roles), (dd) => {
              _push2(`<option${ssrRenderAttr("value", dd.id)} data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, dd.id) : ssrLooseEqual(form.role_id, dd.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(dd.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Date of Birth <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.dob)}</span></div><input${ssrRenderAttr("value", form.dob)} type="date" class="input" data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Hire Date <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.hire_date)}</span></div><input${ssrRenderAttr("value", form.hire_date)} type="date" class="input" data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Leave Date </label><input${ssrRenderAttr("value", form.leave_date)} type="date" class="input" data-v-7104f0ee${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Surname"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.surname), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.surname = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.surname]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("First Name"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.first_name), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.first_name = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.first_name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Gender "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.gender_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.gender_id = $event,
                  class: "input"
                }, [
                  createVNode("option", {
                    value: "-1",
                    disabled: ""
                  }, " Choose ... "),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(genders), (dd) => {
                    return openBlock(), createBlock("option", {
                      key: dd.id,
                      value: dd.id
                    }, toDisplayString(dd.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [
                    vModelSelect,
                    form.gender_id,
                    void 0,
                    { number: true }
                  ]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Position "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.role_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.role_id = $event,
                  class: "input"
                }, [
                  createVNode("option", {
                    value: "-1",
                    disabled: ""
                  }, " Choose ... "),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(roles), (dd) => {
                    return openBlock(), createBlock("option", {
                      key: dd.id,
                      value: dd.id
                    }, toDisplayString(dd.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [
                    vModelSelect,
                    form.role_id,
                    void 0,
                    { number: true }
                  ]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Date of Birth "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.dob), 1)
                ]),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => form.dob = $event,
                  type: "date",
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.dob]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Hire Date "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.hire_date), 1)
                ]),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => form.hire_date = $event,
                  type: "date",
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.hire_date]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Leave Date "),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => form.leave_date = $event,
                  type: "date",
                  class: "input"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.leave_date]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, { title: "2. Family" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Marital <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.marital_status_id)}</span></div><select class="input" data-v-7104f0ee${_scopeId}><option value="-1" data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.marital_status_id) ? ssrLooseContain(form.marital_status_id, "-1") : ssrLooseEqual(form.marital_status_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ... </option><!--[-->`);
            ssrRenderList(unref(maritalStatuses), (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)} data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.marital_status_id) ? ssrLooseContain(form.marital_status_id, m.id) : ssrLooseEqual(form.marital_status_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Spouse</label><input type="text" class="input"${ssrRenderAttr("value", form.spouse_name)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Spouse Job</label><input type="text" class="input"${ssrRenderAttr("value", form.spouse_job)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Father</label><input type="text" class="input"${ssrRenderAttr("value", form.father_name)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Father Job</label><input type="text" class="input"${ssrRenderAttr("value", form.father_job)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Mother</label><input type="text" class="input"${ssrRenderAttr("value", form.mother_name)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Mother Job</label><input type="text" class="input"${ssrRenderAttr("value", form.mother_job)} data-v-7104f0ee${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Marital "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.marital_status_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.marital_status_id = $event,
                  class: "input"
                }, [
                  createVNode("option", { value: "-1" }, "Choose ... "),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(maritalStatuses), (m) => {
                    return openBlock(), createBlock("option", {
                      key: m.id,
                      value: m.id
                    }, toDisplayString(m.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [vModelSelect, form.marital_status_id]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Spouse"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.spouse_name = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.spouse_name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Spouse Job"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.spouse_job = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.spouse_job]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Father"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.father_name = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.father_name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Father Job"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.father_job = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.father_job]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Mother"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.mother_name = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.mother_name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Mother Job"),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.mother_job = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.mother_job]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, { title: "3. Contact" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Phone<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.phone)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.phone)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Telegram<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.telegram)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.telegram)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Facebook<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.facebook)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.facebook)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Address <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.current_address)}</span></div><textarea class="input" rows="2" data-v-7104f0ee${_scopeId}>${ssrInterpolate(form.current_address)}</textarea></div><div data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Note </label><textarea class="input" rows="3" data-v-7104f0ee${_scopeId}>${ssrInterpolate(form.note)}</textarea></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Phone"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.phone), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.phone = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.phone]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Telegram"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.telegram), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.telegram = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.telegram]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Facebook"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.facebook), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.facebook = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.facebook]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Address "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.current_address), 1)
                ]),
                withDirectives(createVNode("textarea", {
                  "onUpdate:modelValue": ($event) => form.current_address = $event,
                  class: "input",
                  rows: "2"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.current_address]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "label" }, "Note "),
                withDirectives(createVNode("textarea", {
                  "onUpdate:modelValue": ($event) => form.note = $event,
                  class: "input",
                  rows: "3"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.note]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div data-v-7104f0ee>`);
      _push(ssrRenderComponent(ComponentCard, { title: "4. Guarantor" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Name<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.guarantor_name)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.guarantor_name)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Job<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.guarantor_job)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.guarantor_job)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Working Place<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.guarantor_working_place)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.guarantor_working_place)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Address<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.guarantor_address)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.guarantor_address)} data-v-7104f0ee${_scopeId}></div><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Phone<span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.guarantor_phone)}</span></div><input type="text" class="input"${ssrRenderAttr("value", form.guarantor_phone)} data-v-7104f0ee${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Name"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.guarantor_name), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.guarantor_name = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.guarantor_name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Job"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.guarantor_job), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.guarantor_job = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.guarantor_job]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Working Place"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.guarantor_working_place), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.guarantor_working_place = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.guarantor_working_place]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Address"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.guarantor_address), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.guarantor_address = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.guarantor_address]
                ])
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Phone"),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.guarantor_phone), 1)
                ]),
                withDirectives(createVNode("input", {
                  type: "text",
                  class: "input",
                  "onUpdate:modelValue": ($event) => form.guarantor_phone = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, form.guarantor_phone]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ComponentCard, {
        title: "5. Status",
        class: "!mt-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Status <span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}> *</span></label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.status_id)}</span></div><select class="input" data-v-7104f0ee${_scopeId}><option value="-1" data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.status_id) ? ssrLooseContain(form.status_id, "-1") : ssrLooseEqual(form.status_id, "-1")) ? " selected" : ""}${_scopeId}>Choose ... </option><!--[-->`);
            ssrRenderList(unref(statuses), (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)} data-v-7104f0ee${ssrIncludeBooleanAttr(Array.isArray(form.status_id) ? ssrLooseContain(form.status_id, m.id) : ssrLooseEqual(form.status_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.label)}</option>`);
            });
            _push2(`<!--]--></select></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "label" }, [
                    createTextVNode("Status "),
                    createVNode("span", { class: "text-red-500 text-sm" }, " *")
                  ]),
                  createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.status_id), 1)
                ]),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => form.status_id = $event,
                  class: "input"
                }, [
                  createVNode("option", { value: "-1" }, "Choose ... "),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(statuses), (m) => {
                    return openBlock(), createBlock("option", {
                      key: m.id,
                      value: m.id
                    }, toDisplayString(m.label), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [vModelSelect, form.status_id]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="col-span-1 sm:col-span-2 lg:col-span-2" data-v-7104f0ee>`);
      _push(ssrRenderComponent(ComponentGrowCard, { title: "6. Education & Work History" }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition" data-v-7104f0ee${_scopeId}>`);
            if (unref(loading)) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "svg-spinners:180-ring-with-bg",
                class: "text-lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(loading) ? "Saving..." : "Save Employee")}</button>`);
          } else {
            return [
              createVNode("button", {
                onClick: submitForm,
                disabled: unref(loading),
                class: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              }, [
                unref(loading) ? (openBlock(), createBlock(_component_Icon, {
                  key: 0,
                  name: "svg-spinners:180-ring-with-bg",
                  class: "text-lg"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(unref(loading) ? "Saving..." : "Save Employee"), 1)
              ], 8, ["disabled"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(EducationTable, {
              modelValue: form.education,
              "onUpdate:modelValue": ($event) => form.education = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(WorkHistoryTable, {
              modelValue: form.work_histories,
              "onUpdate:modelValue": ($event) => form.work_histories = $event
            }, null, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-7104f0ee${_scopeId}><div data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>ID Card Image 1</label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.img1)}</span></div><input type="file" class="input" data-v-7104f0ee${_scopeId}>`);
            if (form.img1_src) {
              _push2(`<div class="mt-4" data-v-7104f0ee${_scopeId}><div class="relative group w-full" data-v-7104f0ee${_scopeId}><a${ssrRenderAttr("href", form.img1_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-7104f0ee${_scopeId}><img${ssrRenderAttr("src", form.img1_src)} class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-7104f0ee${_scopeId}></a><div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-7104f0ee${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.img1_check) ? ssrLooseContain(form.img1_check, null) : form.img1_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-7104f0ee${_scopeId}><span class="text-sm text-gray-700" data-v-7104f0ee${_scopeId}>Check</span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="w-1/2" data-v-7104f0ee${_scopeId}><div class="flex items-center justify-between" data-v-7104f0ee${_scopeId}><label class="label" data-v-7104f0ee${_scopeId}>Photo 1</label><span class="text-red-500 text-sm" data-v-7104f0ee${_scopeId}>${ssrInterpolate(errors.photo1)}</span></div><input type="file" class="input" data-v-7104f0ee${_scopeId}>`);
            if (form.photo1_src) {
              _push2(`<div class="mt-4" data-v-7104f0ee${_scopeId}><div class="relative group w-full" data-v-7104f0ee${_scopeId}><a${ssrRenderAttr("href", form.photo1_src)} target="_blank" rel="noopener noreferrer" class="block" data-v-7104f0ee${_scopeId}><img${ssrRenderAttr("src", form.photo1_src)} class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" data-v-7104f0ee${_scopeId}></a><div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" data-v-7104f0ee${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.photo1_check) ? ssrLooseContain(form.photo1_check, null) : form.photo1_check) ? " checked" : ""} class="w-4 h-4 text-blue-600 rounded pointer-events-auto" data-v-7104f0ee${_scopeId}><span class="text-sm text-gray-700" data-v-7104f0ee${_scopeId}>Check</span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode(EducationTable, {
                modelValue: form.education,
                "onUpdate:modelValue": ($event) => form.education = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(WorkHistoryTable, {
                modelValue: form.work_histories,
                "onUpdate:modelValue": ($event) => form.work_histories = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "ID Card Image 1"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.img1), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange1,
                    class: "input"
                  }, null, 32),
                  form.img1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: form.img1_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: form.img1_src,
                          onClick: openImg1,
                          class: "w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => form.img1_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, form.img1_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "w-1/2" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("label", { class: "label" }, "Photo 1"),
                    createVNode("span", { class: "text-red-500 text-sm" }, toDisplayString(errors.photo1), 1)
                  ]),
                  createVNode("input", {
                    type: "file",
                    onChange: onFileChange3,
                    class: "input"
                  }, null, 32),
                  form.photo1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "relative group w-full" }, [
                      createVNode("a", {
                        href: form.photo1_src,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "block"
                      }, [
                        createVNode("img", {
                          src: form.photo1_src,
                          onClick: openPhoto1,
                          class: "w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer"
                        }, null, 8, ["src"])
                      ], 8, ["href"]),
                      createVNode("div", { class: "absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => form.photo1_check = $event,
                          class: "w-4 h-4 text-blue-600 rounded pointer-events-auto"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, form.photo1_check]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Check")
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/employees/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7104f0ee"]]);

export { create as default };
//# sourceMappingURL=create-C0dUWqsm.mjs.map
