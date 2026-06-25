<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  BoxCubeIcon,
  PlusIcon,
  UserGroupIcon,
  SearchIcon,
  PencilIcon,
  LoanIcon,
  SettingsIcon,
  UserShildIcon,
  UserSettingIcon,
  UserLockIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";
// import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
// import UserGroupIcon from "@/icons/UserGroupIcon.vue";

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
          { name: "Search", path: "/app/dashboard/customers", pro: false, icon: SearchIcon },
        ],
      },
      {
        icon: LoanIcon,
        name: "Loans",
        subItems: [
          { name: "Create", path: "/app/dashboard/loanrecords/create", pro: false, icon: PencilIcon  },
          { name: "Search", path: "/app/dashboard/loanrecords", pro: false, icon: SearchIcon  },
        ],
      },
      {
        icon: ListIcon,
        name: "Schedules",
        subItems: [
          { name: "Create", path: "/app/dashboard/schedules/create", pro: false, icon: PencilIcon  },
          { name: "Search", path: "/app/dashboard/schedules", pro: false, icon: SearchIcon  },
        ],
      },
      {
        icon: TableIcon,
        name: "Payments",
        subItems: [
          { name: "Search", path: "/app/dashboard/payments", pro: false, icon: SearchIcon  },
        ],
      },
      {
        icon: PieChartIcon,
        name: "Reports",
        subItems: [
          { name: "Filter", path: "/app/dashboard/reports", pro: false, icon: SearchIcon  },
        ],
      },

    ],
  },
  {
    title: "Administrative Tools",
    items: [
      {
        icon: SettingsIcon,
        name: "Data Administration",
        subItems: [
          { name: "Titles", path: "/app/dashboard/sys-titles", pro: false, icon: PlugInIcon  },
          { name: "Identities", path: "/app/dashboard/sys-identities", pro: false, icon: PlugInIcon  },
          { name: "Identifications", path: "/app/dashboard/sys-identifications", pro: false, icon: PlugInIcon  },
          { name: "Occupations", path: "/app/dashboard/sys-occupations", pro: false, icon: PlugInIcon  },
          { name: "Source Moneys", path: "/app/dashboard/sys-sourcemoneys", pro: false, icon: PlugInIcon  },
          { name: "Paybacks", path: "/app/dashboard/sys-paybacks", pro: false, icon: PlugInIcon  },
          { name: "Loan Types", path: "/app/dashboard/sys-loantypes", pro: false, icon: PlugInIcon  },
        ],
      },
      {
        icon: UserShildIcon,
        name: "Employees",
        subItems: [
          { name: "Create", path: "/app/dashboard/employees/create", pro: false, icon: PencilIcon  },
          { name: "Search", path: "/app/dashboard/employees", pro: false, icon: SearchIcon  },
        ],
      },
      {
        icon: UserSettingIcon,
        name: "Users & Permissions",
        subItems: [
          { name: "Create", path: "/app/dashboard/user-permissionss/create", pro: false, icon: PencilIcon  },
          { name: "Search", path: "/app/dashboard/user-permissionss", pro: false, icon: SearchIcon  },
        ],
      },
      {
        icon: UserLockIcon,
        name: "Roles & Permission",
        subItems: [
          { name: "Roles", path: "/app/dashboard/roless", pro: false, icon: SearchIcon  },
          { name: "Permissions", path: "/app/dashboard/permissionss", pro: false, icon: SearchIcon  },
        ],
      },
      // ... Add other menu items here
    ],
  },
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>


<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >


    <div v-if="!isMobileOpen" :class="[
      'flex py-6 mt-2', // or pt-3 / pt-4 (small spacing)
      !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
    ]">

      <router-link v-if="!isMobileOpen" to="/">
        <!-- Large logo -->
        <img v-if="isExpanded || isHovered" class="dark:hidden" src="/imgs/logo.svg" alt="Logo" width="150"
          height="40" />
        <img v-if="isExpanded || isHovered" class="hidden dark:block" src="/imgs/logo-dark.svg" alt="Logo" width="150"
          height="40" />

        <!-- Small logo -->
        <img v-if="!isExpanded && !isHovered" class="dark:hidden" src="/imgs/logo32.svg" alt="Logo" width="32"
          height="32" />
        <!-- <img v-if="!isExpanded && !isHovered" class="hidden dark:block" src="/imgs/logo-dark.svg" alt="Logo" width="32"
          height="32" /> -->
      </router-link>

    </div>

    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-blue-900',
                !isExpanded && !isHovered
                  ? 'lg:justify-center pt-6'
                  : 'justify-start pt-4',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen"">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-0 ml-5">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >

                          <!-- ✅ ICON -->
                          <span class="flex items-center justify-center w-5 h-5">
                            <component :is="subItem.icon" />
                          </span>
                          
                          <!-- TEXT -->
                          {{ subItem.name }}
                          <span class="flex items-center ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" /> -->
    </div>
  </aside>
</template>

