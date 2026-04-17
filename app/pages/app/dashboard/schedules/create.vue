<script setup lang="ts">

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Schedules", subTitle: "Create" }
})

useHead({
  title: "Create schedules",
  meta: [{ name: "loanrecords", content: "create schedules" }],
})


import { ref, reactive, onMounted, onActivated, watch } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import ComponentSubmitCard from "@/components/common/ComponentSubmitCard.vue"
import CommonCustomerSelect2 from "@/components/common/CommonCustomerSelect2.vue"
import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"


import { useSchedule } from "@/composables/useSchedule"
import { formatDateForOutput } from '~/utils/date'

import { fixDouble } from "@/utils/number"


const { schedules, generateSchedule, reroundLoading, reroundDone, handleReround } = useSchedule()

import { usePagination } from "@/composables/usePagination"
const {
  currentPage,
  totalPages,
  paginatedData: paginatedSchedules,
  nextPage,
  prevPage
} = usePagination(schedules, 10)

const { successMsg, errorMsg } = useMessage()
const loading = ref(false)
const errors = reactive<Record<string, string>>({})


errorMsg.value = null
successMsg.value = null

/* FORM OPTIONS */
type Loanrecord = {
  id: number;
  cust_id: number;
  currency_id: number | null;
  loan_startdate: string | null;
  loan_first_paid_date: string | null;
  loan_enddate: string | null;
  loan_totalcash: string;
  loan_principle: string;
  loan_interest_rate: string;
  loan_peroid: number | null;
  loantype_id: number | null;
  loan_over_draft?: string;
  customer: Customer;
  currency: Currency | null;
  loantype: Loantype | null;
}

type Customer = { id: number, cust_name_1: string, cust_name_2: string | null }
type Currency = { id: number, currency_en: string }
type Loantype = { id: number, loantype_detail: string }

const customers = ref<{ id: number, label: string }[]>([])
const loanrecords = ref<Loanrecord[]>([])
// const schedules = ref<any[]>([])

/* FORM */
const form = reactive({
  loan_id: -1,
  cust_name_1: "",
  cust_name_2: "",
  loan_startdate: "",
  loan_first_paid_date: "",
  loan_enddate: "",
  currency_en: "",
  loan_totalcash: "",
  loan_principle: "",
  loan_interest_rate: "",
  loan_peroid: 0,
  loantype_id: 0,
  loantype_detail: "",
  loan_over_draft: ""

})

/* FETCH FORM DATA */
const fetchFormData = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<{
      customers: { [key: string]: string },
      loanrecords: Loanrecord[]
    }>("/api/admin-secure/schedules-form-data", {
      params: {
        t: Date.now() // ✅ cache buster
      }
    })

    const map = (obj: Record<string, string>) =>
      Object.entries(obj).map(([id, label]) => ({ id: Number(id), label: String(label) }))

    customers.value = map(res.customers)
    loanrecords.value = res.loanrecords

    // Debug logs
    // console.log("Mapped customers:", customers.value)
    // console.log("Loan records:", loanrecords.value)

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to load form data"
    console.error("Fetch error:", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchFormData() })
onActivated(() => { fetchFormData() })

watch(
  () => form.loan_id,
  (newLoanId) => {
    if (newLoanId == -1) {

      // Clear form if no selection
      form.cust_name_1 = ""
      form.cust_name_2 = ""
      form.loan_startdate = ""
      form.loan_first_paid_date = ""
      form.loan_enddate = ""
      form.currency_en = ""
      form.loan_totalcash = ""
      form.loan_principle = ""
      form.loan_interest_rate = ""
      form.loan_peroid = 0
      form.loantype_detail = ""
      form.loantype_id = 0
      form.loan_over_draft = ""

      return
    }

    // Find the selected loanrecord
    const selectedLoan = loanrecords.value.find(lr => lr.id === newLoanId)
    if (selectedLoan) {
      form.cust_name_2 = selectedLoan.customer?.cust_name_2 ?? ""
      form.cust_name_2 = selectedLoan.customer?.cust_name_2 ?? ""
      form.loan_startdate = selectedLoan.loan_startdate ?? ""
      form.loan_first_paid_date = selectedLoan.loan_first_paid_date ?? ""
      form.loan_enddate = selectedLoan.loan_enddate ?? ""
      form.currency_en = selectedLoan.currency?.currency_en ?? ""
      form.loan_totalcash = selectedLoan.loan_totalcash
      form.loan_principle = selectedLoan.loan_principle
      form.loan_interest_rate = selectedLoan.loan_interest_rate
      form.loan_peroid = selectedLoan.loan_peroid ?? 0
      form.loantype_id = selectedLoan.loantype_id ?? 0
      form.loantype_detail = selectedLoan.loantype?.loantype_detail ?? ""
      form.loan_over_draft = selectedLoan.loan_over_draft ?? ""

      // 🔥 Generate schedule immediately based on loantype
      const generator = generateSchedule(form)
    }
  },
  { immediate: true } // 🔥 important
)

