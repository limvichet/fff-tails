<script setup lang="ts">

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Schedules", subTitle: "Create" }
})


import { ref, reactive, onMounted, onActivated, watch } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import ComponentSubmitCard from "@/components/common/ComponentSubmitCard.vue"
import CommonCustomerSelect2 from "@/components/common/CommonCustomerSelect2.vue"
import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"


import { useSchedule } from "@/composables/useSchedule"
const { schedules, generateSchedule } = useSchedule()

const { successMsg, errorMsg } = useMessage()
const loading = ref(false)
const errors = reactive<Record<string,string>>({})

  errorMsg.value = null
  successMsg.value = null

/* FORM OPTIONS */
type Loanrecord = {
    id: number;
    cust_id: number;
    currency_id: number | null;
    loan_startdate: string | null;
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

type Customer = { id:number, cust_name_1:string, cust_name_2:string|null }
type Currency = { id:number, currency_en:string }
type Loantype = { id:number, loantype_detail:string }

const customers = ref<{id:number,label:string}[]>([])
const loanrecords = ref<Loanrecord[]>([])
// const schedules = ref<any[]>([])

/* FORM */
const form = reactive({
  loan_id: -1,
  cust_name_1: "",
  cust_name_2: "",
  loan_startdate: "",
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

    const map = (obj: Record<string,string>) =>
      Object.entries(obj).map(([id,label])=>({ id:Number(id), label:String(label) }))

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
      // const generator = scheduleGenerators[Number(form.loantype_id)]
      // if (generator) {
      //   generator()
      // }
      const generator = generateSchedule(form)
      // if (generator) {
      //   generator()
      // }
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
    schedule_startdate: schedules.value.map(s => formatDateForOutput(s.schedule_startdate)),
    schedule_enddate: schedules.value.map(s => formatDateForOutput(s.schedule_enddate)),
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
    const res = await $fetch<{ success: boolean; message: string; loan_id: number }>("/api/admin-secure/schedules",{
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


/* DATE FORMAT HELPER */
// function formatDateForInput(date: string | null) {
//   if (!date) return ""

//   // already correct
//   if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     return date
//   }

//   // convert dd-MM-yyyy → yyyy-MM-dd
//   const [d, m, y] = date.split("-")

//   return `${y}-${m}-${d}`
// }

// function formatDateForOutput(date: Date) {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${d}-${m}-${y}`;
// }

  // const fixDouble = (value: number, n: number): number => {
  //   const power = Math.pow(10, n)
  //   return Math.floor(value * power) / power
  // }




// const generateLoanM11 = () => {
//   schedules.value = []
  
//   for (let i = 0; i < form.loan_peroid; i++) {
//     let startDate = new Date(formatDateForInput(form.loan_startdate))
//     let newStartDate = new Date(startDate);
//     newStartDate.setMonth(newStartDate.getMonth() + i)

//     let newEndDate = new Date(newStartDate); // clone!
//     newEndDate.setMonth(newStartDate.getMonth() + 1)

//     let totalDays = Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24))

//     let schedule_outstanding = 0.000
//     let schedule_principle = 0.000
//     let schedule_totalpay = 0.000
//     let schedule_interest = 0.000

//     const loan_totalcash = Number(String(form.loan_totalcash).replace(/,/g, '') || 0)
//     const loan_principle = Number(String(form.loan_principle).replace(/,/g, '') || 0)
//     let loan_interest_rate = Number(String(form.loan_interest_rate).replace(/,/g, '') || 0)

//     schedule_outstanding = loan_totalcash - (loan_principle * i)
//     if(schedule_outstanding <= 0){
//       schedule_outstanding = 0.000;
//       schedule_principle = 0.000;
//       schedule_interest = 0.000;
//       schedule_totalpay = 0.000;
//     }else{
//       schedule_principle = loan_principle;
//       schedule_interest = Number(fixDouble(loan_interest_rate / 100, 3)) * ( loan_totalcash - (loan_principle * i));
//       schedule_totalpay =(schedule_principle) + (fixDouble(loan_interest_rate / 100, 3)) * (loan_totalcash - (loan_principle * i));
//     }


//     schedules.value.push({
//       schedule_paymentnumber: i + 1,
//       schedule_startdate: newStartDate,
//       schedule_enddate: newEndDate,
//       schedule_totaldays: totalDays,
//       schedule_interest_rate: loan_interest_rate,
//       schedule_outstanding: schedule_outstanding,
//       schedule_over_draft: 0.000,
//       schedule_principle: schedule_principle,
//       schedule_interest: schedule_interest
//     })
//   }
  
//   recalculcateDateM()
// }


// const recalculcateDateM = () => {
//   schedules.value.forEach((item, index) => {
//     if (index > 0) {
//       const prevEnd = new Date(schedules.value[index - 1].schedule_enddate)

//       // +1 day
//       prevEnd.setDate(prevEnd.getDate() + 1)

//       // ⚠️ IMPORTANT: assign Date (not timestamp)
//       schedules.value[index].schedule_startdate = new Date(prevEnd)
//     }

//     const start = new Date(schedules.value[index].schedule_startdate)
//     const end = new Date(schedules.value[index].schedule_enddate)

//     let totalDays =
//       Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1

//     // fix 32 → 31
//     if (totalDays >= 32) totalDays = 31

//     schedules.value[index].schedule_totaldays = totalDays
//   })
// }

// 1️⃣ Map each loan type ID to its generator function
// const scheduleGenerators: Record<number, () => void> = {
//   11: generateLoanM11,
//   12: generateLoanM11,
//   13: generateLoanM11,
//   14: () => {
//     if (Number(form.loan_over_draft) === 0) {
//       alert("Loanrecord has no over draft")
//     } else {
//       generateLoanM11()
//     }
//   },
//   // add more types here...
// }


// 2️⃣ Watch loan type and call the correct generator
watch(
  () => [form.loantype_id, form.loan_over_draft], // watch relevant dependencies
  // ([loantype_id]) => {
  //   schedules.value = [] // always reset before generating

  //   const generator = scheduleGenerators[Number(loantype_id)]
  //   if (generator) {
  //     generator() // call the generator function dynamically
  //   }
  // },
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
        <CommonCustomerSelect2 
          label="Customer" 
          v-model="form.loan_id" 
          :required="true" 
          :error="errors.cust_id"
          :options="customers" 
        />

        <!-- Spouse/Partner -->
        <div class="py-3">
          <label class="label">Spouse/Partner</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.cust_name_2" readonly />
        </div>

        <!-- loan_id -->
        <div class="">
          <label class="label">Loan ID</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_id" readonly />
        </div>
      </div>


       <!-- col 2 -->
      <div>
        <!-- loan_startdate -->
        <div class="">
          <label class="label">Start Date</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_startdate" readonly />
        </div>

        <!-- loan_enddate -->
        <div class="py-2">
          <label class="label">End Date</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_enddate" readonly />
        </div>

        <!-- currency_en -->
        <div class="py-2">
          <label class="label">Currency</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.currency_en" readonly />
        </div>
      </div>


       <!-- col 3 -->
      <div>
        <!-- loan_totalcash -->
        <div class="">
          <label class="label">Total Cash</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_totalcash" readonly />
        </div>

        <!-- loan_principle -->
        <div class="py-2">
          <label class="label">Principle</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_principle" readonly />
        </div>

        <!-- loan_interest_rate -->
        <div class="py-2">
          <label class="label">Interest Rate</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_interest_rate" readonly />
        </div>
      </div>


       <!-- col 4 -->
      <div>
        <!-- loan_peroid -->
        <div class="">
          <label class="label">Period</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_peroid" readonly />
        </div>

        <!-- loantype_detail -->
        <div class="py-2">
          <label class="label">Loan Type</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loantype_detail" readonly />
        </div>

        <!-- loan_over_draft -->
        <div class="py-2">
          <label class="label">Over Draft</label>
          <input v-if="form.loan_id === -1" class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" readonly />
          <input v-else class="input bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" type="text" v-model="form.loan_over_draft" readonly />
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
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">#</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Start</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Endd</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Days</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Rate</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Outstanding</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">OverDraft</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Principle</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Interest</td>
            <td class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">TotalPay</td>
          </tr>
        </thead>
        <!-- <tbody class="divide-gray-200 dark:divide-gray-700">
          <tr v-for="(s, index) in schedules" :key="index">
            <td><input class="input" :value="s.schedule_paymentnumber" readonly /></td>
            <td><input class="input" :value="formatDateForOutput(s.schedule_startdate)" readonly /></td>
            <td><input class="input" :value="formatDateForOutput(s.schedule_enddate)" readonly /></td>
            <td><input class="input" :value="s.schedule_totaldays" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_interest_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_outstanding || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_over_draft || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_principle || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_interest || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
            <td><input class="input" :value="Number(s.schedule_totalpay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })" readonly /></td>
          </tr>
        </tbody> -->
        <tbody class="border-b divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(s, index) in schedules" :key="index"  class="hover:bg-blue-50 dark:hover:bg-white/5 transition">
            <td class="px-3 py-2 font-medium text-gray-500">{{s.schedule_paymentnumber}}</td>
            <td class="px-3 py-2">{{formatDateForOutput(s.schedule_startdate)}}</td>
            <td class="px-3 py-2">{{formatDateForOutput(s.schedule_enddate)}}</td>
            <td class="px-3 py-2">{{s.schedule_totaldays}}</td>
            <td class="px-3 py-2">{{Number(s.schedule_interest_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
            <td class="px-3 py-2">{{Number(s.schedule_outstanding || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
            <td class="px-3 py-2">{{Number(s.schedule_over_draft || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
            <td class="px-3 py-2">{{Number(s.schedule_principle || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
            <td class="px-3 py-2">{{Number(s.schedule_interest || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
            <td class="px-3 py-2 text-right text-blue-600">{{Number(s.schedule_totalpay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- BUTTON -->
  <template #footer v-if="form.loan_id > 0">
    <button
      :disabled="loading"
      class="px-6 py-2 !mt-5 bg-yellow-400 text-white rounded-lg hover:bg-blue-700"
    >
      {{ loading ? "Saving..." : "Reculculate" }}
    </button>
    <button
      @click="submitForm"
      :disabled="loading"
      class="px-6 py-2 !mt-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      {{ loading ? "Saving..." : "Create Schedule" }}
    </button>
  </template>

  </ComponentGrowCard>




</template>

<style scoped>

.label{
display:block;
margin-bottom:4px;
font-size:14px;
color:#555;
}

.input{
width:100%;
border:1px solid #ddd;
border-radius:8px;
padding:8px 12px;
}


</style>