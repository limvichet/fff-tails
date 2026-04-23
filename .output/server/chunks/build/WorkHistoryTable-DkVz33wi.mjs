import { defineComponent, mergeModels, useModel, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EducationTable",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    modelValue: {}
  }, {
    "modelValue": { default: () => [] },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const educations = useModel(__props, "modelValue");
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(educations.value)) {
          educations.value = newVal.length ? [...newVal] : [{ id: Date.now(), description: "", date: "" }];
        }
      },
      { immediate: true, deep: true }
    );
    watch(
      educations,
      (newVal) => {
        emit("update:modelValue", newVal);
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-md font-semibold mb-3"><span class="mr-1"></span> Education Info </h1><div class="overflow-x-auto"><table class="min-w-full border border-gray-200"><thead class="bg-gray-100 text-sm"><tr><th class="w-[70%] text-left px-3 py-2">Description</th><th class="w-[30%] text-left px-3 py-2">Date</th><th class="text-center px-3 py-2"><button type="button" class="bg-blue-500 text-white px-2 py-1 rounded"> + </button></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(educations.value, (item, index) => {
        _push(`<tr class="border-t"><td class="px-3 py-2"><input${ssrRenderAttr("value", item.description)} type="text" class="w-full border rounded px-2 py-1 focus:outline-none focus:ring" placeholder="Description"></td><td class="px-3 py-2"><input${ssrRenderAttr("value", item.date)} type="date" maxlength="10" class="w-full border rounded px-2 py-1 focus:outline-none focus:ring"></td><td class="text-center px-3 py-2"><button type="button" class="bg-red-500 text-white px-2 py-1 rounded"> - </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/EducationTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EducationTable = Object.assign(_sfc_main$1, { __name: "FormsEducationTable" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WorkHistoryTable",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    modelValue: {}
  }, {
    "modelValue": { default: () => [] },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const workHistories = useModel(__props, "modelValue");
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(workHistories.value)) {
          workHistories.value = newVal.length ? [...newVal] : [{ id: Date.now(), description: "", date: "", end_date: "" }];
        }
      },
      { immediate: true, deep: true }
    );
    watch(
      workHistories,
      (newVal) => {
        emit("update:modelValue", newVal);
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-md font-semibold mb-3"><span class="mr-1">Work History</span></h1><div class="overflow-x-auto"><table class="min-w-full border border-gray-200"><thead class="bg-gray-100 text-sm"><tr><th class="w-[60%] text-left px-3 py-2">Description</th><th class="w-[20%] text-left px-1 py-2">Start Date</th><th class="w-[20%] text-left px-1 py-2">End Date</th><th class="text-center px-1 py-2"><button type="button" class="bg-blue-500 text-white px-2 py-1 rounded"> + </button></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(workHistories.value, (item, index) => {
        _push(`<tr class="border-t"><td class="px-3 py-1"><input${ssrRenderAttr("value", item.description)} type="text" class="w-full border rounded px-2 py-1" placeholder="Work description"></td><td class="px-1 py-2"><input${ssrRenderAttr("value", item.date)} type="date" maxlength="10" class="w-full border rounded px-2 py-1"></td><td class="px-1 py-2"><input${ssrRenderAttr("value", item.end_date)} type="date" maxlength="10" class="w-full border rounded px-2 py-1"></td><td class="text-center px-1 py-2"><button type="button" class="bg-red-500 text-white px-2 py-1 rounded"> - </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/WorkHistoryTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const WorkHistoryTable = Object.assign(_sfc_main, { __name: "FormsWorkHistoryTable" });

export { EducationTable as E, WorkHistoryTable as W };
//# sourceMappingURL=WorkHistoryTable-DkVz33wi.mjs.map
