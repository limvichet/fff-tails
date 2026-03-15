<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'


const dropdownOpen = ref(false)
const notifying = ref(true)
// TypeScript knows this is an HTMLDivElement
const dropdownRef = ref<HTMLDivElement | null>(null)

const notifications = ref<any[]>([])
const unreadCount = ref(0)
let interval: number | undefined

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  notifying.value = false
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  // dropdownRef.value is typed, so contains works
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Dynamic notifications from API
type LoanNotification = {
  id: number
  loan_lastcash: string
  loan_newcash: string
  loan_totalcash: string
  cust_id: number
  loantype_id: number
  loan_status_id: number
  loan_check_status: number
}

type ApiResponse = {
  success: boolean
  data: LoanNotification[],
  unread_count: number
}


// Handle notification item click
const handleItemClick = (event: MouseEvent, notification: LoanNotification) => {
  event.preventDefault()
  // console.log('Loan clicked:', notification.id)
  editLoan(notification.id)
  closeDropdown()
}

// Handle "View All"
const handleViewAllClick = (event: MouseEvent) => {
  event.preventDefault()
  console.log('View All Loans clicked')
  closeDropdown()
}

// Fetch loan notifications from Nuxt proxy API
const loadNotifications = async () => {
  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/loanrecords-need-approval")
    console.log("res ", res)
    notifications.value = Array.isArray(res.data) ? res?.data : []
    unreadCount.value = res.unread_count ? res.unread_count : 0
    notifying.value = unreadCount.value > 0
  } catch (err) {
    console.error("Failed to fetch loan notifications:", err)
  }
}

onMounted(() => {
  // Run polling only in the browser
  if (process.client) {
    loadNotifications()

    // Poll every 5 seconds
    interval = window.setInterval(() => {
      loadNotifications()
    }, 5000)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  document.removeEventListener('click', handleClickOutside)
})

/*  goto edit loan */
const router = useRouter()
const editLoan = (id: number) => {
  router.push(`/app/dashboard/loanrecords/${id}`)
}

</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Notification Bell -->
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700"
      @click="toggleDropdown"
    >
      <!-- Unread dot -->
      <!-- <span
        :class="{ hidden: !notifying, flex: notifying }"
        class="absolute right-0 top-0.5 h-2 w-2 rounded-full bg-orange-400"
      >
        <span class="absolute w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
      </span> -->
      <!-- <span v-if="unreadCount > 0" class="absolute right-0 top-0.5 h-2 w-2 rounded-full bg-orange-400">
        <span class="absolute w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
      </span> -->
            <!-- Unread badge -->
      <span v-if="unreadCount > 0" 
            class="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-400 text-white text-xs">
        {{ unreadCount }}<span class="absolute w-4 h-4 bg-orange-400 rounded-full opacity-75 animate-ping"></span>
      </span>


      <!-- Bell Icon -->
      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
        />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-2 flex h-auto w-[350px] flex-col rounded-2xl border bg-white p-3 shadow-lg overflow-y-auto"
    >
      <h5 class="text-lg font-semibold mb-3">Loan Notifications ({{ unreadCount }})</h5>

      <ul>
        <li
          v-for="loan in notifications"
          :key="loan.id"
          class="p-3 border-b hover:bg-gray-100 cursor-pointer"
          @click="handleItemClick($event, loan)"
        >
          #{{ loan.id }} - Total: {{ loan.loan_totalcash }} 
          <span v-if="loan.loan_check_status === 0" class="text-blue-800 ml-2">(Unread)</span>
        </li>
      </ul>

      <button
        class="mt-3 p-2 border rounded w-full hover:bg-gray-100"
        @click="handleViewAllClick"
      >
        View All Loans
      </button>
    </div>
  </div>
</template>