/* SUBMIT */
const submitForm = async () => {
  loading.value = true
  errorMsg.value = null
  successMsg.value = null

  console.log("Schedules:", schedules.value)         // ✅ direct object

  const payload = {
    loan_id: form.loan_id,
    schedule_paymentnumber: schedules.value.map(s => s.schedule_paymentnumber),
    schedule_startdate: schedules.value.map(s => (s.schedule_startdate)),
    schedule_enddate: schedules.value.map(s => (s.schedule_enddate)),
    schedule_totaldays: schedules.value.map(s => Number(s.schedule_totaldays || 0)),
    schedule_outstanding: schedules.value.map(s => Number(s.schedule_outstanding || 0)),
    schedule_over_draft: schedules.value.map(s => Number(s.schedule_over_draft || 0)),
    schedule_principle: schedules.value.map(s => Number(s.schedule_principle || 0)),
    schedule_interest_rate: schedules.value.map(s => Number(s.schedule_interest_rate || 0)),
    schedule_interest: schedules.value.map(s => Number(s.schedule_interest || 0)),
    schedule_totalpay: schedules.value.map(s => Number(s.schedule_totalpay || 0)),
  }

  console.log("Payload:", payload)                   // ✅ direct object
  // console.log("Payload JSON:", JSON.stringify(payload, null, 2))
  try {
    const res = await $fetch<{ success: boolean; message: string; loan_id: number }>("/api/admin-secure/schedules", {
      method: "POST",
      body: payload,
    })
    console.log(res.loan_id)
    successMsg.value = res.message

    if (res && res.loan_id) {
      await navigateTo(`/app/dashboard/schedules/${res.loan_id}`)
    }

  } catch (err: any) {
    console.log('FULL ERROR:', err)
    console.log('DATA:', err?.data)
    console.log('MESSAGE:', err?.data?.message)
    if (err.errors) {
      err.errors.forEach((e: any) => {
        const path = e.path[0]
        if (typeof path === 'string' || typeof path === 'number') {
          errors[path] = e.message
        }
      })
    } else {
      errorMsg.value = "Error while saving loanrecord"
    }
  } finally {
    loading.value = false
  }

}



// 2️⃣ Watch loan type and call the correct generator
watch(
  () => [form.loantype_id, form.loan_over_draft], // watch relevant dependencies
  () => {
    if (form.loan_id > 0) {
      generateSchedule(form)
    }
  },
  { immediate: true }
)

</script>



