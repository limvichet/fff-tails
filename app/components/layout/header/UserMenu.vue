<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-blue-800 dark:text-blue-500"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11 shadow-lg">
        <img 
          :src=user?.photo_url
          alt="User"
          class="object-cover h-full w-full"
        />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ user?.name }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-blue-800 text-theme-sm dark:text-blue-700">
          {{ user?.name }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-blue-500 dark:text-blue-400">
          {{ user?.email }}
        </span>
      </div>

<ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
  <li v-for="item in menuItems" :key="item.text">
    <router-link
      v-if="item.href"
      :to="item.href"
      class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
      @click="closeDropdown"
    >
      <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700" />
      {{ item.text }}
    </router-link>

    <button
      v-else
      @click="handleMenuClick(item)"
      class="flex w-full items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
    >
      <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700" />
      {{ item.text }}
    </button>
  </li>
</ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>

    <ModalChangePassword 
      :isOpen="isPasswordModalOpen" 
      @close="isPasswordModalOpen = false" 
    />

    <ModalUserInformation
      :is-open="isUserInformationOpen"
      @close="isUserInformationOpen = false"
    />
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import ModalChangePassword from './ModalChangePassword.vue';
import ModalUserInformation from './ModalUserInformation.vue';
import { useAuth } from '@/composables/useAuth';

const { user, logout } = useAuth();
const route = useRoute();
const loggingOut = async () => {
  await logout()
  closeDropdown()
  await navigateTo('/app/signin') // or '/signin'
}

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const menuItems = [
  { icon: UserCircleIcon, text: 'Account Information' },
  { icon: SettingsIcon, text: 'Change Password', action: 'modal' },
  { icon: InfoCircleIcon, text: 'Support' },
  // { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  // Implement sign out logic here
  // console.log('Signing out...')
  loggingOut();
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})


// Add a ref to control the modal
const isPasswordModalOpen = ref(false)
const isUserInformationOpen = ref(false)

const handleMenuClick = (item: any) => {
  if (item.action === 'modal') {
    isPasswordModalOpen.value = true
    closeDropdown()
  } else if (item.text === 'Account Information') {
    isUserInformationOpen.value = true
    closeDropdown()
  }
}
</script>
