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
import {onInputNumber} from "~/utils/number"

const { user } = useAuth()


/* Cashin */
const {
  paymentCashinItems,
  paymentCashinForm,
  paymentCashinShowModal,
  paymentCashinIsEditMode,
  paymentCashinOpenModal,
  paymentCashinCloseModal,
  paymentCashinEditItem,
  paymentCashinDeleteItem,
  paymentCashinSubmitForm,
  paymentCashinScheduleItem,
  paymentCashinErrors,
  paymentCashinShowSaveButton,
  paymentCashinLoading
} = usePaymentCashin()

const handleCashinClose = async () => {
  paymentCashinCloseModal()
  await fetchData()
}


/* Preless */
const {
  paymentPrelessItems,
  paymentPrelessForm,
  paymentPrelessShowModal,
  paymentPrelessIsEditMode,
  paymentPrelessOpenModal,
  paymentPrelessCloseModal,
  paymentPrelessEditItem,
  paymentPrelessDeleteItem,
  paymentPrelessSubmitForm,
  paymentPrelessScheduleItem,
  paymentPrelessErrors,
  paymentPrelessShowSaveButton,
  paymentPrelessLoading
} = usePaymentPreless()

const handlePrelessClose = async () => {
  paymentPrelessCloseModal()
  await fetchData()
}


/* Payment */
const {
  paymentItem,
  paymentForm,
  paymentShowModal,
  paymentOpenModal,
  paymentCloseModal,
  paymentSubmitForm,
  paymentSchedule,
  paymentErrors,
  paymentShowSaveButton,
  paymentLoading
} = usePayment()

const handleClose = async () => {
  paymentCloseModal()
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
    invoice:                string;
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
} = usePagination(schedules, 30)

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


function onInputPaymentCashin<K extends keyof typeof paymentCashinForm>(
  event: Event,
  field: K
) {
  const target = event.target as HTMLInputElement
  if (!target) return

  const numericValue = parseFloat(target.value.replace(/,/g, "")) || 0
  paymentCashinForm[field] = numericValue as any
}

function onInputPaymentPreless<K extends keyof typeof paymentPrelessForm>(
  event: Event,
  field: K
) {
  const target = event.target as HTMLInputElement
  if (!target) return

  const numericValue = parseFloat(target.value.replace(/,/g, "")) || 0
  paymentPrelessForm[field] = numericValue as any
}

function onInputPayment<K extends keyof typeof paymentForm>(
  event: Event,
  field: K
) {
  const target = event.target as HTMLInputElement
  if (!target) return

  const numericValue = parseFloat(target.value.replace(/,/g, "")) || 0
  paymentForm[field] = numericValue as any
}


// watchEffect(() => {
//   const rate = Number(String(paymentForm.schedule_interest_rate).replace(/,/g, '') || 0)
//   const outstanding = Number(String(paymentForm.schedule_outstanding).replace(/,/g, '') || 0)
//   const principle = Number(String(paymentForm.schedule_principle).replace(/,/g, '') || 0)
//   const totalcashin = Number(String(paymentForm.schedule_totalcashin).replace(/,/g, '') || 0)
//   const totalpreless = Number(String(paymentForm.schedule_totalpreless).replace(/,/g, '') || 0)
//   paymentForm.schedule_interest = (rate/100) * outstanding
//   paymentForm.schedule_totalpay = ((rate/100) * outstanding) + principle
//   paymentForm.schedule_paidcash = Math.min(totalcashin, (((rate/100) * outstanding) + principle))
//   paymentForm.schedule_remaincash = totalcashin - (Math.min(totalcashin, (((rate/100) * outstanding) + principle)))
//   paymentForm.schedule_lessmoney = totalcashin - totalpreless - (((rate/100) * outstanding) + principle)
// })

