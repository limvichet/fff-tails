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
  next_outstanding_date: string
  latest_schedule_outstanding: number
  payment_status: number
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
const paymentStatus = ref('')


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
    const res = await $fetch<ApiResponse>("/admin-secure/payments", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
        payment_status: paymentStatus.value === ''
          ? undefined
          : paymentStatus.value,
            // New sorting parameters
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
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

watch(paymentStatus, () => {
  page.value = 1
  fetchPayments()
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


  // Sorting
  const sortBy = ref('loan_id')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  const toggleSort = (column: string) => {
    if (sortBy.value === column) {
      // Click the same column to switch direction
      sortDirection.value =
        sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // A new column starts with ascending order
      sortBy.value = column
      sortDirection.value = 'asc'
    }

    page.value = 1
    fetchPayments()
  }

  // const sortIcon = (column: string) => {
  //   if (sortBy.value !== column) return '↕'
  //   return sortDirection.value === 'asc' ? '↑' : '↓'
  // }

  const sortIcon = (column: string) => {
    // if (sortBy.value !== column) return '⇅'
    if (sortBy.value !== column) return ''
    return sortDirection.value === 'asc' ? '▲' : '▼'
  }
</script>

<template>
  <div class="grid grid-cols-1">

    <ComponentCard title="Payments">

      <div class="flex items-end gap-4">
        <!-- Search -->
        <div class="relative w-7/10">
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

        <!-- Payment Status -->
        <div class="w-3/10">

          <select v-model="paymentStatus" class="input">
            <option value="">
              All Status
            </option>

            <option value="0">
              Finished
            </option>

            <option value="1">
              Active
            </option>
          </select>
        </div>

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
              <th class="px-1 py-2">#</th>

              <th class="px-1 py-2">
                <button @click="toggleSort('loan_id')" class="sort-header"   :class="{ 'sort-active': sortBy === 'loan_id' }">
                  Loan <span>{{ sortIcon('loan_id') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('customer')" class="sort-header"  :class="{ 'sort-active': sortBy === 'customer' }">
                  Customer <span>{{ sortIcon('customer') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('loan_totalcash')" class="sort-header" :class="{ 'sort-active': sortBy === 'loan_totalcash' }">
                  Total Loan <span>{{ sortIcon('loan_totalcash') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('loan_interest_rate')" class="sort-header" :class="{ 'sort-active': sortBy === 'loan_interest_rate' }">
                  Rate <span>{{ sortIcon('loan_interest_rate') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('outstanding')" class="sort-header" :class="{ 'sort-active': sortBy === 'outstanding' }">
                  Outstanding <span>{{ sortIcon('outstanding') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('last_paid')" class="sort-header" :class="{ 'sort-active': sortBy === 'last_paid' }">
                  LastPaided <span>{{ sortIcon('last_paid') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('next_outstanding')" class="sort-header" :class="{ 'sort-active': sortBy === 'next_outstanding' }">
                  NextPay <span>{{ sortIcon('next_outstanding') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('loan_enddate')" class="sort-header" :class="{ 'sort-active': sortBy === 'loan_enddate' }">
                  End <span>{{ sortIcon('loan_enddate') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('loan_tag')" class="sort-header" :class="{ 'sort-active': sortBy === 'loan_tag' }">
                  Tag <span>{{ sortIcon('loan_tag') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('debt_return')" class="sort-header" :class="{ 'sort-active': sortBy === 'debt_return' }">
                  DebtReturn <span>{{ sortIcon('debt_return') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">
                <button @click="toggleSort('payment_status')" class="sort-header" :class="{ 'sort-active': sortBy === 'payment_status' }">
                  Status <span>{{ sortIcon('payment_status') }}</span>
                </button>
              </th>

              <th class="px-1 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(p, i) in paginated"
              :key="p.id"
              class="border-b hover:bg-blue-100/20"
            >
              <td class="px-1 py-2">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="px-1 py-2">
                {{ p.loan_id }}({{ p.loantype_short }})
              </td>

              <td class="px-1 py-2">
                {{ p.cust_name_1 }}
                <span v-if="p.cust_name_2"></span>
              </td>


              <td class="px-1 py-2">
                <small>{{ p.currency_en }}</small> {{ formatNumber(p.loan_totalcash) }}
              </td>

              <td class="px-1 py-2">
                {{ formatNumber(p.loan_interest_rate) }}
              </td>

              <td class="px-1 py-2">
                {{ formatNumber(p.latest_schedule_outstanding) }}
              </td>
              
              <td class="px-1 py-2">
                {{ p.latest_schedule_paid_date ? formatDateForOutput(new Date(p.latest_schedule_paid_date)) : "" }}              
              </td>

              <td class="px-1 py-2">
                {{ p.next_outstanding_date ? formatDateForOutput(new Date(p.next_outstanding_date)) : "" }}              
              </td>

              <td class="px-1 py-2">
                {{ formatDateForOutput(new Date(p.loan_enddate)) }}
              </td>

              <td class="px-1 py-2">
                {{ p.loan_tag }}
              </td>

              <td class="px-1 py-2 text-left">
                <span 
                  :class="Number(p.schedule_lessmoney_tt) < 0 
                    ? 'bg-red-600 text-white text-xs font-normal rounded px-2 py-1' 
                    : 'bg-blue-600 text-white text-xs font-normal rounded px-2 py-1'" 
                >
                  {{ formatNumber(Number(p.schedule_lessmoney_tt)) }}
                </span>
              </td>

              <td class="px-1 py-2 text-left">
                  <span
                    :class="getPaymentStatus(p) === 1 
                      ? 'bg-blue-600 text-white text-xs font-normal rounded px-2 py-1' 
                      : 'bg-red-600 text-white text-xs font-normal rounded px-2 py-1'"
                  >
                    {{ getPaymentStatus(p) === 1 ? 'Active' : 'Finish' }}
                  </span>
              </td>

              <td class="px-1 py-2">
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
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  transition: border-color 0.2s ease;
}

button {
  width: 100%;
  border-bottom: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  transition: border-color 0.2s ease;
}
button > span {
  margin-left: 4px;
  font-size: 10px;
  font-size: 10px;
}

.input:focus {
  outline: none;
  border-color: #1C398E;
}

.btn-pagination {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
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

.sort-header {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: 600;
  cursor: pointer;
}
.sort-header:hover {
  color: #1C398E;
}
.sort-active {
  color: #2563eb;
}

</style>