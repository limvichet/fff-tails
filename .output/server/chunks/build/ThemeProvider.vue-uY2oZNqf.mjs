import { defineComponent, ref, provide, inject } from 'vue';
import { ssrRenderSlot } from 'vue/server-renderer';

function useTheme() {
  const context = inject("theme");
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ThemeProvider",
  __ssrInlineRender: true,
  setup(__props) {
    const theme = ref("system");
    const updateDOM = (mode) => {
      if (mode === "dark") {
        (void 0).documentElement.classList.add("dark");
      } else {
        (void 0).documentElement.classList.remove("dark");
      }
    };
    const getSystemTheme = () => {
      return (void 0).matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    const applyTheme = () => {
      if (theme.value === "system") {
        updateDOM(getSystemTheme());
      } else {
        updateDOM(theme.value);
      }
    };
    const setTheme = (newTheme) => {
      theme.value = newTheme;
      localStorage.setItem("theme", newTheme);
      applyTheme();
    };
    provide("theme", {
      theme,
      setTheme
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    };
  }
});

export { _sfc_main as _, useTheme as u };
//# sourceMappingURL=ThemeProvider.vue-uY2oZNqf.mjs.map
