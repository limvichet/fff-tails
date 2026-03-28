<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Schedules", subTitle: "Search" },
  ssr: false
})

import ComponentCard from "@/components/common/ComponentCard.vue"
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"

const router = useRouter()
const { errorMsg, successMsg } = useMessage()

// --------------------
// Types (match your API)
// --------------------
type Schedule = {
  id: number
  loan_id: number
  loan_startdate: string
  loan_enddate: string
  currency_en: string
  loan_totalcash: string
  loan_peroid: string
  loan_check_status: number
  cust_name_1: string
  cust_name_2: string
}

type ScheduleResponses = {
  current_page: number
  data: Schedule[]
  per_page: number
  total: number
  last_page: number
}

type ApiResponse = {
  success: boolean
  data: ScheduleResponses
}

// --------------------
// State
// --------------------
const schedules = ref<Schedule[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const perPage = 10
const total = ref(0)
const lastPageValue = ref(1)

// --------------------
// Fetch
// --------------------
const fetchSchedules = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/schedules", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
      },
    })

    schedules.value = res.data.data ?? []
    total.value = res.data.total ?? 0
    lastPageValue.value = res.data.last_page ?? 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch schedules"
    schedules.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchSchedules)

// --------------------
// Computed
// --------------------
const paginated = computed(() => schedules.value)

// --------------------
// Search (debounce)
// --------------------
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchSchedules()
  }, 400)
})

// --------------------
// Pagination
// --------------------
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchSchedules()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchSchedules()
  }
}

// --------------------
// View / Actions
// --------------------
const viewSchedule = (loanId: number) => {
  router.push(`/app/dashboard/schedules/${loanId}`)
}
</script>

<template>
  <div class="grid grid-cols-1">
    <ComponentCard title="Schedules">

      <!-- Search -->
      <div class="relative mb-3">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search schedules..."
          class="input"
        />
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-3 p-2 bg-red-500/20 text-red-400 text-sm rounded">
        {{ errorMsg }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-gray-400">
        Loading...
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden rounded-xl border">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="border-b">
              <tr>
                <th class="px-2 py-2 text-left">#</th>
                <th class="px-2 py-2 text-left">Loan ID</th>
                <th class="px-2 py-2 text-left">Customer</th>
                <th class="px-2 py-2 text-left">Start</th>
                <th class="px-2 py-2 text-left">End</th>
                <th class="px-2 py-2 text-left">Currency</th>
                <th class="px-2 py-2 text-left">Total</th>
                <th class="px-2 py-2 text-center">Status</th>
                <th class="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(s, i) in paginated"
                :key="s.id"
                class="border-b hover:bg-gray-100/10"
              >
                <td class="px-2 py-1">
                  {{ (page - 1) * perPage + i + 1 }}
                </td>

                <td class="px-2 py-1">
                  {{ s.loan_id }}
                </td>

                <td class="px-2 py-1">
                  {{ s.cust_name_1 }}
                </td>

                <td class="px-2 py-1">
                  {{ s.loan_startdate }}
                </td>

                <td class="px-2 py-1">
                  {{ s.loan_enddate }}
                </td>

                <td class="px-2 py-1">
                  {{ s.currency_en }}
                </td>

                <td class="px-2 py-1">
                  {{ s.loan_totalcash }}
                </td>

                <!-- status -->
                <td class="px-2 py-1 text-center">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      s.loan_check_status == 1
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-yellow-500/20 text-yellow-600'
                    ]"
                  >
                    {{ s.loan_check_status == 1 ? 'Approved' : 'Pending' }}
                  </span>
                </td>

                <!-- actions -->
                <td class="px-2 py-1 text-center">
                  <button
                    @click="viewSchedule(s.loan_id)"
                    class="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>

              <tr v-if="paginated.length === 0">
                <td colspan="9" class="text-center py-6 text-gray-400">
                  No schedules found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-sm">
          Page {{ page }} / {{ lastPageValue }}
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPageValue"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </ComponentCard>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
}
</style>