const calculatePayment = () => {

  const rate = Number(
    String(paymentForm.schedule_interest_rate).replace(/,/g, '') || 0
  )

  const outstanding = Number(
    String(paymentForm.schedule_outstanding).replace(/,/g, '') || 0
  )

  const principle = Number(
    String(paymentForm.schedule_principle).replace(/,/g, '') || 0
  )

  const totalcashin = Number(
    String(paymentForm.schedule_totalcashin).replace(/,/g, '') || 0
  )

  const totalpreless = Number(
    String(paymentForm.schedule_totalpreless).replace(/,/g, '') || 0
  )

  const cashin3 = Number(
    String(paymentForm.schedule_cashin_3).replace(/,/g, '') || 0
  )
  

  // const interest = (rate / 100) * outstanding
  const interest = calculateScheduleInterest(paymentSchedule.value?.schedule_totaldays ?? 0, rate, outstanding, fixDouble)  
  const totalpay = interest + principle
  const paidcash = Math.min(totalcashin, totalpay)

  paymentForm.schedule_interest = interest
  paymentForm.schedule_totalpay = totalpay
  paymentForm.schedule_paidcash = paidcash
  paymentForm.schedule_remaincash = totalcashin - paidcash
  paymentForm.schedule_lessmoney =
    totalcashin - totalpreless - totalpay
}


