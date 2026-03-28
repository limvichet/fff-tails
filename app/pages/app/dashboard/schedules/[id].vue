<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Schedules", subTitle: "Detail" },
  ssr: false
})

import { ref, reactive, onMounted } from "vue"
import { useRoute } from "vue-router"
import ComponentCard from "@/components/common/ComponentCard.vue"
import { useMessage } from "~/composables/useMessage"

const route = useRoute()
const { errorMsg, successMsg } = useMessage()

const loading = ref(false)

// --------------------
// Types
// --------------------
type Loanrecord = {
  id: number
  loan_startdate: string
  loan_enddate: string
  loan_totalcash: string
  loan_principle: string
  loan_interest_rate: string
  loan_peroid: number
  loantype_id: number
  loan_over_draft: string
  customer: {
    cust_name_1: string
    cust_name_2: string | null
  }
  currency: {
    currency_en: string
  }
  loantype: {
    loantype_detail: string
  }
}

type Schedule = {
  schedule_paymentnumber: number
  schedule_startdate: string
  schedule_enddate: string
  schedule_totaldays: number
  schedule_interest_rate: number
  schedule_outstanding: number
  schedule_over_draft: number
  schedule_principle: number
  schedule_interest: number
  schedule_totalpay: number
}

// --------------------
// State
// --------------------
const loan = ref<Loanrecord | null>(null)
const schedules = ref<Schedule[]>([])

// --------------------
// Fetch
// --------------------
const fetchData = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<any>(
      `/api/admin-secure/schedules/${route.params.id}`
    )

    loan.value = res.data.loanrecord
    schedules.value = res.data.schedules.data ?? []

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch schedule"
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// --------------------
// Helpers
// --------------------
const formatNumber = (val: any) =>
  Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
</script>

<template>
    
<div :key="formResetKey">

    <!-- Messages -->
    <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
        {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
        {{ successMsg }}
    </div>

    <!-- CONTENT -->
    <template v-if="loan">



        <!-- Infomation -->
        <ComponentCard title="1. Information">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                <div>
                    <label class="label">Customer</label>
                    <input class="input bg-gray-50" :value="loan.customer.cust_name_1" readonly />
                </div>

                <div>
                    <label class="label">Spouse</label>
                    <input class="input bg-gray-50" :value="loan.customer.cust_name_2" readonly />
                </div>

                <div>
                    <label class="label">Loan ID</label>
                    <input class="input bg-gray-50" :value="loan.id" readonly />
                </div>

                <div>
                    <label class="label">Currency</label>
                    <input class="input bg-gray-50" :value="loan.currency.currency_en" readonly />
                </div>

                <div>
                    <label class="label">Start Date</label>
                    <input class="input bg-gray-50" :value="loan.loan_startdate" readonly />
                </div>

                <div>
                    <label class="label">End Date</label>
                    <input class="input bg-gray-50" :value="loan.loan_enddate" readonly />
                </div>

                <div>
                    <label class="label">Total Cash</label>
                    <input class="input bg-gray-50" :value="loan.loan_totalcash" readonly />
                </div>

                <div>
                    <label class="label">Principle</label>
                    <input class="input bg-gray-50" :value="loan.loan_principle" readonly />
                </div>

                <div>
                    <label class="label">Interest Rate</label>
                    <input class="input bg-gray-50" :value="loan.loan_interest_rate" readonly />
                </div>

                <div>
                    <label class="label">Period</label>
                    <input class="input bg-gray-50" :value="loan.loan_peroid" readonly />
                </div>

                <div>
                    <label class="label">Loan Type</label>
                    <input class="input bg-gray-50" :value="loan.loantype.loantype_detail" readonly />
                </div>

                <div>
                    <label class="label">Over Draft</label>
                    <input class="input bg-gray-50" :value="loan.loan_over_draft" readonly />
                </div>

            </div>

        </ComponentCard>

        <!-- ================= SCHEDULE TABLE ================= -->
        <ComponentCard title="2. Schedule List" class="mt-3">

            <div
                class="max-w-full overflow-x-auto custom-scrollbar rounded-xl border border-gray-200 dark:border-gray-800">

                <table class="min-w-full text-sm text-left">

                    <!-- HEADER -->
                    <thead class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">#</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Start</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">End</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Days</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Rate</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Outstanding</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Principle</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Interest</th>
                            <th class="px-3 py-3 font-semibold text-blue-900 dark:text-gray-200">Total</th>
                        </tr>
                    </thead>

                    <!-- BODY -->
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

                        <tr v-for="(s, i) in schedules" :key="i"
                            class="hover:bg-blue-50 dark:hover:bg-white/5 transition">
                            <td class="px-3 py-2 font-medium text-gray-500">
                                {{ i + 1 }}
                            </td>

                            <td class="px-3 py-2">
                                {{ s.schedule_startdate }}
                            </td>

                            <td class="px-3 py-2">
                                {{ s.schedule_enddate }}
                            </td>

                            <td class="px-3 py-2 text-center">
                                {{ s.schedule_totaldays }}
                            </td>

                            <td class="px-3 py-2 text-right">
                                {{ formatNumber(s.schedule_interest_rate) }}
                            </td>

                            <td class="px-3 py-2 text-right">
                                {{ formatNumber(s.schedule_outstanding) }}
                            </td>

                            <td class="px-3 py-2 text-right">
                                {{ formatNumber(s.schedule_principle) }}
                            </td>

                            <td class="px-3 py-2 text-right">
                                {{ formatNumber(s.schedule_interest) }}
                            </td>

                            <td class="px-3 py-2 text-right text-blue-600">
                                {{ formatNumber(s.schedule_totalpay) }}
                            </td>
                        </tr>

                        <!-- EMPTY -->
                        <tr v-if="schedules.length === 0">
                            <td colspan="9" class="text-center py-8 text-gray-400">
                                No schedules found.
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>

        </ComponentCard>

    </template>

</div>
</template>

<style scoped>
.label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 10px;
}
</style>