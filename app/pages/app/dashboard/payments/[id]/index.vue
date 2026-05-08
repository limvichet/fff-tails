<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Payments", subTitle: "Detail" },
  ssr: false
})

useHead({
  title: "Payment Detail",
})

import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import ComponentCard from "@/components/common/ComponentCard.vue"
import { useMessage } from "~/composables/useMessage"
import { formatDateForOutput } from '~/utils/date'
import { formatNumber } from "@/utils/number"
import { PencilIcon, TrashIcon} from "@/icons";

const {
  paymentCashinItems,
  paymentCashinForm,
  paymentCashinShowModal,
  paymentCashinIsEditMode,
  paymentCashinFetchItems,
  paymentCashinOpenModal,
  paymentCashinCloseModal,
  paymentCashinEditItem,
  paymentCashinDeleteItem,
  paymentCashinSubmitForm,
  scheduleItem,
  errors,
  showSaveButton,
  paymentCashinLoading
} = usePaymentCashin()

const handleClose = async () => {
  paymentCashinCloseModal()
  await fetchData()
}


// onMounted(() => {
//   paymentCashinFetchItems()
// })

// --------------------
// Init
// --------------------
const route = useRoute()
const { errorMsg, successMsg } = useMessage()

const loading = ref(false)

// --------------------
// Types
// --------------------
type Loanrecord = {
    id:                           number;
    cust_id:                      number;
    loan_lastcash:                number;
    loan_newcash:                 number;
    loan_totalcash:               number;
    currency_id:                  number;
    source_money:                 string;
    loantype_id:                  number;
    loan_over_draft:              number;
    payback_id:                   number;
    loan_peroid:                  number;
    loan_startdate:               string;
    loan_first_paid_date:         string;
    loan_enddate:                 string;
    loan_startdate_principle:     string;
    loan_interest_rate:           string;
    loan_principle:               number;
    loan_collateral_1:            string;
    loan_collateral_map_link_1:   string;
    loan_collateral_doc_1:        string;
    loan_collateral_2:            string;
    loan_collateral_map_link_2:   string;
    loan_collateral_doc_2:        string;
    loan_note:                    string;
    cust_comission_id:            number;
    cust_comission_interest_rate: number;
    cust_loangroup_id:            number;
    cust_guarantor_id:            number;
    cust_position_loangroup_id:   number;
    invoice_id:                   number;
    loan_status_id:               number;
    created_by:                   number;
    updated_by:                   number;
    active:                       number;
    created_at:                   string;
    updated_at:                   string;
    loan_check_status:            number;
    loan_check_approver:          number;
    loan_check_date:              string;
}

type Schedule = {
    id:                     number;
    schedule_paymentnumber: number;
    loan_id:                number;
    schedule_startdate:     string;
    schedule_enddate:       string;
    ForMonth:               string;
    schedule_outstanding:   number;
    schedule_principle:     number;
    schedule_interest_rate: number;
    schedule_interest:      number;
    schedule_totalpay:      number;
    schedule_totalcashin:   number;
    schedule_paidcash:      number;
    schedule_balance:       number;
    schedule_lessmoney:     number;
    schedule_remaincash:    number;
    schedule_totalpreless:  number;
    invoice_id:             number;
    schedule_note:          string;
}

type Customer = {
  id: number
  cust_name_1: string
  cust_name_2: string
}

// --------------------
// State
// --------------------
const loan = ref<Loanrecord | null>(null)
const schedules = ref<Schedule[]>([])
const customer = ref<Customer | null>(null)

// --------------------
// Pagination
// --------------------
import { usePagination } from "@/composables/usePagination"

const {
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  getIndex,
  totalRecords,
  paginatedData
} = usePagination(schedules, 10)

// --------------------
// Fetch Data
// --------------------
const fetchData = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<any>(
      `/api/admin-secure/payments/${route.params.id}`
    )

    loan.value = res.loanrecord
    schedules.value = res.schedules ?? []
    customer.value = res.customer

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch payments"
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// --------------------
// Helpers
// --------------------
const getStatus = (s: Schedule) => {
  if (s.schedule_paidcash >= s.schedule_totalpay) return "Paid"
  if (s.schedule_paidcash > 0) return "Partial"
  return "Unpaid"
}

const getStatusClass = (s: Schedule) => {
  if (s.schedule_paidcash >= s.schedule_totalpay) {
    return "bg-green-100 text-green-700"
  }
  if (s.schedule_paidcash > 0) {
    return "bg-yellow-100 text-yellow-700"
  }
  return "bg-red-100 text-red-600"
}


  function onInputPaymentCashin<K extends keyof typeof paymentCashinForm>(event: Event, field: K) {
    const target = event.target as HTMLInputElement
    if (!target) return

    // Remove commas and parse number
    const numericValue = parseFloat(target.value.replace(/,/g, '')) || 0

    // Update only the target field
    paymentCashinForm[field] = numericValue as any
  }

