import { defineComponent, ref, reactive, unref, withCtx, createVNode, withDirectives, vModelText, createBlock, openBlock, Fragment, renderList, toDisplayString, vModelSelect, createCommentVNode, createTextVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useMessage, C as ComponentCard } from './useMessage-Doqk68dv.mjs';
import { C as ComponentGrowCard } from './ComponentGrowCard-D1HotIDG.mjs';
import { E as EducationTable, W as WorkHistoryTable } from './WorkHistoryTable-DkVz33wi.mjs';
import { _ as _export_sfc, u as useHead, h as useRoute } from './server.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Edit Employees",
      meta: [{ name: "loanrecords", content: "edit employees" }]
    });
    const route = useRoute();
    const id = route.params.id;
    useHead({
      title: "Employee Detail"
    });
    const { successMsg, errorMsg, success } = useMessage();
    const loading = ref(false);
    const formReady = ref(false);
    reactive({});
    const genders = ref([]);
    const roles = ref([]);
    const maritalStatuses = ref([]);
    const statuses = ref([]);
    const form = reactive({
      id: null,
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
    function formatDateForInput(date) {
      if (!date) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      const parts = date.split("-");
      return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;
    }
    const syncFormWithData = (data) => {
      Object.assign(form, {
        ...data,
        dob: formatDateForInput(data.dob),
        hire_date: formatDateForInput(data.hire_date),
        leave_date: formatDateForInput(data.leave_date),
        img1_src: data.img1_url ?? null,
        photo1_src: data.photo1_url ?? null,
        img1_check: !!data.img1_url,
        photo1_check: !!data.photo1_url,
        education: data.education || [],
        work_histories: data.work_histories || []
      });
    };
    const handleImageChange = (event, imageKey, previewKey, checkKey) => {
      const file = event.target.files?.[0];
      if (!file) return;
      form[imageKey] = file;
      form[checkKey] = true;
      form[previewKey] = URL.createObjectURL(file);
    };
    const compressImage = (file) => {
      return new Promise((resolve) => {
        const img = new Image();
        const canvas = (void 0).createElement("canvas");
        img.onload = () => {
          const scale = Math.sqrt(1024 * 1024 / file.size);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob ? new File([blob], file.name, { type: file.type }) : file), file.type, 0.7);
        };
        img.src = URL.createObjectURL(file);
      });
    };
    const updateForm = async () => {
      loading.value = true;
      errorMsg.value = "";
      try {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (["img1", "photo1", "img1_src", "photo1_src", "education", "work_histories"].includes(k)) return;
          fd.append(k, v === null || v === -1 ? "" : String(v));
        });
        fd.append("education", JSON.stringify(form.education.filter((i) => i.description)));
        fd.append("work_histories", JSON.stringify(form.work_histories.filter((i) => i.description)));
        if (form.img1 && form.img1_check) {
          const file = form.img1.size > 1024 * 1024 ? await compressImage(form.img1) : form.img1;
          fd.append("img1", file);
        }
        if (form.photo1 && form.photo1_check) {
          const file = form.photo1.size > 1024 * 1024 ? await compressImage(form.photo1) : form.photo1;
          fd.append("photo1", file);
        }
        fd.append("img1_check", form.img1_check ? "1" : "0");
        fd.append("photo1_check", form.photo1_check ? "1" : "0");
        fd.append("_method", "PUT");
        await $fetch(`/api/admin-secure/employees/${id}`, { method: "POST", body: fd });
        success("Employee updated successfully!");
        const refreshed = await $fetch(`/api/admin-secure/employees/${id}`);
        syncFormWithData(refreshed.data || refreshed);
      } catch (err) {
        errorMsg.value = err?.data?.message || "Error updating employee";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm" data-v-3f6dcd51>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm" data-v-3f6dcd51>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(formReady)) {
        _push(`<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-v-3f6dcd51><div class="lg:col-span-2 grid grid-cols-1 gap-2 lg:grid-cols-2" data-v-3f6dcd51>`);
        _push(ssrRenderComponent(ComponentCard, { title: "1. Personal Info" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Surname *</label><input${ssrRenderAttr("value", form.surname)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>First Name *</label><input${ssrRenderAttr("value", form.first_name)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Gender *</label><select class="input" data-v-3f6dcd51${_scopeId}><!--[-->`);
              ssrRenderList(unref(genders), (g) => {
                _push2(`<option${ssrRenderAttr("value", g.id)} data-v-3f6dcd51${ssrIncludeBooleanAttr(Array.isArray(form.gender_id) ? ssrLooseContain(form.gender_id, g.id) : ssrLooseEqual(form.gender_id, g.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(g.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Position *</label><select class="input" data-v-3f6dcd51${_scopeId}><!--[-->`);
              ssrRenderList(unref(roles), (r) => {
                _push2(`<option${ssrRenderAttr("value", r.id)} data-v-3f6dcd51${ssrIncludeBooleanAttr(Array.isArray(form.role_id) ? ssrLooseContain(form.role_id, r.id) : ssrLooseEqual(form.role_id, r.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-2" data-v-3f6dcd51${_scopeId}><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>DOB</label><input${ssrRenderAttr("value", form.dob)} type="date" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Hire Date</label><input${ssrRenderAttr("value", form.hire_date)} type="date" class="input" data-v-3f6dcd51${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Surname *"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.surname = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.surname]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "First Name *"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.first_name = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.first_name]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Gender *"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.gender_id = $event,
                    class: "input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(genders), (g) => {
                      return openBlock(), createBlock("option", {
                        key: g.id,
                        value: g.id
                      }, toDisplayString(g.label), 9, ["value"]);
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
                  createVNode("label", { class: "label" }, "Position *"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.role_id = $event,
                    class: "input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(roles), (r) => {
                      return openBlock(), createBlock("option", {
                        key: r.id,
                        value: r.id
                      }, toDisplayString(r.label), 9, ["value"]);
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
                createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "DOB"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.dob = $event,
                      type: "date",
                      class: "input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.dob]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Hire Date"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.hire_date = $event,
                      type: "date",
                      class: "input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.hire_date]
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ComponentCard, { title: "2. Family & Contact" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Marital Status</label><select class="input" data-v-3f6dcd51${_scopeId}><!--[-->`);
              ssrRenderList(unref(maritalStatuses), (m) => {
                _push2(`<option${ssrRenderAttr("value", m.id)} data-v-3f6dcd51${ssrIncludeBooleanAttr(Array.isArray(form.marital_status_id) ? ssrLooseContain(form.marital_status_id, m.id) : ssrLooseEqual(form.marital_status_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.label)}</option>`);
              });
              _push2(`<!--]--></select></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Phone *</label><input${ssrRenderAttr("value", form.phone)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Telegram</label><input${ssrRenderAttr("value", form.telegram)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Address</label><textarea class="input" rows="2" data-v-3f6dcd51${_scopeId}>${ssrInterpolate(form.current_address)}</textarea></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Marital Status"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.marital_status_id = $event,
                    class: "input"
                  }, [
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
                  createVNode("label", { class: "label" }, "Phone *"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.phone = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.phone]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Telegram"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.telegram = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.telegram]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Address"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => form.current_address = $event,
                    class: "input",
                    rows: "2"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.current_address]
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="lg:col-span-2" data-v-3f6dcd51>`);
        _push(ssrRenderComponent(ComponentGrowCard, { title: "3. Education & Work History" }, {
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
            } else {
              return [
                createVNode(EducationTable, {
                  modelValue: form.education,
                  "onUpdate:modelValue": ($event) => form.education = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(WorkHistoryTable, {
                  modelValue: form.work_histories,
                  "onUpdate:modelValue": ($event) => form.work_histories = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="flex flex-col gap-2" data-v-3f6dcd51>`);
        _push(ssrRenderComponent(ComponentCard, { title: "4. Guarantor" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Guarantor Name</label><input${ssrRenderAttr("value", form.guarantor_name)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Guarantor Phone</label><input${ssrRenderAttr("value", form.guarantor_phone)} type="text" class="input" data-v-3f6dcd51${_scopeId}></div><div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Status</label><select class="input" data-v-3f6dcd51${_scopeId}><!--[-->`);
              ssrRenderList(unref(statuses), (s) => {
                _push2(`<option${ssrRenderAttr("value", s.id)} data-v-3f6dcd51${ssrIncludeBooleanAttr(Array.isArray(form.status_id) ? ssrLooseContain(form.status_id, s.id) : ssrLooseEqual(form.status_id, s.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(s.label)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Guarantor Name"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.guarantor_name = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.guarantor_name]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Guarantor Phone"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => form.guarantor_phone = $event,
                    type: "text",
                    class: "input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, form.guarantor_phone]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "Status"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => form.status_id = $event,
                    class: "input"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(statuses), (s) => {
                      return openBlock(), createBlock("option", {
                        key: s.id,
                        value: s.id
                      }, toDisplayString(s.label), 9, ["value"]);
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
        _push(ssrRenderComponent(ComponentGrowCard, { title: "5. Media" }, {
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400" data-v-3f6dcd51${_scopeId}>${ssrInterpolate(unref(loading) ? "Saving..." : "Update Employee")}</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: updateForm,
                  disabled: unref(loading),
                  class: "w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                }, toDisplayString(unref(loading) ? "Saving..." : "Update Employee"), 9, ["disabled"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>ID Card Image</label><input type="file" class="input" data-v-3f6dcd51${_scopeId}>`);
              if (form.img1_src) {
                _push2(`<div class="mt-2 relative" data-v-3f6dcd51${_scopeId}><img${ssrRenderAttr("src", form.img1_src)} class="w-full h-32 object-cover rounded border" data-v-3f6dcd51${_scopeId}><div class="absolute top-1 right-1 bg-white/80 p-1 rounded text-xs" data-v-3f6dcd51${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.img1_check) ? ssrLooseContain(form.img1_check, null) : form.img1_check) ? " checked" : ""} data-v-3f6dcd51${_scopeId}> Keep </div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mt-4" data-v-3f6dcd51${_scopeId}><label class="label" data-v-3f6dcd51${_scopeId}>Photo</label><input type="file" class="input" data-v-3f6dcd51${_scopeId}>`);
              if (form.photo1_src) {
                _push2(`<div class="mt-2 relative" data-v-3f6dcd51${_scopeId}><img${ssrRenderAttr("src", form.photo1_src)} class="w-full h-32 object-cover rounded border" data-v-3f6dcd51${_scopeId}><div class="absolute top-1 right-1 bg-white/80 p-1 rounded text-xs" data-v-3f6dcd51${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.photo1_check) ? ssrLooseContain(form.photo1_check, null) : form.photo1_check) ? " checked" : ""} data-v-3f6dcd51${_scopeId}> Keep </div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("label", { class: "label" }, "ID Card Image"),
                  createVNode("input", {
                    type: "file",
                    onChange: (e) => handleImageChange(e, "img1", "img1_src", "img1_check"),
                    class: "input"
                  }, null, 40, ["onChange"]),
                  form.img1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-2 relative"
                  }, [
                    createVNode("img", {
                      src: form.img1_src,
                      class: "w-full h-32 object-cover rounded border"
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "absolute top-1 right-1 bg-white/80 p-1 rounded text-xs" }, [
                      withDirectives(createVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": ($event) => form.img1_check = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, form.img1_check]
                      ]),
                      createTextVNode(" Keep ")
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "mt-4" }, [
                  createVNode("label", { class: "label" }, "Photo"),
                  createVNode("input", {
                    type: "file",
                    onChange: (e) => handleImageChange(e, "photo1", "photo1_src", "photo1_check"),
                    class: "input"
                  }, null, 40, ["onChange"]),
                  form.photo1_src ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-2 relative"
                  }, [
                    createVNode("img", {
                      src: form.photo1_src,
                      class: "w-full h-32 object-cover rounded border"
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "absolute top-1 right-1 bg-white/80 p-1 rounded text-xs" }, [
                      withDirectives(createVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": ($event) => form.photo1_check = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, form.photo1_check]
                      ]),
                      createTextVNode(" Keep ")
                    ])
                  ])) : createCommentVNode("", true)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/dashboard/employees/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3f6dcd51"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-D95behIu.mjs.map
