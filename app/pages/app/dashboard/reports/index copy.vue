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
  title: "Reports Filter",
})

interface ReportsFormDataResponse {
  loantype: Record<string, string>
  loanstatus: Record<string, string>
}

const filters = reactive({
  loan_startdate: "",
  loan_enddate: "",
  loantype_id: "",
  loan_status_id: "1", // Current loan selected by default
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

const submitFilter = () => {
  console.log(filters)

  // Example:
  // navigateTo({
  //   path: '/reports/result',
  //   query: filters
  // })
}
</script>

<template>
  <div class="grid grid-cols-1">
    <ComponentCard title="Filter">

      <!-- Loading -->
      <div v-if="pending" class="py-8 text-center text-gray-500">
        Loading report data...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-8 text-center">
        <p class="mb-3 text-red-500">
          Failed to load report data.
        </p>

        <button class="btn" @click="refresh()">
          Retry
        </button>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="submitFilter">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <!-- Start Date -->
          <div>
            <label class="label">
              Start Date
              <span class="text-red-500">*</span>
            </label>

            <input v-model="filters.loan_startdate" type="date" class="input" />
          </div>

          <!-- End Date -->
          <div>
            <label class="label">
              End Date
              <span class="text-red-500">*</span>
            </label>

            <input v-model="filters.loan_enddate" type="date" class="input" />
          </div>

          <!-- Loan Type -->
          <div>
            <label class="label">
              Loan Type
              <span class="text-red-500">*</span>
            </label>

            <select v-model="filters.loantype_id" class="input">
              <option value="" disabled>
                Choose...
              </option>

              <option v-for="(label, id) in formData.loantype" :key="id" :value="id">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="label">
              Status
              <span class="text-red-500">*</span>
            </label>

            <select v-model="filters.loan_status_id" class="input">
              <option value="" disabled>
                Choose...
              </option>

              <option v-for="(label, id) in formData.loanstatus" :key="id" :value="id">
                {{ label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end">
          <button type="submit" class="btn">
            Generate Report
          </button>
        </div>
      </form>

    </ComponentCard>
  </div>
</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
}

.btn-pagination {
  padding: 6px 12px;
  border: 1px solid #ddd;
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
</style>