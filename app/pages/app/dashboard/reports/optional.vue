<script setup lang="ts">

definePageMeta({
  layout: "default",
  requiresAuth: true,
})

useHead({
  title: "Generate Optional Reports",
})

import ComponentCard4Report from "@/components/common/ComponentCard4Report.vue"

const reportRef = ref<HTMLElement | null>(null)
  const showToast = ref<null | {
  title: string
  description: string
  type: "success" | "error" | "info"
}>(null)

const copyAll = async () => {
  if (!reportRef.value) return

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([reportRef.value.innerHTML], { type: "text/html" }),
        "text/plain": new Blob([reportRef.value.innerText], { type: "text/plain" }),
      }),
    ])
    // alert("Copied with formatting!")
    showToast.value = {
      title: "Copied Report!",
      description: "",
      type: "success",
    }
    setTimeout(() => (showToast.value = null), 3000) // auto-hide

  } catch (e) {
    console.error("Copy failed:", e)
  }
}



const route = useRoute()

const query = computed(() => ({
  loan_startdate: route.query.loan_startdate as string,
  loan_enddate: route.query.loan_enddate as string,
  loan_status_id: route.query.loan_status_id as string | undefined,
  loantype_id: route.query.loantype_id as string | undefined,
}))

const { data, pending, error } = useAsyncData(
  "income-report",
  () =>
    $fetch("/api/admin-secure/reports/income", {
      query: query.value,
    }),
  {
    watch: [query], // 🔥 important: reload when query exists
  }
)
</script>

<template>


  <div class="grid grid-cols-1" ref="reportRef">
    <ComponentCard4Report 
      title="Optional Report" 
      :desc="`${formatDateForOutput(new Date(query.loan_startdate))} - ${formatDateForOutput(new Date(query.loan_enddate))} | Records: ${data?.count ?? 0}`" 
      @click="copyAll"
      >

      <div v-if="pending" class="loading"><p>Generate Data ...</p></div>

      <div v-else-if="error">
        {{ error }}
      </div>
      <!-- Table -->
      <div v-else
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] -mt-5">
          <table class="min-w-full">
            <thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 text-sm text-left">
              <tr class="border-b border-gray-200 dark:border-gray-700 text-xs font-bold">
                <th class="px-1">ល.រ</th>
                <th class="px-1">កម្ចី</th>
                <th class="px-1">អតិថិជន</th>
                <th class="px-1">រូបិយប័ណ្ណ</th>
                <th class="px-1">ប្រាក់ដើមខ្ចីដំបូង</th>
                <th class="px-1">ថ្ងៃខែឆ្នាំបង់ប្រាក់</th>
                <th class="px-1">ប្រាក់ដើមមិនទាន់សងត្រឡប់</th>
                <th class="px-1">ស្លាក</th>
                <th class="px-1">ប្រាក់ដើមខែនេះ</th>
                <th class="px-1">ការប្រាក់ខែនេះ</th>
                <th class="px-1">សរុប</th>
                <th class="px-1">ស.របានបង់</th>
                <th class="px-1">ស.រប្រាក់អតិ.ទទួលទៅវិញ</th>
                <th class="px-1">សមតុល្យ</th>
              </tr>
              <tr class="border-b border-gray-200 dark:border-gray-700 text-xs">
                <th class="px-1 py-1">#</th>
                <th class="px-1 py-1">Loan</th>
                <th class="px-1 py-1">Customer</th>
                <th class="px-1 py-1">Currency</th>
                <th class="px-1 py-1">Totalcash</th>
                <th class="px-1 py-1">Enddate</th>
                <th class="px-1 py-1">Outstanding</th>
                <th class="px-1 py-1">Tag</th>
                <th class="px-1 py-1">Principle</th>
                <th class="px-1 py-1">Interest</th>
                <th class="px-1 py-1">Total</th>
                <th class="px-1 py-1">Cashin</th>
                <th class="px-1 py-1">Preless</th>
                <th class="px-1 py-1">Balance</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(row, i) in data?.data ?? []" :key="row.id" class="hover:bg-blue-50 text-xs cursor-pointer">
                <td class="px-1 py-1">{{ i + 1 }}</td>
                <td class="px-1 py-1">{{ row.id }}({{ row.loantype_short }})</td>
                <td class="px-1 py-1">{{ row.cust_name_1 }}</td>
                <td class="px-1 py-1">{{ row.currency_en }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.loan_totalcash) }}</td>
                <td class="px-1 py-1">{{ formatDateForOutput(new Date(row.latest_schedule_paid_date)) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.latest_schedule_outstanding) }}</td>
                <td class="px-1 py-1">{{ row.loan_tag }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_principle) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_interest) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_totalpay) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_totalcashin) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_totalpreless) }}</td>
                <td class="px-1 py-1">{{ formatNumber(row.schedule_lessmoney) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </ComponentCard4Report>
  </div>
  <div>




  </div>

  <!-- Toast Notification -->
  <div v-if="showToast" class="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg w-80" :class="{
    'bg-green-600 text-white': showToast.type === 'success',
    'bg-red-600 text-white': showToast.type === 'error',
    'bg-blue-600 text-white': showToast.type === 'info'
  }">
    <strong class="block">{{ showToast.title }}</strong>
    <p class="text-sm opacity-90">Records: {{ data?.count ?? 0 }} have been copied.</p>
  </div>
  
</template>


<style scoped>
.loading {
  padding-top: 20px;
  text-align: center;
}
</style>