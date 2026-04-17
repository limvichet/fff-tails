<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Payments", subTitle: "Search" },
  ssr: false
})

useHead({
  title: "Search payments",
})

// Components
import ComponentCard from "@/components/common/ComponentCard.vue"

// Vue
import { ref, computed, onMounted, watch } from "vue"
import { useMessage } from "~/composables/useMessage"
import { formatDateForOutput } from "~/utils/date"

// =====================
// Types
// =====================
type Schedule = {
  id: number
  loan_id: number
  loan_startdate: string
  loan_enddate: string
  currency_en: string
  loan_totalcash: string
  loan_peroid: string
  loantype_short: string
  loan_check_status: number
  cust_name_1: string
  cust_name_2?: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string

  schedule_principle_payment_tt: string
  schedule_principle_tt: string
  schedule_totalpay_tt: string
  schedule_totalcashin_tt: string
  schedule_lessmoney_tt: string
}

type PaymentResponses = {
  current_page: number
  data: Schedule[]
  per_page: number
  total: number
  last_page: number
}

type ApiResponse = {
  success: boolean
  data: PaymentResponses
}

// =====================
// State
// =====================
const schedules = ref<Schedule[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const perPage = 10
const total = ref(0)
const lastPageValue = ref(1)

const { errorMsg, successMsg } = useMessage()

// =====================
// Fetch
// =====================
const fetchPayments = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/payments", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
      },
    })

    schedules.value = res.data.data || []
    total.value = res.data.total || 0
    lastPageValue.value = res.data.last_page || 1

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch payments"
    schedules.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchPayments)

// =====================
// Computed
// =====================
const paginated = computed(() => schedules.value)

// =====================
// Search debounce
// =====================
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchPayments()
  }, 400)
})

// =====================
// Pagination
// =====================
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchPayments()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchPayments()
  }
}
</script>

<template>
  <div class="grid grid-cols-1">

    <ComponentCard title="Payments">

      <!-- Search -->
      <div class="relative mb-3">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search payments..."
          class="input"
        />
      </div>

      <!-- Messages -->
      <div v-if="errorMsg" class="mb-3 p-2 bg-red-500/20 text-red-400 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-gray-400">
        Loading...
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto border rounded-xl">
        <table class="min-w-full text-sm">
          <thead class="border-b">
            <tr>
              <th class="px-2 py-2 text-left">#</th>
              <th class="px-2 py-2 text-left">Loan</th>
              <th class="px-2 py-2 text-left">Customer</th>
              <th class="px-2 py-2 text-left">Period</th>
              <th class="px-2 py-2 text-left">Total Loan</th>
              <th class="px-2 py-2 text-left">Paid</th>
              <th class="px-2 py-2 text-left">Remaining</th>
              <th class="px-2 py-2 text-left">Create/Update</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(p, i) in paginated"
              :key="p.id"
              class="border-b hover:bg-blue-100/20"
            >
              <td class="px-2 py-1">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="px-2 py-1">
                {{ p.loan_id }}({{ p.loantype_short }})
              </td>

              <td class="px-2 py-1">
                {{ p.cust_name_1 }}
                <span v-if="p.cust_name_2"></span>
              </td>

              <td class="px-2 py-1">
                {{ p.loan_peroid }}
              </td>

              <td class="px-2 py-1">
                {{ p.loan_totalcash }} {{ p.currency_en }}
              </td>

              <td class="px-2 py-1 text-green-600">
                {{ p.schedule_totalcashin_tt }}
              </td>

              <td class="px-2 py-1 text-red-500">
                {{ p.schedule_lessmoney_tt }}
              </td>

              <td class="px-2 py-1 text-gray-400">
                <div>{{ formatDateForOutput(new Date(p.loan_startdate)) }}</div>
                <div>{{ formatDateForOutput(new Date(p.loan_enddate)) }}</div>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="8" class="text-center py-6 text-gray-400">
                No payments found
              </td>
            </tr>
          </tbody>
        </table>
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
            Page {{ page }} / {{ lastPageValue }} |
            Total Records: <b>{{ total }}</b>
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