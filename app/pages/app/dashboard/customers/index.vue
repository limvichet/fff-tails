<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Customers", subTitle: "Search" },
  ssr: false
})

  useHead({
    title: "Search customers",
    meta: [{ name: "customers", content: "search customers" }],
  })

import ComponentCard from "@/components/common/ComponentCard.vue"

import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"
import { formatDateForOutput } from '~/utils/date'
import { PencilIcon, TrashIcon} from "@/icons";
import { useCustomToast } from '~/composables/useCustomToast';
const { showToast } = useCustomToast();

const router = useRouter()
const { errorMsg, successMsg, success } = useMessage()
const isDeleteModal = ref(false)
const selectedCustomerId = ref<number | null>(null)

successMsg.value = null
errorMsg.value = null

// type
type Employee = {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
}

type Createdby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Updatedby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Nametitle = {
  id: number;
  nametitle_kh: string;
}

type Customer = {
  id:           number;
  cust_title_1?: number;
  nametitle1?: Nametitle;
  cust_name_1:  string;
  cust_dob_1:   null | string;
  cust_phone_1: string;
  cust_title_2?: number;
  nametitle2?: Nametitle;
  cust_name_2:  string;
  created_by: number;
  created_at: string;
  createdby: Createdby;
  updated_by: string;
  updated_at: string;
  updatedby: Updatedby;
}

type CustomerResponses = {
  current_page: number
  data: Customer[]
  per_page: number
  total: number
  last_page: number
  [key: string]: any // for extra fields like links, from, to, etc.
}

type ApiResponse = {
  success: boolean
  data: CustomerResponses
}


// State
const customers = ref<Customer[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const perPage = 10
const total = ref(0)
const lastPageValue = ref(1)


// Fetch Customers
const fetchCustomers = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>(
      "/api/admin-secure/customers",
      {
        method: "GET",
        query: {
          page: page.value,
          param: searchQuery.value || undefined,
        },
      }
    )

    customers.value = Array.isArray(res.data.data) ? res.data.data : []
    total.value = res.data.total ?? 0
    lastPageValue.value = res.data.last_page ?? 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch customers"
    customers.value = []
    total.value = 0
    lastPageValue.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCustomers()
})

// Computed
const paginated = computed(() => customers.value)

// Search (debounce)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchCustomers()
  }, 400)
})

// Pagination
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

// Edit
const editCustomer = (id: number) => {
  router.push(`/app/dashboard/customers/${id}`)
}

const openDeleteModal = (id: number) => {
  selectedCustomerId.value = id
  isDeleteModal.value = true
}

const closeDeleteModal = () => {
  isDeleteModal.value = false
  selectedCustomerId.value = null
}

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDeleteModal()
  })
})


const deleteCustomer = async () => {
  if (!selectedCustomerId.value) return

  try {
    await $fetch(`/api/admin-secure/customers/${selectedCustomerId.value}`, {
      method: "DELETE",
    })

    closeDeleteModal()
    fetchCustomers()
    success("Customer deleted successfully!")
  } catch (err) {
    errorMsg.value = "Delete failed"
    showToast(
      `Cannot delete ID #${selectedCustomerId.value}`,
      `Loans are using with this.`,
      `error`
    )

  }
}



</script>

