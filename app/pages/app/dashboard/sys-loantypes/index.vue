<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import ComponentCardPlus from "@/components/common/ComponentCardPlus.vue"
import { PencilIcon } from "@/icons"
import { PER_PAGE } from "~/constants/pagination"
import { formatDateForOutput } from "~/utils/date"
import { useMessage } from "~/composables/useMessage"
import { useCustomToast } from "~/composables/useCustomToast"

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Data Administration", subTitle: "Loantypes" },
  ssr: false,
})

useHead({
  title: "System Loantypes",
  meta: [{ name: "description", content: "System loantypes administration" }],
})

/* =========================
   TYPES
========================= */
interface Employee {
  id: number
  surname: string
  first_name: string
  full_name: string
}

interface UserInfo {
  id: number
  emp_id: number
  employee: Employee
}

interface SysLoantype {
  id: number
  loantype_kh: string
  loantype_en: string
    loantype_detail: string;
    loantype_short: string;
    loantype_shortcut: string;
  active: number | string
  created_by: number
  created_at: string
  updated_by: number
  updated_at: string
  createdby: UserInfo
  updatedby: UserInfo
}

interface ApiResponse {
  success: boolean
  data: {
    current_page: number
    data: SysLoantype[]
    per_page: number
    total: number
    last_page: number
  }
}

/* =========================
   STATE & COMPOSABLES
========================= */
const { errorMsg, successMsg } = useMessage()
const { showToast } = useCustomToast()

const sysLoantypes = ref<SysLoantype[]>([])
const loading = ref(false)
const formLoading = ref(false)
const isEditMode = ref(false)
const isCreateModal = ref(false)
const selectedId = ref<number | null>(null)

// Search & Pagination
const searchInput = ref("")
const searchQuery = ref("")
const page = ref(1)
const perPage = PER_PAGE
const total = ref(0)
const lastPageValue = ref(1)

// Form Management
const form = ref({
  loantype_kh: "",
  loantype_en: "",
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
  active: 1,
})

const formErrors = ref({
  loantype_kh: "",
  loantype_en: "",
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
})

/* =========================
   METHODS
========================= */
const fetchSysLoantypes = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/sys-loantypes", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
      },
    })

    sysLoantypes.value = res.data.data ?? []
    total.value = res.data.total ?? 0
    lastPageValue.value = res.data.last_page ?? 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch loantypes"
    sysLoantypes.value = []
  } finally {
    loading.value = false
  }
}

// Debounced Search Handler
let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = newVal
    page.value = 1
    fetchSysLoantypes()
  }, 400)
})

const changePage = async (newPage: number) => {
  if (newPage < 1 || newPage > lastPageValue.value) return
  page.value = newPage
  await fetchSysLoantypes()
}

const validateForm = () => {
  formErrors.value = {
    loantype_kh: "",
    loantype_en: "",
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
  }

  let valid = true

  if (!form.value.loantype_kh?.trim()) {
    formErrors.value.loantype_kh = "Required"
    valid = false
  }

  if (!form.value.loantype_en?.trim()) {
    formErrors.value.loantype_en = "Required"
    valid = false
  }

  if (!form.value.loantype_detail?.trim()) {
    formErrors.value.loantype_detail = "Required"
    valid = false
  }

  if (!form.value.loantype_short?.trim()) {
    formErrors.value.loantype_short = "Required"
    valid = false
  }

  if (!form.value.loantype_shortcut?.trim()) {
    formErrors.value.loantype_shortcut = "Required"
    valid = false
  }

  return valid
}

const saveSysLoantype = async () => {
  if (!validateForm()) return

  formLoading.value = true
  errorMsg.value = null

  try {
    const formData = new FormData()
    formData.append("loantype_kh", form.value.loantype_kh.trim())
    formData.append("loantype_en", form.value.loantype_en.trim())
    formData.append("loantype_detail", form.value.loantype_detail.trim())
    formData.append("loantype_short", form.value.loantype_short.trim())
    formData.append("loantype_shortcut", form.value.loantype_shortcut.trim())
    formData.append("active", String(form.value.active))

    if (isEditMode.value && selectedId.value) {
      formData.append("_method", "PUT")
      await $fetch(`/api/admin-secure/sys-loantypes/${selectedId.value}`, {
        method: "POST",
        body: formData,
      })
      showToast("Update successful", "Data updated successfully", "success")
    } else {
      await $fetch("/api/admin-secure/sys-loantypes", {
        method: "POST",
        body: formData,
      })
      showToast("Create successful", "Data saved successfully", "success")
    }

    closeModal()
    await fetchSysLoantypes()
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Save failed"
    showToast("Error", "Something went wrong", "error")
  } finally {
    formLoading.value = false
  }
}

const openEditModal = (item: SysLoantype) => {
  formErrors.value = {
    loantype_kh: "",
    loantype_en: "",
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
  }

  isEditMode.value = true
  isCreateModal.value = true
  selectedId.value = item.id

  form.value = {
    loantype_kh: item.loantype_kh ?? "",
    loantype_en: item.loantype_en ?? "",
    loantype_detail: item.loantype_detail ?? "",
    loantype_short: item.loantype_short ?? "",
    loantype_shortcut: item.loantype_shortcut ?? "",
    active: Number(item.active),
  }
}

const resetForm = () => {
  form.value = { 
    loantype_kh: "", 
    loantype_en: "",     
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
    active: 1 
  }
  formErrors.value = { 
    loantype_kh: "", 
    loantype_en: "",
    loantype_detail: "",
    loantype_short: "",
    loantype_shortcut: "",
  }
  selectedId.value = null
  isEditMode.value = false
}

