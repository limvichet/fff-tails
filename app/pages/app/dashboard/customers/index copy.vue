<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Customers", subTitle: "Search" },
  ssr: false
})

import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"

const router = useRouter()
const { errorMsg } = useMessage()

// --------------------
// Types
// --------------------
type Customer = {
  id: number
  cust_title_1: number
  cust_name_1: string
  cust_dob_1: string | null
  cust_phone_1: string
}

type PaginatedCustomers = {
  current_page: number
  data: Customer[]
  per_page: number
  total: number
  last_page: number
}

// --------------------
// State
// --------------------
const customers = ref<Customer[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const perPage = 10
const total = ref(0)
const lastPageValue = ref(1)

// --------------------
// Fetch Customers
// --------------------
const fetchCustomers = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<PaginatedCustomers>(
      "/api/admin-secure/customers",
      {
        method: "GET",
        query: {
          page: page.value,
          param: searchQuery.value || undefined,
        },
      }
    )

    customers.value = Array.isArray(res.data) ? res.data : []
    total.value = res.total ?? 0
    lastPageValue.value = res.last_page ?? 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch customers"
    customers.value = []
    total.value = 0
    lastPageValue.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(fetchCustomers)

// --------------------
// Computed
// --------------------
const paginated = computed(() => customers.value)

// --------------------
// Search (debounce)
// --------------------
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchCustomers()
  }, 400)
})

// --------------------
// Pagination
// --------------------
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchCustomers()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchCustomers()
  }
}

// --------------------
// Edit
// --------------------
const editCustomer = (id: number) => {
  router.push(`/app/dashboard/customers/${id}`)
}
</script>

<template>
  <div class="p-4 min-h-screen bg-[#0f172a] text-gray-100">
    <div
      class="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-lg shadow-emerald-900/20"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1
          class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500"
        >
          Customers
        </h1>
      </div>

      <!-- Error -->
      <div
        v-if="errorMsg"
        class="mb-4 p-2 rounded bg-red-500/20 text-red-300 text-sm"
      >
        {{ errorMsg }}
      </div>

      <!-- Search -->
      <div class="flex gap-2 mb-6">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search customers..."
          class="flex-1 p-2.5 rounded-lg border border-gray-700 bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-400 py-6">
        Loading...
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left text-gray-300 border-b border-gray-700">
              <th class="py-3 px-3 text-sm font-semibold">#</th>
              <th class="py-3 px-3 text-sm font-semibold">Name</th>
              <th class="py-3 px-3 text-sm font-semibold">Phone</th>
              <th class="py-3 px-3 text-sm font-semibold">DOB</th>
              <th class="py-3 px-3 text-sm font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(c, i) in paginated"
              :key="c.id"
              class="border-b border-gray-700/50 hover:bg-gray-700/20 transition"
            >
              <td class="py-3 px-3 text-sm text-gray-400">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="py-3 px-3 font-medium">
                {{ c.cust_name_1 }}
              </td>

              <td class="py-3 px-3 text-gray-400">
                {{ c.cust_phone_1 }}
              </td>

              <td class="py-3 px-3 text-gray-400">
                {{ c.cust_dob_1 || "-" }}
              </td>

              <td class="py-3 px-3 text-right">
                <button
                  @click="editCustomer(c.id)"
                  class="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-400">
                No customers found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 rounded-lg border border-gray-700 bg-gray-900/60 disabled:opacity-50 hover:bg-gray-700/40 transition"
        >
          Prev
        </button>

        <span class="text-sm text-gray-400">
          Page {{ page }} / {{ lastPageValue }}
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPageValue"
          class="px-4 py-2 rounded-lg border border-gray-700 bg-gray-900/60 disabled:opacity-50 hover:bg-gray-700/40 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>