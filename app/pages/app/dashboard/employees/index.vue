<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"
import ComponentCard from "@/components/common/ComponentCard.vue"
import { PencilIcon, TrashIcon } from "@/icons"
import { formatDateForOutput } from "~/utils/date"

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Employees", subTitle: "Search" },
  ssr: false
})

useHead({
  title: "Search Employees",
  meta: [{ name: "descrription", content: "search employees" }],
})

const router = useRouter()
const { errorMsg, successMsg, success } = useMessage()
const isDeleteModal = ref(false)
const selectedEmployeeId = ref<number | null>(null)

// Types
interface Role {
  id: number;
  name: string;
}

interface Gender {
  id: number;
  gender_kh: string;
}

interface Employee {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
  dob: null | string;
  phone: string;
  gender_id: number;
  role_id: number;
  role?: Role;
  gender: Gender;
  hire_date: string | null;
  status_id: number;
  created_at: string;
  updated_at: string;
  createdby?: { employee: { full_name: string } };
}

interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Employee[];
    total: number;
    last_page: number;
  }
}

// State
const employees = ref<Employee[]>([])
const loading = ref(false)
const searchInput = ref("")
const searchQuery = ref("")
const page = ref(1)
const perPage = 10
const total = ref(0)
const lastPageValue = ref(1)

// Fetch Employees
const fetchEmployees = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/employees", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
      },
    })

    employees.value = res.data.data || []
    total.value = res.data.total || 0
    lastPageValue.value = res.data.last_page || 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch employees"
    employees.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchEmployees)

// Search with Debounce
let debounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchEmployees()
  }, 400)
})

// Navigation
const changePage = (p: number) => {
  page.value = p
  fetchEmployees()
}

const editEmployee = (id: number) => router.push(`/app/dashboard/employees/${id}`)

const openDeleteModal = (id: number) => {
  selectedEmployeeId.value = id
  isDeleteModal.value = true
}

const closeModal = () => {
  isDeleteModal.value = false
  selectedEmployeeId.value = null
}

const deleteEmployee = async () => {
  if (!selectedEmployeeId.value) return
  try {
    await $fetch(`/api/admin-secure/employees/${selectedEmployeeId.value}`, { method: "DELETE" })
    closeModal()
    fetchEmployees()
    success("Employee removed successfully")
  } catch (err) {
    errorMsg.value = "Delete operation failed"
  }
}
</script>

<template>
  <div class="grid grid-cols-1">
    <div class="space-y-4">
      <ComponentCard title="Employees">
        
        <div class="relative mb-4">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
          <input v-model="searchInput" type="text" placeholder="Search by name, phone or position..." class="input !pl-9" />
        </div>

        <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/10 text-red-500 text-sm border border-red-500/20">{{ errorMsg }}</div>
        <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20">{{ successMsg }}</div>

        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-gray-700 text-left">
                  <th class="px-4 py-3 text-xs font-bold uppercase w-[5%]">#</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[20%]">Name</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[5%]">Gender</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[15%]">Dob</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[20%]">Position</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[15%]">Phone</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[15%]">Hire Date</th>
                  <th class="px-2 py-3 text-xs font-bold uppercase w-[10%]">Status</th>
                  <th class="px-4 py-3 text-xs font-bold uppercase">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(emp, index) in employees" :key="emp.id" class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition">
                  <td class="px-4 py-2 text-sm text-gray-500">{{ (page - 1) * perPage + index + 1 }}</td>
                  <td class="px-2 py-2 text-sm font-medium text-gray-900 dark:text-white">{{ emp.surname }} {{ emp.first_name }}</td>
                  <td class="px-2 py-2 text-sm text-gray-600 dark:text-gray-300">{{ emp.gender.gender_kh }}</td>
                  <td class="px-2 py-2 text-sm text-gray-600 dark:text-gray-300">{{ emp.dob ? formatDateForOutput(new Date(emp.dob)) : "-" }}</td>
                  <td class="px-2 py-2 text-sm hidden sm:table-cell">
                    <span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
                      {{ emp.role?.name || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-2 py-2 text-sm text-center font-mono text-gray-600 dark:text-gray-300 text-left">{{ emp.phone }}</td>
                  <td class="px-2 py-2 text-sm hidden lg:table-cell text-gray-500">{{ emp.hire_date ? formatDateForOutput(new Date(emp.hire_date)) : "-" }}</td>
                  <td class="px-2 py-2 text-sm hidden lg:table-cell text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="Number(emp.status_id) === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'">
                      {{ Number(emp.status_id) === 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  
                  <td class="px-4 py-2">
                    <div class="flex justify-end gap-2">
                      <button @click="editEmployee(emp.id)" class="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition" aria-label="Edit employee">
                        <component :is="PencilIcon" class="w-4 h-4" />
                      </button>
                      <button @click="openDeleteModal(emp.id)" class="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition" aria-label="Delete employee">
                        <component :is="TrashIcon" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!loading && employees.length === 0">
                  <td colspan="9" class="text-center py-10 text-gray-400 italic">No employees found in the system.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <button @click="changePage(page - 1)" :disabled="page === 1" class="btn-pagination disabled:opacity-50">Prev</button>
          <span class="text-sm">Page {{ page }} / {{ lastPageValue }} Total Records: <b>{{ total }}</b></span>
          <button @click="changePage(page + 1)" :disabled="page === lastPageValue" class="btn-pagination disabled:opacity-50">Next</button>
        </div>

      </ComponentCard>
    </div>

    <div v-if="isDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Confirm Removal</h3>
        <p class="text-gray-500 text-sm mb-6">Are you sure you want to remove this employee from the directory? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-white">Cancel</button>
          <button @click="deleteEmployee" class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Delete Permanently</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
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