const closeModal = () => {
  isCreateModal.value = false
  resetForm()
}

onMounted(fetchSysLoantypes)
</script>

<template>
  <div class="grid grid-cols-1">
    <ComponentCardPlus title="System Loan Types" :hasAdd="true" @add="isCreateModal = true">

      <div class="relative">
        <!-- Icon -->
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
        </svg>

        <!-- Search Input -->
        <input v-model="searchInput" type="text" placeholder="Search ..." class="input !pl-9" />
      </div>

      <div v-if="errorMsg" class="mb-2 text-red-500 text-sm font-medium">
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="mb-2 text-green-500 text-sm font-medium">
        {{ successMsg }}
      </div>

      <div v-if="loading" class="py-12 text-center text-gray-500">
        Loading data, please wait...
      </div>

      <div v-else
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[2%]">#
                </th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[15%]">Khmer</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[10%]">English</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[20%]">Details</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[5%]">Short</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[5%]">Shortcut</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[5%]">
                  Status</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[15%]">
                  Created</th>
                <th scope="col" class="px-2 py-2 text-left text-sm font-semibold uppercase tracking-wider w-[15%]">
                  Updated</th>
                <th scope="col" class="px-2 py-2 text-center text-sm font-semibold uppercase tracking-wider w-[5%]">
                  Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(item, i) in sysLoantypes" :key="item.id"
                class="border-t border-gray-100 dark:border-gray-800 hover:bg-blue-300/20 transition">
                <td class="px-4 py-3 text-sm font-medium">
                  {{ (page - 1) * perPage + i + 1 }}
                </td>
                <td class="px-2 py-3 text-sm">{{ item.loantype_kh }}</td>
                <td class="px-2 py-3 text-sm">{{ item.loantype_en }}</td>
                <td class="px-2 py-3 text-sm">{{ item.loantype_detail }}</td>
                <td class="px-2 py-3 text-sm">{{ item.loantype_short }}</td>
                <td class="px-2 py-3 text-sm">{{ item.loantype_shortcut }}</td>
                <td class="px-2 py-3 text-sm">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="Number(item.active) === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'">
                    {{ Number(item.active) === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-2 py-3 text-xs">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.createdby?.employee?.full_name ||
                    'N/A' }}</span> - <span class="mt-0.5">{{ formatDateForOutput(new Date(item.created_at)) }}</span>
                </td>
                <td class="px-2 py-3 text-xs">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.updatedby?.employee?.full_name ||
                    'N/A' }}</span> - <span class="mt-0.5">{{ formatDateForOutput(new Date(item.updated_at)) }}</span>
                </td>
                <td class="px-2 py-3 text-center">
                  <button @click="openEditModal(item)"
                    class="inline-flex items-center gap-1 px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">

                    <component :is="PencilIcon" class="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>

              <tr v-if="sysLoantypes.length === 0">
                <td colspan="7" class="text-center py-12 text-sm text-gray-400">
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button @click="changePage(page - 1)" :disabled="page === 1"
          class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition cursor-pointer">
          >
          Prev
        </button>
        <div class="text-sm text-blue-600 dark:text-blue-400">
          Page {{ page }} / {{ lastPageValue }}
        </div>
        <button @click="changePage(page + 1)" :disabled="page === lastPageValue"
          class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50 hover:bg-blue-700/40 transition cursor-pointer">
          Next
        </button>
      </div>

    </ComponentCardPlus>


    <!-- Create/Edit Modal -->
    <Transition name="fade">
      <div v-if="isCreateModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl shadow-xl">

          <h2 class="text-xl font-semibold mb-4 text-blue-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {{ isEditMode ? "Edit" : "Create" }}
          </h2>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between">
                <label class="label">Title (KH) <span class="text-red-500 text-sm"> *</span></label>
                <span v-if="formErrors.loantype_kh" class="text-red-500 text-xs mt-1">{{ formErrors.loantype_kh
                  }}</span>
              </div>
              <input v-model="form.loantype_kh" placeholder="Enter text ..." class="input" />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label class="label">Title (EN) <span class="text-red-500 text-sm"> *</span></label>
                <span v-if="formErrors.loantype_en" class="text-red-500 text-xs mt-1">{{ formErrors.loantype_en }}</span>
              </div>
              <input v-model="form.loantype_en" placeholder="Enter text ..." class="input" />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label class="label">Details <span class="text-red-500 text-sm"> *</span></label>
                <span v-if="formErrors.loantype_detail" class="text-red-500 text-xs mt-1">{{ formErrors.loantype_detail }}</span>
              </div>
              <input v-model="form.loantype_detail" placeholder="Enter text ..." class="input" />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label class="label">Short <span class="text-red-500 text-sm"> *</span></label>
                <span v-if="formErrors.loantype_short" class="text-red-500 text-xs mt-1">{{ formErrors.loantype_short }}</span>
              </div>
              <input v-model="form.loantype_short" placeholder="Enter text ..." class="input" />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label class="label">Shortcut <span class="text-red-500 text-sm"> *</span></label>
                <span v-if="formErrors.loantype_shortcut" class="text-red-500 text-xs mt-1">{{ formErrors.loantype_shortcut }}</span>
              </div>
              <input v-model="form.loantype_shortcut" placeholder="Enter text ..." class="input" />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1 text-gray-500">Status</label>
              <select v-model.number="form.active" class="input">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 font-medium rounded-lg hover:opacity-90 transition text-sm">
              Cancel
            </button>
            <button @click="saveSysLoantype" :disabled="formLoading"
              class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm">
              {{ formLoading ? "Saving..." : (isEditMode ? "Update" : "Save") }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.dark) .input {
  border-color: #334155;
  color: #fff;
}
</style>