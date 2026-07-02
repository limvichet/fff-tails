<script setup lang="ts">

definePageMeta({
  layout: "default",
  requiresAuth: true,
})

useHead({
  title: "Generate Incone Reports",
})

import ComponentCard from "@/components/common/ComponentCard.vue"


const route = useRoute()

const query = computed(() => ({
  loan_startdate: route.query.loan_startdate as string,
  loan_enddate: route.query.loan_enddate as string,
  loan_status_id: route.query.loan_status_id as string | undefined,
  loantype_id: route.query.loantype_id as string | undefined,
}))

const { data, pending, error } = await useAsyncData(
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


  <div class="grid grid-cols-1">
    <ComponentCard title="Income Report" :desc="`${query.loan_startdate} - ${query.loan_enddate}/ Records: ${data?.count ?? 0}`">
      <div v-if="pending">
        Loading...
      </div>

      <div v-else-if="error">
        {{ error }}
      </div>
      <!-- Table -->
      <div v-else
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] -mt-5">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead class="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 text-sm">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-1 pt-3 text-left">ល.រ</th>
                <th class="px-1 pt-3 text-left">កម្ចី</th>
                <th class="px-1 pt-3 text-left">អតិថិជន</th>
                <th class="px-1 pt-3 text-left">រូបិយប័ណ្ណ</th>
                <th class="px-1 pt-3 text-left">ប្រាក់ដើមខ្ចីដំបូង</th>
                <th class="px-1 pt-3 text-left">ថ្ងៃខែឆ្នាំបង់ប្រាក់</th>
                <th class="px-1 pt-3 text-left">ប្រាក់ដើមមិនទាន់សងត្រឡប់</th>
                <th class="px-1 pt-3 text-left">ស្លាក</th>
                <th class="px-1 pt-3 text-left">ប្រាក់ដើមខែនេះ</th>
                <th class="px-1 pt-3 text-left">ការប្រាក់ខែនេះ</th>
                <th class="px-1 pt-3 text-left">សរុប</th>
                <th class="px-1 pt-3 text-left">ស.របានបង់</th>
                <th class="px-1 pt-3 text-left">ស.រប្រាក់អតិ.ទទួលទៅវិញ</th>
                <th class="px-1 pt-3 text-left">សមតុល្យ</th>
              </tr>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-1 py-1 pb-3 text-left text-sm">#</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Loan</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Customer</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Currency</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Totalcash</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Enddate</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Outstanding</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Tag</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Principle</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Interest</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Total</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Cashin</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Preless</th>
                <th class="px-1 py-1 pb-3 text-left text-sm">Balance</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(row, i) in data?.data ?? []" :key="row.id">
                <td class="px-1 py-1 text-sm">{{ i + 1 }}</td>
                <td class="px-1 py-1 text-sm">{{ row.id }}({{ row.loantype_short }})</td>
                <td class="px-1 py-1 text-sm">{{ row.cust_name_1 }}</td>
                <td class="px-1 py-1 text-sm">{{ row.currency_en }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.loan_totalcash) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatDateForOutput(new Date(row.latest_schedule_paid_date)) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.latest_schedule_outstanding) }}</td>
                <td class="px-1 py-1 text-sm">{{ row.loan_tag }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_principle) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_interest) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_totalpay) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_totalcashin) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_totalpreless) }}</td>
                <td class="px-1 py-1 text-sm">{{ formatNumber(row.schedule_lessmoney) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ComponentCard>
  </div>
  <div>




  </div>
</template>