<template>
  <div class="grid grid-cols-1">

    <!-- Search -->
    <div class="space-y-4">
      <ComponentCard title="Customers">
        <!-- Search -->
        <div class="relative">
          <!-- Icon -->
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>

          <!-- Search Input -->
          <input v-model="searchInput" type="text" placeholder="Search records..." class="input !pl-9" />
        </div>

        <!-- Messages -->
        <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
          {{ successMsg }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-6">
          Loading...
        </div>

        <!-- Table -->
        <div v-else
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="max-w-full overflow-x-auto custom-scrollbar"> 
            <table class="min-w-full">
              <!-- <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-4 py-2 text-sm font-semibold text-left w-[5%]">#</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[30%]">Name1</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[15%] w-[30%]">Name2</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[15%]">Phone1</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[0%] hidden sm:table-cell">DOB</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[0%] hidden sm:table-cell">Created At</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[10%] w-[0%] hidden sm:table-cell">Updated At</th>
                  <th class="px-2 py-2 text-sm font-semibold text-center sm:w-[25%] w-[20%]">Actions</th>
                </tr>
              </thead> -->
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-4 py-2 text-sm font-semibold text-left w-[3%]">#</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[13%] w-[40%]">Name1</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[13%] w-[40%]">Name2</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[8%] w-[20%] hidden sm:table-cell">Phone1</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[8%] w-[20%] hidden sm:table-cell">DOB</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[12%] w-[20%] hidden sm:table-cell">Created</th>
                  <th class="px-2 py-2 text-sm font-semibold text-left sm:w-[12%] w-[20%] hidden sm:table-cell">Updated</th>
                  <th class="px-2 py-2 text-sm font-semibold text-center sm:w-[15%] w-[15%]">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(c, i) in paginated" :key="c.id"
                  class="border-t border-gray-100 dark:border-gray-800 hover:bg-blue-300/20 transition">
                  <td class="px-4 py-2 text-sm">
                    {{ (page - 1) * perPage + i + 1 }}
                  </td>

                  <td class="px-1 py-2 text-sm">
                    <!-- {{ c.nametitle1.nametitle_kh}} -->
                    {{ c.nametitle1?.nametitle_kh }} {{ c.cust_name_1 }}
                  </td>

                  <td class="px-1 py-2 text-sm">
                    <!-- {{ c.nametitle1.nametitle_kh}} -->
                    {{ c.nametitle2?.nametitle_kh }} {{ c.cust_name_2 }}
                  </td>

                  <td class="px-1 py-2 text-sm hidden sm:table-cell">
                    {{ c.cust_phone_1 }}
                  </td>

                  <td class="px-1 py-2 text-sm hidden sm:table-cell">
                    {{ c.cust_dob_1 ? formatDateForOutput(new Date(c.cust_dob_1)) : "-" }}
                  </td>

                  <td class="px-1 py-2 text-sm hidden sm:table-cell">
                    <span class="font-semibold">{{ c.createdby.employee.full_name }}</span> - {{ formatDateForOutput(new Date(c.created_at)) }}
                  </td>

                  <td class="px-1 py-2 text-sm hidden sm:table-cell">
                    <span class="font-semibold">{{ c.updatedby.employee.full_name }}</span> - {{ formatDateForOutput(new Date(c.updated_at)) }}
                  </td>

                  <td class="flex items-center justify-end gap-1 px-1 py-2">
                    <div class="flex flex-wrap items-center justify-left gap-1 py-1">
                      <button @click="editCustomer(c.id)"
                        class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <!-- Pencil Icon -->
                        <component :is="PencilIcon" class="w-4 h-4" />
                        <!-- Text -->
                        <span>Edit</span>
                      </button>

                      <button @click="openDeleteModal(c.id)"
                        class="inline-flex items-center gap-0.5 px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">

                        <!-- Trash Icon -->
                        <component :is="TrashIcon" class="w-4 h-4" />

                        <!-- Text -->
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginated.length === 0">
                  <td colspan="5" class="text-center py-6">
                    No customers found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>  
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
          <button @click="prevPage" :disabled="page === 1"
            class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition cursor-pointer">
            Prev
          </button>

          <span class="text-sm text-blue-400">
            Page {{ page }} / {{ lastPageValue }}
          </span>

          <button @click="nextPage" :disabled="page === lastPageValue"
            class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition">
            Next
          </button>


        </div>
      </ComponentCard>
    </div>

    <!-- Delete Modal -->
    <div v-if="isDeleteModal" @click.self="closeDeleteModal"
      class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-50">

      <!-- BACKDROP -->
      <div class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[1px]" aria-hidden="false"></div>

      <!-- MODAL CONTENT -->
      <div
        class="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <!-- close btn -->
        <button @click="closeDeleteModal"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-blue-200 hover:text-blue-600 dark:bg-gray-700 dark:bg-white/[0.05] dark dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill="" />
          </svg>
        </button>
        <div class="px-2">
          <h6 class="mb-2 text-2xl font-semibold">
            Delete Customer
          </h6>

          <p class="mb-3 text-sm text-gray-500">
            Are you sure you want to delete this?
          </p>
        </div>
        <form class="flex flex-col">
          <div class="flex items-center gap-3 mt-6 lg:justify-end">
            <button @click="closeDeleteModal" type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark dark:hover:bg-white/[0.03] sm:w-auto">
              Cancel
            </button>
            <button @click="deleteCustomer" type="button"
              class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 sm:w-auto">
              Delete Customer
            </button>
          </div>
        </form>
      </div>

    </div>

  </div>






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
}

.text-red-500 {
  color: #f56565;
}

.text-sm {
  font-size: 12px;
}
</style>