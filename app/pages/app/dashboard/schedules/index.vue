<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Schedules", subTitle: "Search" },
  ssr: false
})

useHead({
  title: "Search schedules",
  meta: [{ name: "loanrecords", content: "search schedules" }],
})

import ComponentCard from "@/components/common/ComponentCard.vue"
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"
import { useChequeSchedule } from "~/composables/useChequeSchedule"


const {
  showModal,
  form,
  openModal,
  closeModal,
  calculateTotals,
  banks,
  submitForm,
} = useChequeSchedule()

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
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
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






watch(() => form.chequeschedule_bank_id, (val) => {
  //console.log("Selected bank:", val)
})

if (banks.value.length > 0) {
  form.chequeschedule_bank_id = banks.value[0]!.id
}



</script>

<template>
  <div class="grid grid-cols-1">
    <ComponentCard title="Schedules">

      <!-- Search -->
      <div class="relative">
        <!-- Icon -->
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
          stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
        </svg>

        <!-- Search Input -->
        <input v-model="searchInput" type="text" placeholder="Search records..." class="input text-sm !pl-9" />
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
      <div v-else
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead class="border-b">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-2 py-3 text-left text-sm">#</th>
                <th class="px-2 py-3 text-left text-sm">LID</th>
                <th class="px-2 py-3 text-left text-sm">Customer</th>
                <th class="px-2 py-3 text-left text-sm">Start</th>
                <th class="px-2 py-3 text-left text-sm">End</th>
                <th class="px-2 py-3 text-left text-sm">Curr</th>
                <th class="px-2 py-3 text-left text-sm">Total</th>
                <th class="px-2 py-3 text-left text-sm">Created</th>
                <th class="px-2 py-3 text-left text-sm">Updated</th>
                <th class="px-2 py-3 text-left text-sm">Status</th>
                <th class="px-2 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(s, i) in paginated" :key="s.id" class="hover:bg-blue-300/20 transition">
                <td class="px-2 py-1 text-sm">
                  {{ (page - 1) * perPage + i + 1 }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ s.loan_id }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ s.cust_name_1 }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ formatDateForOutput(new Date(s.loan_startdate)) }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ formatDateForOutput(new Date(s.loan_enddate)) }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ s.currency_en }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ s.loan_totalcash }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{s.created_by}} - {{ formatDateForOutput(new Date(s.created_at)) }}
                </td>

                <td class="px-2 py-1 text-sm">
                  {{s.updated_by}} - {{ formatDateForOutput(new Date(s.updated_at)) }}
                </td>

                <!-- status -->
                <td class="px-2 py-1 text-left">
                  <span :class="[
                    'px-2 py-1 rounded text-xs',
                    s.loan_check_status == 1
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-yellow-500/20 text-yellow-600'
                  ]">
                    {{ s.loan_check_status == 1 ? 'Approved' : 'Pending' }}
                  </span>
                </td>

                <!-- actions -->
                <td class="px-2 py-1 text-left">
                  <button class="px-2 py-1 bg-blue-600 text-white rounded text-xs mr-1"
                  @click="openModal(
                    `/api/admin-secure/schedules-cheque-data/${s.id}`,
                    `/api/admin-secure/schedules-cheque-edit/${s.id}`
                  )">
                    Cheque
                  </button>
                  <button @click="viewSchedule(s.loan_id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">
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
        <button @click="prevPage" :disabled="page === 1"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
          Prev
        </button>

        <span class="text-sm">
          Page {{ page }} / {{ lastPageValue }}
          Total Records: <b>{{ total }}</b>
        </span>

        <button @click="nextPage" :disabled="page === lastPageValue"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
          Next
        </button>
      </div>

    </ComponentCard>


    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div class="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-lg text-blue-800 dark:text-white">Cheque Schedule</h2>
          <button 
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600" 
            @click="closeModal"
          >
            <span class="text-xl">✕</span>
          </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-8">
          
          <section>
            <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Information</h3>
            <div class="grid grid-cols-5 gap-1 bg-slate-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Customer</label>
                <input v-model="form.chequeschedule_cust_name_1" readonly
                  class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Loan</label>
                <input v-model="form.chequeschedule_loan_id" readonly 
                  class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Period</label>
                <input v-model="form.chequeschedule_loan_peroid" readonly
                  class="min-w-full bg-transparent border-none text-[14px] text-slate-700 dark:text-gray-200 focus:ring-0 p-0" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-500 mb-1">Banks</label>
                <select v-model="form.chequeschedule_bank_id" 
                  class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option :value="-1" disabled>Choose bank...</option>
                  <option v-for="dd in banks" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Cheques</h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
              <table class="min-w-[300px] w-full custom-scrollbar text-sm">
                <thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th class="px-2 py-3 font-semibold">#</th>
                    <th class="px-2 py-3 font-semibold text-left">Cheque#</th>
                    <th class="px-2 py-3 font-semibold text-left">From</th>
                    <th class="px-2 py-3 font-semibold text-left">To</th>
                    <th class="px-2 py-3 font-semibold text-left">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="(c, i) in (form.cheques || [])" :key="i" :class="c.locked ? 'read-only:bg-slate-50 read-only:text-slate-500 read-only:cursor-not-allowed' : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors'">
                    <td class="px-2 py-2 font-medium text-slate-400">{{ c.cheque_order }}</td>
                    <td class="px-2 py-2">
                      <input v-model="c.cheque_number" type="number" 
                        class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                    </td>
                    <td class="px-2 py-2">
                      <input v-model.number="c.from" type="number" @keyup.enter="calculateTotals" @blur="calculateTotals"
                        class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </td>
                    <td class="px-2 py-2">
                      <input v-model.number="c.to" type="number" @keyup.enter="calculateTotals" @blur="calculateTotals"
                        class="w-full text-left border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </td>
                    <td class="px-2 py-2"> {{ (c.total) }}
                      <!-- <input v-model="c.total" readonly 
                        class="w-full text-left text-blue-600 dark:text-blue-400 bg-transparent border-none outline-none cursor-default" /> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-gray-800/50 flex items-center justify-end gap-1 border-t border-gray-100 dark:border-gray-800">
          <button @click="closeModal"
            class="px-5 py-2 bg-slate-400 hover:bg-slate-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
            Cancel
          </button>
          <button @click="submitForm"
            class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
            Save Cheque
          </button>
        </div>

      </div>
    </div>


  </div>
</template>




<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}

/* .input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
} */

.text-red-500 {
  color: #f56565;
}

.text-sm {
  font-size: 12px;
}
</style>