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
import { formatNumber } from "~/utils/number"
import { PER_PAGE } from '~/constants/pagination';


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
  loan_interest_rate: number
  loan_peroid: string
  loantype_short: string
  loan_check_status: number
  cust_name_1: string
  cust_name_2?: string
  loan_tag?: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string

  latest_schedule_paid_date: string
  latest_schedule_outstanding: number
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
const perPage = PER_PAGE
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

const router = useRouter()
const showPayment = (id: number) => {
  // router.push(`/app/dashboard/payments/${id}`)
  // Construct your URL here
  const url = `/app/dashboard/payments/${id}`; 
  
  // 'url' is the page to open, '_blank' forces a new tab
  window.open(url, '_blank');
}

// =====================
// Loan status helper
// =====================
const getPaymentStatus = (p: Schedule) => {
  const loantype_id = Number(p.loan_id) // or p.loanrecord.loantype_id if nested
  const loan_totalcash = Number(p.loan_totalcash)
  const latest_schedule_paid_date = Number(p.latest_schedule_paid_date)
  const latest_schedule_outstanding = Number(p.latest_schedule_outstanding)
  const schedule_principle_payment_tt = Number(p.schedule_principle_payment_tt)
  const schedule_principle_tt = Number(p.schedule_principle_tt)
  const schedule_totalpay_tt = Number(p.schedule_totalpay_tt)
  const schedule_totalcashin_tt = Number(p.schedule_totalcashin_tt)
  const schedule_lessmoney_tt = Number(p.schedule_lessmoney_tt)

  const cash_less_tt =
    schedule_totalcashin_tt +
    (schedule_lessmoney_tt < 0 ? Math.abs(schedule_lessmoney_tt) : 0)

  let status: number | null = null

  if (schedule_principle_payment_tt > 0) {
    if (loantype_id === 14 || loantype_id === 36) {
      if (
        schedule_principle_tt === schedule_principle_payment_tt &&
        schedule_totalpay_tt === schedule_totalcashin_tt
      ) {
        status = 0
      } else {
        status = 1
      }
    } else {
      if (
        (loan_totalcash === schedule_principle_payment_tt &&
          schedule_totalcashin_tt >= schedule_totalpay_tt) ||
        (schedule_principle_tt === schedule_principle_payment_tt &&
          (cash_less_tt - schedule_totalpay_tt) / schedule_totalpay_tt < 0.00001)
      ) {
        status = 0
      } else {
        status = 1
      }
    }
  } else if (schedule_principle_payment_tt === 0) {
    status = 1
  }

  return status
}

</script>

<template>
  <div class="grid grid-cols-1">

    <ComponentCard title="Payments">

      <!-- Search -->
      <div class="relative">
        <!-- Icon -->
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>

        <!-- Search Input -->
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search records..."
          class="input !pl-9 text-sm"
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
      <div v-else class="overflow-x-auto rounded-xl border mt-3 border-gray-200 dark:border-gray-800">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800 border-b text-left">
            <tr>
              <th class="px-2 py-2">#</th>
              <th class="px-2 py-2">Loan</th>
              <th class="px-2 py-2">Customer</th>
              <th class="px-2 py-2">Total Loan</th>
              <th class="px-2 py-2">Rate</th>
              <th class="px-2 py-2">Outstanding</th>
              <th class="px-2 py-2">LastPaided</th>
              <th class="px-2 py-2">End</th>
              <th class="px-2 py-2">Tag</th>
              <th class="px-2 py-2">DebtReturn</th>
              <th class="px-2 py-2">Status</th>
              <th class="px-2 py-2">Actions</th>
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
                <small>{{ p.currency_en }}</small> {{ formatNumber(p.loan_totalcash) }}
              </td>

              <td class="px-2 py-1">
                {{ formatNumber(p.loan_interest_rate) }}
              </td>

              <td class="px-2 py-1">
                {{ formatNumber(p.latest_schedule_outstanding) }}
              </td>

              <td class="px-2 py-1">
                {{ p.latest_schedule_paid_date ? formatDateForOutput(new Date(p.latest_schedule_paid_date)) : "" }}              
              </td>

              <td class="px-2 py-1">
                {{ formatDateForOutput(new Date(p.loan_enddate)) }}
              </td>

              <td class="px-2 py-1">
                {{ p.loan_tag }}
              </td>

              <td class="px-2 py-1 text-left">
                <span 
                  :class="Number(p.schedule_lessmoney_tt) < 0 
                    ? 'bg-red-600 text-white text-xs font-normal rounded px-2 py-1' 
                    : 'bg-blue-600 text-white text-xs font-normal rounded px-2 py-1'" 
                >
                  {{ formatNumber(Number(p.schedule_lessmoney_tt)) }}
                </span>
              </td>

              <td class="px-2 py-1">
                  <span
                    :class="getPaymentStatus(p) === 1 
                      ? 'bg-blue-600 text-white text-xs font-normal rounded px-2 py-1' 
                      : 'bg-red-600 text-white text-xs font-normal rounded px-2 py-1'"
                  >
                    {{ getPaymentStatus(p) === 1 ? 'Active' : 'Finish' }}
                  </span>
              </td>

              <td class="px-2 py-1">
                <button 
                  @click="showPayment(p.id)"
                  class="bg-blue-500 text-white text-xs font-normal rounded px-2 py-1">
                  show
                </button>
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
          class="btn-pagination disabled:opacity-50"
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
          class="btn-pagination disabled:opacity-50"
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


.btn-pagination {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  background-color: transparent;
  cursor: pointer;
}
.btn-pagination:not(:disabled):hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}
.btn-pagination:disabled {
  cursor: not-allowed;
}
</style>