</script>

<template>

  <!-- ================= MESSAGES ================= -->
  <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
    {{ errorMsg }}
  </div>

  <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
    {{ successMsg }}
  </div>

  <template v-if="loan">

    <!-- ================= LOAN INFO ================= -->
    <ComponentCard title="1. Loan Information">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <div>
          <label class="label">Loan</label>
          <input class="input" :value="loan.id" readonly />
        </div>

        <div>
          <label class="label">Customer</label>
          <input class="input" :value="customer?.cust_name_1" readonly />
        </div>

        <div>
          <label class="label">Spouse/Partner</label>
          <input class="input" :value="customer?.cust_name_2" readonly />
        </div>

      </div>
    </ComponentCard>

    <!-- ================= PAYMENT TABLE ================= -->
    <ComponentCard title="2. Payment Schedule" class="mt-3">

      <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">

        <table class="min-w-full text-sm text-left">

          <!-- HEADER -->
          <thead class="bg-gray-100 dark:bg-gray-800 border-b text-left">
            <tr>
              <th class="px-3 py-3">#</th>
              <th class="px-3 py-3">Start</th>
              <th class="px-3 py-3">End</th>
              <th class="px-3 py-3">Month</th>
              <th class="px-3 py-3">Outstanding</th>
              <th class="px-3 py-3">Principle</th>
              <th class="px-3 py-3">Rate</th>
              <th class="px-3 py-3">Interest</th>
              <th class="px-3 py-3">Total</th>
              <th class="px-3 py-3">Cashin</th>
              <th class="px-3 py-3">Paid</th>
              <th class="px-3 py-3">Balance</th>
              <th class="px-3 py-3">Remain</th>
              <th class="px-3 py-3">Preless</th>
              <th class="px-3 py-3">Lessmoney</th>
              <th class="px-3 py-3">Invoice</th>
              <th class="px-3 py-3">Note</th>
              <th class="px-3 py-3">Status</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody class="divide-y">

            <tr v-for="(s, i) in paginatedData" :key="s.id"
                class="hover:bg-blue-50 dark:hover:bg-white/5">

              <td class="px-3 py-2">
                {{ getIndex(i) }}
              </td>

              <td class="px-3 py-2">
                {{ formatDateForOutput(new Date(s.schedule_startdate)) }}
              </td>

              <td class="px-3 py-2">
                {{ formatDateForOutput(new Date(s.schedule_enddate)) }}
              </td>

              <td class="px-3 py-2">
                {{ s.ForMonth }}
              </td>

              <td class="px-3 py-2 text-blue-600">
                {{ formatNumber(s.schedule_outstanding) }}
              </td>

              <td class="px-3 py-2 text-blue-600">
                {{ formatNumber(s.schedule_principle) }}
              </td>

              <td class="px-3 py-2 text-blue-600">
                {{ formatNumber(s.schedule_interest_rate) }}
              </td>

              <td class="px-3 py-2 text-blue-600">
                {{ formatNumber(s.schedule_interest) }}
              </td>

              <td class="px-3 py-2 text-blue-600">
                {{ formatNumber(s.schedule_totalpay) }}
              </td>

              <!-- Cashin -->
              <td class="px-3 py-2">
                <button 
                  @click="paymentCashinOpenModal(s.id)"
                  type="button" class="text-xs rounded px-2 py-1 w-20" :class="[
                  // Color logic
                  s.schedule_totalpay > 0
                    ? (Number(s.schedule_totalpay) === Number(s.schedule_paidcash)
                      ? 'bg-red-400 text-white'
                      : 'bg-green-600 text-white')
                    : '',

                  // Disabled styling logic
                  (loan?.loantype_id === 14 || loan?.loantype_id === 36)
                    ? ''
                    : (i > 0 &&
                      (Number(schedules[i - 1]?.schedule_paidcash) === 0 ||
                        Number(s.schedule_outstanding) === 0))
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                ]" 
                :disabled="!(loan?.loantype_id === 14 || loan?.loantype_id === 36) && i > 0 && (Number(schedules[i - 1]?.schedule_paidcash) === 0 || Number(s.schedule_outstanding) === 0)">
                  {{ formatNumber(s.schedule_totalcashin) }}
                </button>
              </td>

              <td class="px-3 py-2 text-green-600">
                {{ formatNumber(s.schedule_paidcash) }}
              </td>

              <td class="px-3 py-2 text-yellow-600">
                {{ formatNumber(s.schedule_balance) }}
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ formatNumber(s.schedule_remaincash) }}
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ formatNumber(s.schedule_totalpreless) }}
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ formatNumber(s.schedule_lessmoney) }}
              </td>

              <td class="px-3 py-2 text-red-500">
              </td>

              <td class="px-3 py-2 text-red-500">
              </td>

              <!-- STATUS -->
              <td class="px-3 py-2">
                <span
                  :class="['px-2 py-1 rounded text-xs', getStatusClass(s)]">
                  {{ getStatus(s) }}
                </span>
              </td>

            </tr>

            <!-- EMPTY -->
            <tr v-if="schedules.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-400">
                No payments found.
              </td>
            </tr>

          </tbody>
        </table>

      </div>

      <!-- ================= PAGINATION ================= -->
      <div v-if="schedules.length > 0" class="flex justify-between items-center mt-4">

        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1"
                  class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
            Prev
          </button>

          <span class="text-sm">
            Page {{ currentPage }} / {{ totalPages }} | Total: {{ totalRecords }}
          </span>

          <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>

      </div>

    </ComponentCard>


    <!-- PAYMENT CASHIN MODAL -->
    <div v-if="paymentCashinShowModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg text-blue-800 dark:text-white">
            Cashin for <span class="text-sm">Schedule#{{ paymentCashinForm.schedule_id }} | Loan#{{ scheduleItem?.loan_id }} | Payment#{{ scheduleItem?.schedule_paymentnumber }}</span>
          </h2>
          <button @click="handleClose" :disabled="paymentCashinLoading">✕</button>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-4 overflow-y-auto">

          <!-- Schedule -->
          <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Information</h3>
          <div class="grid grid-cols-3 gap-3 bg-slate dark:bg-gray-800/50 p-4 rounded-lg">
            <!-- <div class="hidden">
              <label class="text-sm text-gray-500">Schedule ID</label>
              <input v-model="paymentCashinForm.schedule_id" type="number" class="w-full border rounded px-3 py-2" />
            </div> -->
            <!-- Cash -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Cash<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ errors.cash }}</span>
              </div>
              <input 
                :value="(paymentCashinForm.cash ?? 0).toLocaleString()" 
                @input="(e) => onInputPaymentCashin(e, 'cash')"
                type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Recipient -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Recipient<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ errors.recipient }}</span>
              </div>
              <input v-model="paymentCashinForm.recipient" type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Note -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Note<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ errors.note }}</span>
              </div>
              <input v-model="paymentCashinForm.note" type="text" class="w-full text-sm border rounded px-2 py-1"></input>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Cashins</h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
              <table class="min-w-[300px] w-full custom-scrollbar text-sm">
                <thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr class="text-left">
                    <th class="px-2 py-3 font-semibold">#</th>
                    <th class="px-2 py-3 font-semibold text-left">Cash</th>
                    <th class="px-2 py-3 font-semibold text-left">Recipient</th>
                    <th class="px-2 py-3 font-semibold text-left">Employee</th>
                    <th class="px-2 py-3 font-semibold text-left">Date</th>
                    <th class="px-2 py-3 font-semibold text-left">Note</th>
                    <th class="px-2 py-3 font-semibold text-left">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 ">
                  <tr v-for="item in paymentCashinItems" :key="item.id" class="read-only:bg-slate-50 read-only:text-slate-500 read-only:cursor-not-allowed hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.cashin_number }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatNumber(item.cash) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.recipient }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.createdby.employee.full_name }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatDateForOutput(new Date(item.created_at)) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.note }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 space-x-2">
                      <button @click="paymentCashinEditItem(item)"
                        class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
              
                      <button @click="paymentCashinDeleteItem(Number(item.id))"
                        class="inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-400 hover:bg-red-600 text-white text-sm">
                        <component :is="TrashIcon" class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

        <!-- FOOTER -->
        <div v-if="showSaveButton" class="px-6 py-4 flex justify-end gap-2 border-t">
          <button @click="handleClose" class="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>

          <button @click="paymentCashinSubmitForm" 
            :disabled="paymentCashinLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <Icon v-if="paymentCashinLoading" name="svg-spinners:180-ring-with-bg" class="text-lg" />
              <span v-if="paymentCashinLoading">Saving...</span>
              <span v-else>{{ paymentCashinIsEditMode ? "Update" : "Save" }}</span>
          </button>
        </div>

      </div>
    </div>

  </template>

</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
}
</style>