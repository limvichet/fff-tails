import { _ as __nuxt_component_0 } from './ThemeProvider-DC2sl9V8.mjs';
import { withCtx, renderSlot, createVNode, defineComponent, mergeProps, unref, inject, computed, resolveComponent, createBlock, createCommentVNode, openBlock, resolveDynamicComponent, toDisplayString, createTextVNode, ref, provide, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _imports_0, a as _imports_1, b as _sfc_main$b } from './virtual_public-DgezuB96.mjs';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { useRoute, RouterLink } from 'vue-router';
import { P as PencilIcon, S as SearchIcon, U as UserGroupIcon, _ as _sfc_main$3$1, L as ListIcon, a as TableIcon, b as PieChartIcon, c as UserShildIcon, d as UserSettingIcon, e as UserLockIcon, H as HorizontalDots, C as ChevronDownIcon, f as UserCircleIcon, g as SettingsIcon, I as InfoCircleIcon, h as LogoutIcon } from './UserSettingIcon-DcesTRPJ.mjs';
import { _ as _export_sfc, h as useRoute$1, g as useAuth, a as useRouter, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BCc79yUT.mjs';
import './ThemeProvider.vue-uY2oZNqf.mjs';
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

const SidebarSymbol = /* @__PURE__ */ Symbol();
function useSidebarProvider() {
  const isExpanded = ref(true);
  const isMobileOpen = ref(false);
  const isMobile = ref(false);
  const isHovered = ref(false);
  const activeItem = ref(null);
  const openSubmenu = ref(null);
  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value;
    } else {
      isExpanded.value = !isExpanded.value;
    }
  };
  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value;
  };
  const setIsHovered = (value) => {
    isHovered.value = value;
  };
  const setActiveItem = (item) => {
    activeItem.value = item;
  };
  const toggleSubmenu = (item) => {
    openSubmenu.value = openSubmenu.value === item ? null : item;
  };
  const context = {
    isExpanded: computed(() => isMobile.value ? false : isExpanded.value),
    isMobileOpen,
    isHovered,
    activeItem,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
    setActiveItem,
    toggleSubmenu
  };
  provide(SidebarSymbol, context);
  return context;
}
function useSidebar() {
  const context = inject(SidebarSymbol);
  if (!context) {
    throw new Error(
      "useSidebar must be used within a component that has SidebarProvider as an ancestor"
    );
  }
  return context;
}
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SidebarProvider",
  __ssrInlineRender: true,
  setup(__props) {
    useSidebarProvider();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/SidebarProvider.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_1$1 = Object.assign(_sfc_main$a, { __name: "LayoutSidebarProvider" });
const _imports_2 = publicAssetsURL("/imgs/logo32.svg");
const _sfc_main$9 = {
  __name: "LayoutAppSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
    const menuGroups = [
      {
        title: "Loan Managements",
        items: [
          {
            icon: UserGroupIcon,
            name: "Customers",
            subItems: [
              { name: "Create", path: "/app/dashboard/customers/create", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/customers", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: _sfc_main$3$1,
            name: "Loans",
            subItems: [
              { name: "Create", path: "/app/dashboard/loanrecords/create", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/loanrecords", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: ListIcon,
            name: "Schedules",
            subItems: [
              { name: "Create", path: "/app/dashboard/schedules/create", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/schedules", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: TableIcon,
            name: "Payments",
            subItems: [
              { name: "Search", path: "/app/dashboard/payments", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: PieChartIcon,
            name: "Reports",
            subItems: [
              { name: "Create", path: "/app/dashboard/s/create", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/s", pro: false, icon: SearchIcon }
            ]
          }
        ]
      },
      {
        title: "Administrative Tools",
        items: [
          {
            icon: UserShildIcon,
            name: "Employees",
            subItems: [
              { name: "Create", path: "/app/dashboard/employeess/creates", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/employeesss", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: UserSettingIcon,
            name: "Users & Permissions",
            subItems: [
              { name: "Create", path: "/app/dashboard/user-permissionss/create", pro: false, icon: PencilIcon },
              { name: "Search", path: "/app/dashboard/user-permissionss", pro: false, icon: SearchIcon }
            ]
          },
          {
            icon: UserLockIcon,
            name: "Roles & Permission",
            subItems: [
              { name: "Roles", path: "/app/dashboard/roless", pro: false, icon: SearchIcon },
              { name: "Permissions", path: "/app/dashboard/permissionss", pro: false, icon: SearchIcon }
            ]
          }
          // ... Add other menu items here
        ]
      }
    ];
    const isActive = (path) => route.path === path;
    const isAnySubmenuRouteActive = computed(() => {
      return menuGroups.some(
        (group) => group.items.some(
          (item) => item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
        )
      );
    });
    const isSubmenuOpen = (groupIndex, itemIndex) => {
      const key = `${groupIndex}-${itemIndex}`;
      return openSubmenu.value === key || isAnySubmenuRouteActive.value && menuGroups[groupIndex].items[itemIndex].subItems?.some(
        (subItem) => isActive(subItem.path)
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: [
          "fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200",
          {
            "lg:w-[290px]": unref(isExpanded) || unref(isMobileOpen) || unref(isHovered),
            "lg:w-[90px]": !unref(isExpanded) && !unref(isHovered),
            "translate-x-0 w-[290px]": unref(isMobileOpen),
            "-translate-x-full": !unref(isMobileOpen),
            "lg:translate-x-0": true
          }
        ]
      }, _attrs))}>`);
      if (!unref(isMobileOpen)) {
        _push(`<div class="${ssrRenderClass([
          "flex py-6 mt-2",
          // or pt-3 / pt-4 (small spacing)
          !unref(isExpanded) && !unref(isHovered) ? "lg:justify-center" : "justify-start"
        ])}">`);
        if (!unref(isMobileOpen)) {
          _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (unref(isExpanded) || unref(isHovered)) {
                  _push2(`<img class="dark:hidden"${ssrRenderAttr("src", _imports_0)} alt="Logo" width="150" height="40"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                if (unref(isExpanded) || unref(isHovered)) {
                  _push2(`<img class="hidden dark:block"${ssrRenderAttr("src", _imports_1)} alt="Logo" width="150" height="40"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                if (!unref(isExpanded) && !unref(isHovered)) {
                  _push2(`<img class="dark:hidden"${ssrRenderAttr("src", _imports_2)} alt="Logo" width="32" height="32"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  unref(isExpanded) || unref(isHovered) ? (openBlock(), createBlock("img", {
                    key: 0,
                    class: "dark:hidden",
                    src: _imports_0,
                    alt: "Logo",
                    width: "150",
                    height: "40"
                  })) : createCommentVNode("", true),
                  unref(isExpanded) || unref(isHovered) ? (openBlock(), createBlock("img", {
                    key: 1,
                    class: "hidden dark:block",
                    src: _imports_1,
                    alt: "Logo",
                    width: "150",
                    height: "40"
                  })) : createCommentVNode("", true),
                  !unref(isExpanded) && !unref(isHovered) ? (openBlock(), createBlock("img", {
                    key: 2,
                    class: "dark:hidden",
                    src: _imports_2,
                    alt: "Logo",
                    width: "32",
                    height: "32"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"><nav class="mb-6"><div class="flex flex-col gap-4"><!--[-->`);
      ssrRenderList(menuGroups, (menuGroup, groupIndex) => {
        _push(`<div><h2 class="${ssrRenderClass([
          "mb-4 text-xs uppercase flex leading-[20px] text-blue-900",
          !unref(isExpanded) && !unref(isHovered) ? "lg:justify-center pt-6" : "justify-start pt-4"
        ])}">`);
        if (unref(isExpanded) || unref(isHovered) || unref(isMobileOpen)) {
          _push(`<!--[-->${ssrInterpolate(menuGroup.title)}<!--]-->`);
        } else {
          _push(ssrRenderComponent(unref(HorizontalDots), null, null, _parent));
        }
        _push(`</h2><ul class="flex flex-col gap-4"><!--[-->`);
        ssrRenderList(menuGroup.items, (item, index) => {
          _push(`<li>`);
          if (item.subItems) {
            _push(`<button class="${ssrRenderClass([
              "menu-item group w-full",
              {
                "menu-item-active": isSubmenuOpen(groupIndex, index),
                "menu-item-inactive": !isSubmenuOpen(groupIndex, index)
              },
              !unref(isExpanded) && !unref(isHovered) ? "lg:justify-center" : "lg:justify-start"
            ])}"><span class="${ssrRenderClass([
              isSubmenuOpen(groupIndex, index) ? "menu-item-icon-active" : "menu-item-icon-inactive"
            ])}">`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), null, null), _parent);
            _push(`</span>`);
            if (unref(isExpanded) || unref(isHovered) || unref(isMobileOpen)) {
              _push(`<span class="menu-item-text">${ssrInterpolate(item.name)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(isExpanded) || unref(isHovered) || unref(isMobileOpen)) {
              _push(ssrRenderComponent(unref(ChevronDownIcon), {
                class: [
                  "ml-auto w-5 h-5 transition-transform duration-200",
                  {
                    "rotate-180 text-brand-500": isSubmenuOpen(
                      groupIndex,
                      index
                    )
                  }
                ]
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          } else if (item.path) {
            _push(ssrRenderComponent(_component_router_link, {
              to: item.path,
              class: [
                "menu-item group",
                {
                  "menu-item-active": isActive(item.path),
                  "menu-item-inactive": !isActive(item.path)
                }
              ]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="${ssrRenderClass([
                    isActive(item.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  ])}"${_scopeId}>`);
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), null, null), _parent2, _scopeId);
                  _push2(`</span>`);
                  if (unref(isExpanded) || unref(isHovered) || unref(isMobileOpen)) {
                    _push2(`<span class="menu-item-text"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("span", {
                      class: [
                        isActive(item.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                      ]
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon)))
                    ], 2),
                    unref(isExpanded) || unref(isHovered) || unref(isMobileOpen) ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "menu-item-text"
                    }, toDisplayString(item.name), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div style="${ssrRenderStyle(isSubmenuOpen(groupIndex, index) && (unref(isExpanded) || unref(isHovered) || unref(isMobileOpen)) ? null : { display: "none" })}"><ul class="mt-2 space-y-0 ml-5"><!--[-->`);
          ssrRenderList(item.subItems, (subItem) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_router_link, {
              to: subItem.path,
              class: [
                "menu-dropdown-item",
                {
                  "menu-dropdown-item-active": isActive(
                    subItem.path
                  ),
                  "menu-dropdown-item-inactive": !isActive(
                    subItem.path
                  )
                }
              ]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="flex items-center justify-center w-5 h-5"${_scopeId}>`);
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(subItem.icon), null, null), _parent2, _scopeId);
                  _push2(`</span> ${ssrInterpolate(subItem.name)} <span class="flex items-center ml-auto"${_scopeId}>`);
                  if (subItem.new) {
                    _push2(`<span class="${ssrRenderClass([
                      "menu-dropdown-badge",
                      {
                        "menu-dropdown-badge-active": isActive(
                          subItem.path
                        ),
                        "menu-dropdown-badge-inactive": !isActive(
                          subItem.path
                        )
                      }
                    ])}"${_scopeId}></span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (subItem.pro) {
                    _push2(`<span class="${ssrRenderClass([
                      "menu-dropdown-badge",
                      {
                        "menu-dropdown-badge-active": isActive(
                          subItem.path
                        ),
                        "menu-dropdown-badge-inactive": !isActive(
                          subItem.path
                        )
                      }
                    ])}"${_scopeId}> pro </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</span>`);
                } else {
                  return [
                    createVNode("span", { class: "flex items-center justify-center w-5 h-5" }, [
                      (openBlock(), createBlock(resolveDynamicComponent(subItem.icon)))
                    ]),
                    createTextVNode(" " + toDisplayString(subItem.name) + " ", 1),
                    createVNode("span", { class: "flex items-center ml-auto" }, [
                      subItem.new ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: [
                          "menu-dropdown-badge",
                          {
                            "menu-dropdown-badge-active": isActive(
                              subItem.path
                            ),
                            "menu-dropdown-badge-inactive": !isActive(
                              subItem.path
                            )
                          }
                        ]
                      }, null, 2)) : createCommentVNode("", true),
                      subItem.pro ? (openBlock(), createBlock("span", {
                        key: 1,
                        class: [
                          "menu-dropdown-badge",
                          {
                            "menu-dropdown-badge-active": isActive(
                              subItem.path
                            ),
                            "menu-dropdown-badge-inactive": !isActive(
                              subItem.path
                            )
                          }
                        ]
                      }, " pro ", 2)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div></li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--></div></nav></div></aside>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppSidebar.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Backdrop",
  __ssrInlineRender: true,
  setup(__props) {
    const { toggleMobileSidebar, isMobileOpen } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isMobileOpen)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-gray-900/50 z-9999 lg:hidden" }, _attrs))}></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Backdrop.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$8, { __name: "LayoutBackdrop" });
const _sfc_main$7 = {
  __name: "LayoutHeaderLogo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RouterLink), mergeProps({
        to: "/",
        class: "lg:hidden"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="dark:hidden"${ssrRenderAttr("src", _imports_0)} alt="Logo"${_scopeId}><img class="hidden dark:block"${ssrRenderAttr("src", _imports_1)} alt="Logo"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "dark:hidden",
                src: _imports_0,
                alt: "Logo"
              }),
              createVNode("img", {
                class: "hidden dark:block",
                src: _imports_1,
                alt: "Logo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/header/HeaderLogo.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "NotificationMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { hasRole } = useAuth();
    const dropdownOpen = ref(false);
    ref(true);
    const dropdownRef = ref(null);
    const notifications = ref([]);
    ref(0);
    const unreadCount = ref(0);
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(hasRole)("admin") || unref(hasRole)("ceo")) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "relative",
          ref_key: "dropdownRef",
          ref: dropdownRef
        }, _attrs))}><button class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700">`);
        if (unreadCount.value > 0) {
          _push(`<span class="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-400 text-white text-xs">${ssrInterpolate(unreadCount.value)}<span class="absolute w-4 h-4 bg-orange-400 rounded-full opacity-75 animate-ping"></span></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<svg class="fill-current" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"></path></svg></button>`);
        if (dropdownOpen.value) {
          _push(`<div class="absolute mt-2 flex w-[350px] max-h-[400px] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg overflow-y-auto left-0 lg:right-0 lg:left-auto z-50"><h5 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200"> Loan Notifications (${ssrInterpolate(unreadCount.value)}) </h5><ul class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
          ssrRenderList(notifications.value, (loan) => {
            _push(`<li class="${ssrRenderClass([
              "p-3 cursor-pointer transition rounded-lg",
              "text-gray-800 dark:text-gray-200",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              loan.loan_check_status === 0 ? "bg-blue-50 dark:bg-blue-900/20" : ""
            ])}"><div class="flex justify-between items-center"><span> #${ssrInterpolate(loan.id)} - ${ssrInterpolate(loan.loan_totalcash)}</span>`);
            if (loan.loan_check_status === 0) {
              _push(`<span class="text-xs font-medium text-blue-600 dark:text-blue-400"> Unread </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></li>`);
          });
          _push(`<!--]--></ul>`);
          if (notifications.value.length === 0) {
            _push(`<div class="text-center py-4 text-gray-500 dark:text-gray-400"> No notifications </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/header/NotificationMenu.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const NotificationMenu = Object.assign(_sfc_main$6, { __name: "LayoutHeaderNotificationMenu" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ModalChangePassword",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const form = ref({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" }, _attrs))} data-v-beacaacd><div class="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl mx-4 relative" data-v-beacaacd><h2 class="text-3xl text-gray-800 mb-2" data-v-beacaacd>Change Password</h2><p class="text-gray-500 mb-6 text-sm" data-v-beacaacd>Please enter your old and new password to change it!</p><div class="space-y-5" data-v-beacaacd><div data-v-beacaacd><label class="block font-semid-bold text-gray-700 mb-2" data-v-beacaacd>Old Password</label><input${ssrRenderAttr("value", form.value.oldPassword)} type="password" placeholder="Please enter your old password..." class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" data-v-beacaacd></div><div data-v-beacaacd><label class="block font-semid-bold text-gray-700 mb-2" data-v-beacaacd>New Password</label><input${ssrRenderAttr("value", form.value.newPassword)} type="password" placeholder="Please enter your new password..." class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" data-v-beacaacd></div><div data-v-beacaacd><label class="block font-semid-bold text-gray-700 mb-2" data-v-beacaacd>Confirm New Password</label><input${ssrRenderAttr("value", form.value.confirmPassword)} type="password" placeholder="Please confirm your new password..." class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" data-v-beacaacd></div><button class="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white text-md font-medium rounded-lg transition shadow-lg active:scale-95" data-v-beacaacd> Change Password </button></div><button class="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl" data-v-beacaacd>×</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/header/ModalChangePassword.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ModalChangePassword = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-beacaacd"]]), { __name: "LayoutHeaderModalChangePassword" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "UserMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, logout } = useAuth();
    useRoute$1();
    const loggingOut = async () => {
      await logout();
      closeDropdown();
      await navigateTo("/app/signin");
    };
    const dropdownOpen = ref(false);
    ref(null);
    const menuItems = [
      { href: "/chat", icon: UserCircleIcon, text: "Account settings" },
      { icon: SettingsIcon, text: "Change Password", action: "modal" },
      { href: "/profile", icon: InfoCircleIcon, text: "Support" }
    ];
    const closeDropdown = () => {
      dropdownOpen.value = false;
    };
    const signOut = () => {
      loggingOut();
      closeDropdown();
    };
    const isPasswordModalOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="relative"><button class="flex items-center text-blue-800 dark:text-blue-500"><span class="mr-3 overflow-hidden rounded-full h-11 w-11 shadow-lg"><img${ssrRenderAttr("src", unref(user)?.photo_url)} alt="User" class="object-cover h-full w-full"></span><span class="block mr-1 font-medium text-theme-sm">${ssrInterpolate(unref(user)?.name)}</span>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), {
        class: { "rotate-180": dropdownOpen.value }
      }, null, _parent));
      _push(`</button>`);
      if (dropdownOpen.value) {
        _push(`<div class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"><div><span class="block font-medium text-blue-800 text-theme-sm dark:text-blue-700">${ssrInterpolate(unref(user)?.name)}</span><span class="mt-0.5 block text-theme-xs text-blue-500 dark:text-blue-400">${ssrInterpolate(unref(user)?.email)}</span></div><ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800"><!--[-->`);
        ssrRenderList(menuItems, (item) => {
          _push(`<li>`);
          if (item.href) {
            _push(ssrRenderComponent(unref(RouterLink), {
              to: item.href,
              class: "flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5",
              onClick: closeDropdown
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "text-gray-500 group-hover:text-gray-700" }, null), _parent2, _scopeId);
                  _push2(` ${ssrInterpolate(item.text)}`);
                } else {
                  return [
                    (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "text-gray-500 group-hover:text-gray-700" })),
                    createTextVNode(" " + toDisplayString(item.text), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<button class="flex w-full items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "text-gray-500 group-hover:text-gray-700" }, null), _parent);
            _push(` ${ssrInterpolate(item.text)}</button>`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/signin",
          onClick: signOut,
          class: "flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LogoutIcon), { class: "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" }, null, _parent2, _scopeId));
              _push2(` Sign out `);
            } else {
              return [
                createVNode(unref(LogoutIcon), { class: "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" }),
                createTextVNode(" Sign out ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(ModalChangePassword, {
        isOpen: isPasswordModalOpen.value,
        onClose: ($event) => isPasswordModalOpen.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/header/UserMenu.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const UserMenu = Object.assign(_sfc_main$4, { __name: "LayoutHeaderUserMenu" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PageBreadcrumb",
  __ssrInlineRender: true,
  props: {
    pageTitle: {},
    pageSubTitle: {}
  },
  setup(__props) {
    const ChevronRightIcon = () => h("svg", {
      class: "stroke-current",
      width: "17",
      height: "16",
      viewBox: "0 0 17 16",
      fill: "none"
    }, [
      h("path", {
        d: "M6.0765 12.667L10.2432 8.50033L6.0765 4.33366",
        stroke: "currentColor",
        "stroke-width": "1.2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      })
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "hidden lg:block" }, _attrs))}><nav aria-label="Breadcrumb"><ol class="flex items-center gap-1.5"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-gray-500 hover:text-primary dark:text-gray-400",
        to: "/app/dashboard"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Home `);
          } else {
            return [
              createTextVNode(" Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li>`);
      if (__props.pageTitle) {
        _push(`<li class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">`);
        _push(ssrRenderComponent(ChevronRightIcon, { class: "text-gray-400" }, null, _parent));
        _push(`<span class="${ssrRenderClass({ "font-medium": !__props.pageSubTitle })}">${ssrInterpolate(__props.pageTitle)}</span></li>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.pageSubTitle) {
        _push(`<li class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90 font-medium">`);
        _push(ssrRenderComponent(ChevronRightIcon, { class: "text-gray-400" }, null, _parent));
        _push(`<span>${ssrInterpolate(__props.pageSubTitle)}</span></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ol></nav></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/PageBreadcrumb.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const PageBreadcrumb = Object.assign(_sfc_main$3, { __name: "CommonPageBreadcrumb" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
    ref(false);
    ref(false);
    const isApplicationMenuOpen = ref(false);
    const route = useRoute$1();
    const pageTitle = computed(() => route.meta.breadcrumb?.title || "");
    const pageSubTitle = computed(() => route.meta.breadcrumb?.subTitle || "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b" }, _attrs))}><div class="flex flex-col items-center justify-between grow lg:flex-row lg:px-6"><div class="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"><button class="${ssrRenderClass([[
        unref(isMobileOpen) ? "lg:bg-transparent dark:lg:bg-transparent bg-gray-100 dark:bg-gray-800" : ""
      ], "flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"])}">`);
      if (unref(isMobileOpen)) {
        _push(`<svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill=""></path></svg>`);
      } else {
        _push(`<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor"></path></svg>`);
      }
      _push(`</button>`);
      _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      _push(`<button class="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor"></path></svg></button>`);
      _push(ssrRenderComponent(PageBreadcrumb, {
        pageTitle: unref(pageTitle),
        pageSubTitle: unref(pageSubTitle)
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([[isApplicationMenuOpen.value ? "flex" : "hidden"], "items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none"])}"><div class="flex items-center gap-2 2xsm:gap-3">`);
      _push(ssrRenderComponent(_sfc_main$b, null, null, _parent));
      _push(ssrRenderComponent(NotificationMenu, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(UserMenu, null, null, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "LayoutAppHeader" });
const _sfc_main$1 = {
  __name: "LayoutAdminLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const { isExpanded, isHovered } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_layout_app_sidebar = _sfc_main$9;
      const _component_layout_backdrop = __nuxt_component_1;
      const _component_layout_app_header = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen xl:flex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_layout_app_sidebar, null, null, _parent));
      _push(ssrRenderComponent(_component_layout_backdrop, null, null, _parent));
      _push(`<div class="${ssrRenderClass([[unref(isExpanded) || unref(isHovered) ? "lg:ml-[290px]" : "lg:ml-[90px]"], "flex-1 transition-all duration-300 ease-in-out"])}">`);
      _push(ssrRenderComponent(_component_layout_app_header, null, null, _parent));
      _push(`<div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AdminLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_LayoutThemeProvider = __nuxt_component_0;
  const _component_LayoutSidebarProvider = __nuxt_component_1$1;
  const _component_layout_admin_layout = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_LayoutThemeProvider, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_LayoutSidebarProvider, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_layout_admin_layout, null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default")
                    ];
                  }
                }),
                _: 3
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_layout_admin_layout, null, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                })
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_LayoutSidebarProvider, null, {
            default: withCtx(() => [
              createVNode(_component_layout_admin_layout, null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })
            ]),
            _: 3
          })
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const auth = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { auth as default };
//# sourceMappingURL=auth-0iVlMR0d.mjs.map