<template>

  <!-- Messages -->
  <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
    {{ errorMsg }}
  </div>
  <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
    {{ successMsg }}
  </div>



  <!-- Infomation -->
  <ComponentCard title="1. Infomation">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      <!-- col 1 -->
      <div>
        <!-- customer -->
        <CommonCustomerSelect2 label="Customer" v-model="form.loan_id" :required="true" :error="errors.cust_id"
          :options="customers" />

        <!-- Spouse/Partner -->
        <div class="py-3">
          <label class="label">Spouse/Partner</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.cust_name_2" readonly />
        </div>

        <!-- loan_id -->
        <div class="">
          <label class="label">Loan ID</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_id" readonly />
        </div>
      </div>


      <!-- col 2 -->
      <div>
        <!-- loan_startdate -->
        <div class="">
          <label class="label">Start Date</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" :value="formatDateForOutput(new Date(form.loan_startdate))" readonly />
        </div>
        
        <!-- loan_first_paid_date -->
        <div class="py-2">
          <label class="label">First Paid Date</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" :value="form.loan_first_paid_date ? formatDateForOutput(new Date(form.loan_first_paid_date)) : ''" readonly />
        </div>

        <!-- loan_enddate -->
        <!-- <div class="py-2">
          <label class="label">End Date</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_enddate" readonly />
        </div> -->

        <!-- currency_en -->
        <div class="py-2">
          <label class="label">Currency</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.currency_en" readonly />
        </div>
      </div>


      <!-- col 3 -->
      <div>
        <!-- loan_totalcash -->
        <div class="">
          <label class="label">Total Cash</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_totalcash" readonly />
        </div>

        <!-- loan_principle -->
        <div class="py-2">
          <label class="label">Principle</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_principle" readonly />
        </div>

        <!-- loan_interest_rate -->
        <div class="py-2">
          <label class="label">Interest Rate</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_interest_rate" readonly />
        </div>
      </div>


      <!-- col 4 -->
      <div>
        <!-- loan_peroid -->
        <div class="">
          <label class="label">Period</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_peroid" readonly />
        </div>

        <!-- loantype_detail -->
        <div class="py-2">
          <label class="label">Loan Type</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loantype_detail" readonly />
        </div>

        <!-- loan_over_draft -->
        <div class="py-2">
          <label class="label">Over Draft</label>
          <input v-if="form.loan_id === -1"
            class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text"
            readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            type="text" v-model="form.loan_over_draft" readonly />
        </div>
      </div>
    </div>

  </ComponentCard>

  <!-- Generate Schedule -->
  <ComponentGrowCard title="2. Generate Schedule" class="mt-3">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">#</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Start</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">End</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Days</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Rate</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Outstanding</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">OverDraft</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Principle</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">Interest</td>
            <td class="px-3 py-3 font-semibold text-[14px] text-blue-900 dark:text-gray-200">TotalPay</td>
          </tr>
        </thead>
        <tbody class="border-b divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(s, index) in paginatedSchedules" :key="index"
            class="hover:bg-blue-50 dark:hover:bg-white/5 transition">
            <td class="text-[14px] px-3 py-2 font-medium text-gray-500">{{ s.schedule_paymentnumber }}</td>
            <td class="text-[14px] px-3 py-2">{{ formatDateForOutput(s.schedule_startdate) }}</td>
            <td class="text-[14px] px-3 py-2">{{ formatDateForOutput(s.schedule_enddate) }}</td>
            <td class="text-[14px] px-3 py-2">{{ s.schedule_totaldays }}</td>
            <td class="text-[14px] px-3 py-2">{{ Number(s.schedule_interest_rate || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            }) }}</td>
            <td class="text-[14px] px-3 py-2">{{ Number(s.schedule_outstanding || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            }) }}</td>
            <td class="text-[14px] px-3 py-2">{{ Number(s.schedule_over_draft || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            }) }}</td>
            <td class="text-[14px] px-3 py-2">{{ Number(s.schedule_principle || 0).toLocaleString(undefined, {
              minimumFractionDigits:
                2, maximumFractionDigits: 2
            }) }}</td>
            <td class="text-[14px] px-3 py-2">{{ Number(s.schedule_interest || 0).toLocaleString(undefined, {
              minimumFractionDigits:
                2, maximumFractionDigits: 2
            }) }}</td>
            <td class="text-[14px] px-3 py-2 text-left text-blue-600">{{ Number(s.schedule_totalpay || 0).toLocaleString(undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="form.loan_id > 0" class="flex justify-between items-center mt-4">

      <!-- LEFT: Pagination -->
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
          Prev
        </button>

        <span class="text-sm">
          Page {{ currentPage }} / {{ totalPages }}
        </span>

        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
          Next
        </button>
      </div>

      <!-- RIGHT: Actions -->
      <div class="flex gap-2">
        <button @click="handleReround(form)" :disabled="reroundLoading || reroundDone"
          class="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">
  {{ reroundLoading ? "Calculating..." : reroundDone ? "Reround Done" : "Reround Down" }}
        </button>

        <button @click="submitForm" :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {{ loading ? "Saving..." : "Create Schedule" }}
        </button>
      </div>

    </div>
  </ComponentGrowCard>




</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}

.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
</style>