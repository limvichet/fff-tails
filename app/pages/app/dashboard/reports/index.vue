<script setup lang="ts">
import ComponentCard from "@/components/common/ComponentCard.vue"

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: {
    title: "Reports",
    subTitle: "Filter",
  },
  ssr: false,
})

useHead({
  title: "Generate Reports",
})

interface ReportsFormDataResponse {
  loantype: Record<string, string>
  loanstatus: Record<string, string>
}

const reports = [
  {
    icon: "💵",
    name: "Income",
    url: "/app/dashboard/reports/income",
  },
  {
    icon: "💳",
    name: "Cashin",
    url: "/app/dashboard/reports/cashin",
  },
  {
    icon: "🏦",
    name: "Preless",
    url: "/app/dashboard/reports/preless",
  },
  {
    icon: "📄",
    name: "Optional",
    url: "/app/dashboard/reports/optional",
  },
  {
    icon: "📉",
    name: "Debt",
    url: "/app/dashboard/reports/debt",
  },
]

const private_reports = [
  {
    icon: "📉",
    name: "Net Outstanding",
    url: "/app/dashboard/reports/netoutstanding",
  },
]

const router = useRouter()

function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const filters = reactive({
  loan_startdate: getCurrentDate(),
  loan_enddate: getCurrentDate(),
  loantype_id: "",
  loan_status_id: "1",
})

const {
  data: formData,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "reports-form-data",
  () =>
    $fetch<ReportsFormDataResponse>(
      "/api/admin-secure/reports-form-data"
    ),
  {
    default: () => ({
      loantype: {},
      loanstatus: {},
    }),
  }
)

function openReport(url: string) {
  const reportUrl = router.resolve({
    path: url,
    query: {
      loan_startdate: filters.loan_startdate,
      loan_enddate: filters.loan_enddate,
      loan_status_id: filters.loan_status_id || undefined,
      loantype_id: filters.loantype_id || undefined,
    },
  }).href
  window.open(reportUrl, "_blank")
}



</script>

<template>
  <div class="grid grid-cols-1">
    <ComponentCard title="Income Report Filter">

      <!-- Loading -->
      <div v-if="pending" class="py-10 text-center text-gray-500">
        Loading report data...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-10 text-center">
        <p class="mb-4 text-red-500">
          Failed to load report data.
        </p>

        <a href="#" class="btn" @click.prevent="() => refresh()">
          Retry
        </a>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <!-- Start Date -->
          <div>
            <label class="label">
              Start
              <span class="required">*</span>
            </label>

            <input v-model="filters.loan_startdate" type="date" class="input" />
          </div>

          <!-- End Date -->
          <div>
            <label class="label">
              End
              <span class="required">*</span>
            </label>

            <input v-model="filters.loan_enddate" type="date" class="input" />
          </div>

          <!-- Loan Type -->
          <div>
            <label class="label">
              Type
            </label>

            <select v-model="filters.loantype_id" class="input">
              <option value="">
                All Loan Types
              </option>

              <option v-for="(label, id) in formData.loantype" :key="id" :value="id">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Loan Status -->
          <div>
            <label class="label">
              Status
            </label>

            <select v-model="filters.loan_status_id" class="input">
              <option value="">
                All Status
              </option>

              <option v-for="(label, id) in formData.loanstatus" :key="id" :value="id">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
      </div>

    </ComponentCard>

    <CommonComponentCard title="Generate Reports" class="mt-5">
      <div class="flex flex-row  justify-between gap-3 px-5">
        <a v-for="report in reports" :key="report.name" :href="report.url" target="_blank" rel="noopener noreferrer"
          @click="openReport(report.url)" class="flex cursor-pointer items-center gap-2 text-primary hover:underline">
          <span class="text-2xl">{{ report.icon }}</span>
          <span>{{ report.name }}</span>
        </a>
      </div>
    </CommonComponentCard>

    <CommonComponentCard title="Private Reports" class="mt-5">
      <div class="flex flex-row  justify-between gap-3 px-5">
        <a v-for="report in private_reports" :key="report.name" :href="report.url" target="_blank" rel="noopener noreferrer"
          @click="openReport(report.url)" class="flex cursor-pointer items-center gap-2 text-primary hover:underline">
          <span class="text-2xl">{{ report.icon }}</span>
          <span>{{ report.name }}</span>
        </a>
      </div>
    </CommonComponentCard>

  </div>
</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.required {
  color: #ef4444;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
}

.generate-reports {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.generate-reports h2 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.generate-reports a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.generate-reports a:hover {
  background-color: #eff6ff;
  color: #2563eb;
  text-decoration: underline;
}

.generate-reports a span {
  font-weight: 500;
}
</style>