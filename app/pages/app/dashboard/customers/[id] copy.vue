<template>
    <!-- Messages -->
    <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
      {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
      {{ successMsg }}
    </div>

  <div v-if="customer" class="space-y-4">
    <ComponentCard title="Customer Detail">

      <div><strong>ID:</strong> {{ customer.id }}</div>
      <div><strong>Name:</strong> {{ customer.cust_name_1 }}</div>
      <div><strong>Phone:</strong> {{ customer.cust_phone_1 }}</div>
      <div><strong>Address:</strong> {{ customer.cust_address }}</div>

    </ComponentCard>
  </div>

  <div v-else class="text-center py-10">
    Loading...
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import ComponentCard from "@/components/common/ComponentCard.vue"
import type { Customer } from "~/types/customer"
const { successMsg, errorMsg } = useMessage()

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Customers", subTitle: "Detail" },
  ssr: false
})

const route = useRoute()
const id = route.params.id

type ApiResponse<T> = {
  success: boolean
  data: T
}

const { data } = await useAsyncData<ApiResponse<Customer>>(
  `customer-${id}`,
  () => $fetch(`/api/admin-secure/customers/${id}`)
)

const customer = computed(() => data.value?.data)


</script>