function calculateScheduleInterest(
  totalDays: number,
  rate: number,
  outstanding: number,
  fixDouble: (value: number, precision: number) => number
): number {
  if (totalDays >= 28 && totalDays <= 31) {
    return (rate/100) * outstanding
  } else {
    return fixDouble(((rate / 100) / 30) * outstanding * totalDays, 3)
  }
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
    <!-- <ComponentCard title="2. Payment Schedule" class="mt-3"> -->

      <div class="overflow-x-auto rounded-xl border mt-3 border-gray-200 dark:border-gray-800">

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
                <button @click="paymentOpenModal(s.id)" type="button" class="text-xs rounded px-2 py-1 w-auto"
                  :class="[
                    // Color logic
                    s.schedule_totalpay > 0
                      ? (Number(s.schedule_totalpay) === Number(s.schedule_paidcash)
                        ? 'bg-red-800 text-white'
                        : 'bg-blue-800 text-white')
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
                  {{ formatNumber(s.schedule_totalpay) }}
                </button>
              </td>

              <!-- Cashin -->
              <td class="px-3 py-2">
                <button 
                  @click="paymentCashinOpenModal(s.id)"
                  type="button" class="text-xs rounded px-2 py-1 w-auto" :class="[
                  // Color logic
                  s.schedule_totalpay > 0
                    ? (Number(s.schedule_totalpay) === Number(s.schedule_paidcash)
                      ? 'bg-red-700 text-white'
                      : 'bg-green-800 text-white')
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
                <button @click="paymentPrelessOpenModal(s.id)" type="button" class="text-xs rounded px-2 py-1 w-auto"
                  :class="[
                    // Color logic
                    s.schedule_totalpay > 0
                      ? (Number(s.schedule_totalpay) === Number(s.schedule_paidcash)
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-800 text-white')
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
                  {{ formatNumber(s.schedule_totalpreless) }}
                </button>
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ formatNumber(s.schedule_lessmoney) }}
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ s.invoice }}
              </td>

              <td class="px-3 py-2 text-red-500">
                {{ s.schedule_note }}
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

    <!-- </ComponentCard> -->


    <!-- PAYMENT CASHIN MODAL -->
    <div v-if="paymentCashinShowModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div class="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg text-blue-800 dark:text-white">
            Cashin for <span class="text-sm">Schedule#{{ paymentCashinForm.schedule_id }} | Loan#{{ paymentCashinScheduleItem?.loan_id }} | Payment#{{ paymentCashinScheduleItem?.schedule_paymentnumber }}</span>
          </h2>
          <button @click="handleCashinClose" :disabled="paymentCashinLoading">✕</button>
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
                <span class="text-red-500 text-sm">{{ paymentCashinErrors.cash }}</span>
              </div>
              <input 
                :value="(paymentCashinForm.cash ?? 0).toLocaleString()" 
                @input="(e) => onInputNumber(e, 'cash', paymentCashinForm)"
                type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Recipient -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Recipient<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ paymentCashinErrors.recipient }}</span>
              </div>
              <input v-model="paymentCashinForm.recipient" type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Note -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Note<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ paymentCashinErrors.note }}</span>
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
                    <th class="px-2 py-3 font-semibold text-left">Invoice</th>
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
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.invoice.invoice_number }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatNumber(item.cash) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.recipient }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.createdby.employee.full_name }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatDateForOutput(new Date(item.created_at)) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.note }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 space-x-2">
                      <!-- <button @click="paymentCashinEditItem(item)"
                        class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
              
                      <button @click="paymentCashinDeleteItem(Number(item.id))"
                        class="inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-400 hover:bg-red-600 text-white text-sm">
                        <component :is="TrashIcon" class="w-4 h-4" />
                      </button> -->
                      <button @click="paymentCashinEditItem(item)"
                        :disabled="user?.id !== item.created_by"
                        :class="['inline-flex items-center gap-1 px-1 py-1 rounded text-white text-sm',
                          user?.id === item.created_by
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        ]"
                      >
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
              
                      <button @click="paymentCashinDeleteItem(Number(item.id))"
                        :disabled="user?.id !== item.created_by"
                        :class="['inline-flex items-center gap-0.5 px-1 py-1 rounded text-white text-sm',
                          user?.id === item.created_by
                            ? 'bg-red-400 hover:bg-red-600'
                            : 'bg-gray-400 cursor-not-allowed'
                        ]"
                      >
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
        <!-- <div v-if="paymentCashinShowSaveButton" class="px-6 py-4 flex justify-end gap-2 border-t">
          <button @click="handleCashinClose" class="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>

          <button @click="paymentCashinSubmitForm" 
            :disabled="paymentCashinLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <Icon v-if="paymentCashinLoading" name="svg-spinners:180-ring-with-bg" class="text-lg" />
              <span v-if="paymentCashinLoading">Progress...</span>
              <span v-else>{{ paymentCashinIsEditMode ? "Update" : "Save" }}</span>
          </button>
        </div> -->
        <div class="px-6 py-4 flex justify-end gap-2 border-t">
          <button @click="handleCashinClose" class="px-4 py-2 bg-gray-200 text-white rounded-lg">
            Cancel
          </button>

        <button 
          v-if="paymentCashinShowSaveButton"
          @click="paymentCashinSubmitForm" 
          :disabled="paymentCashinLoading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <Icon 
            v-if="paymentCashinLoading" 
            name="svg-spinners:180-ring-with-bg" 
            class="text-lg" 
          />
          <span v-if="paymentCashinLoading">Progress...</span>
          <span v-else>{{ paymentCashinIsEditMode ? "Update" : "Save" }}</span>
        </button>
        </div>

      </div>
    </div>


    <!-- PAYMENT PRELESS MODAL -->
    <div v-if="paymentPrelessShowModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div class="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg text-blue-800 dark:text-white">
            Preless for <span class="text-sm">Schedule#{{ paymentPrelessForm.schedule_id }} | Loan#{{ paymentPrelessScheduleItem?.loan_id }} | Payment#{{ paymentPrelessScheduleItem?.schedule_paymentnumber }}</span>
          </h2>
          <button @click="handlePrelessClose" :disabled="paymentPrelessLoading">✕</button>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-4 overflow-y-auto">

          <!-- Schedule -->
          <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Information</h3>
          <div class="grid grid-cols-3 gap-3 bg-slate dark:bg-gray-800/50 p-4 rounded-lg">
            <!-- <div class="hidden">
              <label class="text-sm text-gray-500">Schedule ID</label>
              <input v-model="paymentPrelessForm.schedule_id" type="number" class="w-full border rounded px-3 py-2" />
            </div> -->
            <!-- Cash -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Cash<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ paymentPrelessErrors.cash }}</span>
              </div>
              <input 
                :value="(paymentPrelessForm.cash ?? 0).toLocaleString()" 
                @input="(e) => onInputNumber(e, 'cash', paymentPrelessForm)"
                type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Recipient -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Recipient<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ paymentPrelessErrors.recipient }}</span>
              </div>
              <input v-model="paymentPrelessForm.recipient" type="text" class="w-full text-sm border rounded px-2 py-1" />
            </div>
            <!-- Note -->
            <div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-500">Note<span class="text-red-500 text-sm"> *</span></label>
                <span class="text-red-500 text-sm">{{ paymentPrelessErrors.note }}</span>
              </div>
              <input v-model="paymentPrelessForm.note" type="text" class="w-full text-sm border rounded px-2 py-1"></input>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-uppercase tracking-wider text-blue-800 mb-3 uppercase">Cashins</h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
              <table class="min-w-[300px] w-full custom-scrollbar text-sm">
                <thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr class="text-left">
                    <th class="px-2 py-3 font-semibold">#</th>
                    <th class="px-2 py-3 font-semibold text-left">Invoice</th>
                    <th class="px-2 py-3 font-semibold text-left">Cash</th>
                    <th class="px-2 py-3 font-semibold text-left">Recipient</th>
                    <th class="px-2 py-3 font-semibold text-left">Employee</th>
                    <th class="px-2 py-3 font-semibold text-left">Date</th>
                    <th class="px-2 py-3 font-semibold text-left">Note</th>
                    <th class="px-2 py-3 font-semibold text-left">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 ">
                  <tr v-for="item in paymentPrelessItems" :key="item.id" class="read-only:bg-slate-50 read-only:text-slate-500 read-only:cursor-not-allowed hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.preless_number }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.invoice.invoice_number }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatNumber(item.cash) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.recipient }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.createdby.employee.full_name }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ formatDateForOutput(new Date(item.created_at)) }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500">{{ item.note }}</td>
                    <td class="px-2 py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 space-x-2">
                      <!-- <button @click="paymentPrelessEditItem(item)"
                        class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
              
                      <button @click="paymentPrelessDeleteItem(Number(item.id))"
                        class="inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-400 hover:bg-red-600 text-white text-sm">
                        <component :is="TrashIcon" class="w-4 h-4" />
                      </button> -->
                      <button @click="paymentPrelessEditItem(item)"
                        :disabled="user?.id !== item.created_by"
                        :class="['inline-flex items-center gap-1 px-1 py-1 rounded text-white text-sm',
                          user?.id === item.created_by
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        ]"
                      >
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
              
                      <button @click="paymentPrelessDeleteItem(Number(item.id))"
                        :disabled="user?.id !== item.created_by"
                        :class="['inline-flex items-center gap-0.5 px-1 py-1 rounded text-white text-sm',
                          user?.id === item.created_by
                            ? 'bg-red-400 hover:bg-red-600'
                            : 'bg-gray-400 cursor-not-allowed'
                        ]"
                      >
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
        <!-- <div v-if="paymentPrelessShowSaveButton" class="px-6 py-4 flex justify-end gap-2 border-t">
          <button @click="handlePrelessClose" class="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>

          <button @click="paymentPrelessSubmitForm" 
            :disabled="paymentPrelessLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <Icon v-if="paymentPrelessLoading" name="svg-spinners:180-ring-with-bg" class="text-lg" />
              <span v-if="paymentPrelessLoading">Progress...</span>
              <span v-else>{{ paymentPrelessIsEditMode ? "Update" : "Save" }}</span>
          </button>
        </div> -->
        <div class="px-6 py-4 flex justify-end gap-2 border-t">
          <button @click="handlePrelessClose" class="px-4 py-2 bg-gray-200 text-white rounded-lg">
            Cancel
          </button>

          <button 
            v-if="paymentPrelessShowSaveButton"
            @click="paymentPrelessSubmitForm" 
            :disabled="paymentPrelessLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <Icon 
              v-if="paymentPrelessLoading" 
              name="svg-spinners:180-ring-with-bg" 
              class="text-lg" 
            />
            <span v-if="paymentPrelessLoading">Progress...</span>
            <span v-else>{{ paymentPrelessIsEditMode ? "Update" : "Save" }}</span>
          </button>
        </div>

      </div>
    </div>


    <!-- PAYMENT MODAL -->
    <div v-if="paymentShowModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg text-blue-800 dark:text-white">
            Payment Schedule
            <span class="text-sm">
              #{{ paymentForm.id }}
              |
              Loan#{{ paymentSchedule?.loan_id }}({{ paymentItem?.loantype }})
              |
              Payment#{{ paymentForm.schedule_paymentnumber }}
            </span>
          </h2>

          <button @click="handleClose" :disabled="paymentLoading">
            ✕
          </button>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-5 overflow-y-auto">

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

              <!-- PRINCIPLE DATE -->
              <div>
                <label class="text-sm text-gray-500"> Date </label>
                <input v-model="paymentForm.schedule_principle_date" type="date" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- INTEREST RATE -->
              <div>
                <label class="text-sm text-gray-500"> Rate </label>
                <input
                  type="number"
                  v-model="paymentForm.schedule_interest_rate"
                  @input="calculatePayment"
                  class="w-full text-sm border rounded px-3 py-2"
                />
              </div>

              <!-- INTEREST -->
              <div>
                <label class="text-sm text-gray-500"> Interest</label>
                <input :value="formatNumber(paymentForm.schedule_interest)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800"/>
              </div>

              <!-- OUTSTANDING -->
              <div>
                <label class="text-sm text-gray-500"> Outstanding </label>
                <input :value="formatNumber(paymentForm.schedule_outstanding)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- OVER DRAFT -->
              <div>
                <label class="text-sm text-gray-500"> Over Draft </label>
                <input
                  type="text"
                  :value="paymentForm.schedule_over_draft?.toLocaleString()"
                  @input="(e) => {
                    onInputNumber(e, 'schedule_over_draft', paymentForm) 
                    calculatePayment()
                  }"
                  class="w-full text-sm border rounded px-3 py-2"
                  :class="paymentItem?.loantype_id !== 14 ? 'bg-gray-100 dark:bg-gray-800' : ''"
                  :readonly="paymentItem?.loantype_id !== 14"
                />
              </div>

              <!-- PRINCIPLE -->
              <div>
                <label class="text-sm text-gray-500"> Principle </label>
                <input
                  type="text"
                  :value="paymentForm.schedule_principle?.toLocaleString()"
                  @input="(e) => {
                    onInputNumber(e, 'schedule_principle', paymentForm)
                    calculatePayment()
                  }"
                  class="w-full text-sm border rounded px-3 py-2"
                  :class="
                    paymentItem?.loantype_id === 13 &&
                    (
                      (
                        parseFloat(String(paymentForm.schedule_outstanding).replace(/,/g, '')) +
                        parseFloat(String(paymentForm.schedule_interest).replace(/,/g, ''))
                      ).toFixed(2)
                      !==
                      parseFloat(String(paymentForm.schedule_totalcashin).replace(/,/g, '')).toFixed(2)
                    )
                  "
                  :readonly="
                    paymentItem?.loantype_id === 13 &&
                    (
                      (
                        parseFloat(String(paymentForm.schedule_outstanding).replace(/,/g, '')) +
                        parseFloat(String(paymentForm.schedule_interest).replace(/,/g, ''))
                      ).toFixed(2)
                      !==
                      parseFloat(String(paymentForm.schedule_totalcashin).replace(/,/g, '')).toFixed(2)
                    )
                  "
                />
              </div>

              <!-- TOTAL PAY -->
              <div>
                <label class="text-sm text-gray-500"> Total Pay </label>
                <input :value="formatNumber(paymentForm.schedule_totalpay)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- TOTAL CASHIN -->
              <div>
                <label class="text-sm text-gray-500"> Cashin </label>
                <input :value="formatNumber(paymentForm.schedule_totalcashin)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- CASHIN 3 -->
              <div>
                <label class="text-sm text-gray-500">Cashin 3 <span class="text-red-500">(Paymented)</span></label>
                <input 
                  type="text"
                  :value="paymentForm.schedule_cashin_3?.toLocaleString()"
                  @input="(e) => {
                    onInputNumber(e, 'schedule_cashin_3', paymentForm) 
                    calculatePayment()
                  }"
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" readonly/>
              </div>

              <!-- REMAIN CASH -->
              <div>
                <label class="text-sm text-gray-500">Remain Cash</label>
                <input :value="formatNumber(paymentForm.schedule_remaincash)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- PAID CASH -->
              <div>
                <label class="text-sm text-gray-500">Paid Cash</label>
                <input :value="formatNumber(paymentForm.schedule_paidcash)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- TOTAL PRELESS -->
              <div>
                <label class="text-sm text-gray-500">Preless</label>
                <input :value="formatNumber(paymentForm.schedule_totalpreless)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- NOTE -->
              <div class="md:col-span-2">
                <label class="text-sm text-gray-500">Note</label>
                <textarea v-model="paymentForm.schedule_note" rows="1"
                  class="w-full text-sm border rounded px-3 py-2" />
              </div>

              <!-- Invoice  -->
              <div>
                <label class="text-sm text-gray-500">Invoice</label>
                <input :value="(paymentItem?.invoice_number)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

              <!-- LESS MONEY -->
              <div>
                <label class="text-sm text-gray-500">Less Money</label>
                <input :value="formatNumber(paymentForm.schedule_lessmoney)" type="text" readonly
                  class="w-full text-sm border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800" />
              </div>

            </div>
          

        </div>

        <!-- FOOTER -->
        <div class="px-6 py-4 flex justify-end gap-2 border-t">

          <button @click="handleClose" class="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>

          <button v-if="paymentShowSaveButton" @click="paymentSubmitForm" :disabled="paymentLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            <Icon v-if="paymentLoading" name="svg-spinners:180-ring-with-bg" class="text-lg" />

            <span v-if="paymentLoading">
              Progress...
            </span>

            <span v-else>
              Save
            </span>
          </button>

          <!-- <button
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              Save
          </button> -->

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