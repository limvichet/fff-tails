<script setup lang="ts">

  definePageMeta({
    layout: "auth",
    requiresAuth: true,
    breadcrumb: { title: "Loans", subTitle: "Search" },
    ssr: false
  })

  useHead({
    title: "Search loans",
    meta: [{ name: "loanrecords", content: "search loan records" }],
  })

import ComponentCard from "@/components/common/ComponentCard.vue"

import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"
import { formatDateForOutput } from '~/utils/date'
import { formatNumber } from '~/utils/number'
import { useCustomToast } from '~/composables/useCustomToast';
const { showToast } = useCustomToast();


const router = useRouter()
const { errorMsg, successMsg, success } = useMessage()

const isDeleteModal = ref(false)
const selectedLoanId = ref<number | null>(null)



// print option menu
import { ChevronDown, Printer } from "lucide-vue-next"

const openId = ref<number | null>(null)
const menuRefs = ref<Record<number, HTMLElement | null>>({})

const toggleMenu = (id: number) => {
  openId.value = openId.value === id ? null : id
}

const setMenuRef = (id: number, el: HTMLElement | null) => {
  menuRefs.value[id] = el
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node

  const isInside = Object.values(menuRefs.value).some(
    (el) => el && el.contains(target)
  )

  if (!isInside) {
    openId.value = null
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})





successMsg.value = null
errorMsg.value = null


// Types
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

type  Nametitle1 = {
    id:           number;
    nametitle_kh: string;
}
type Customer = {
    id:           number;
    cust_name_1:  string;
    cust_title_1: number;
    nametitle1:   Nametitle1;
}
type Currency = {
    id:          number;
    currency_en: string;
}
type Loantype = {
    id:             number;
    loantype_short?: string;
}
type LoanRecord = {
    id:                number;
    loan_lastcash:     string;
    loan_newcash:      string;
    loan_totalcash:    string;
    cust_id:           number;
    loantype_id?:       number;
    loan_status_id:    number;
    currency_id:       number;
    loan_check_status: number;
    customer:          Customer;
    currency:          Currency;
    loantype?:          Loantype;
    created_by: number;
    created_at: string;
    createdby: Createdby;
    updated_by: string;
    updated_at: string;
    updatedby: Updatedby;
    count_schedule: number
}
type LoanrecordResponses = {
  current_page: number
  data: LoanRecord[]
  per_page: number
  total: number
  last_page: number
}

type ApiResponse = {
  success: boolean
  data: LoanrecordResponses
}

// --------------------
// State
// --------------------
const loanrecords = ref<LoanRecord[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const perPage = 30
const total = ref(0)
const lastPageValue = ref(1)

// --------------------
// Fetch
// --------------------
const fetchLoanrecords = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const { data } = await $fetch<ApiResponse>(
      "/api/admin-secure/loanrecords",
      {
        method: "GET",
        query: {
          page: page.value,
          param: searchQuery.value || undefined,
        },
      }
    )

    loanrecords.value = Array.isArray(data.data) ? data?.data : []
    total.value = data.total ?? 0
    lastPageValue.value = data.last_page ?? 1
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch loan records"
    loanrecords.value = []
    total.value = 0
    lastPageValue.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(fetchLoanrecords)

// --------------------
// Computed
// --------------------
const paginated = computed(() => loanrecords.value)

// --------------------
// Search (debounce)
// --------------------
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchLoanrecords()
  }, 400)
})

// --------------------
// Pagination
// --------------------
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchLoanrecords()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchLoanrecords()
  }
}

// --------------------
// Edit
// --------------------
const editLoan = (id: number) => {
  router.push(`/app/dashboard/loanrecords/${id}`)
}

// --------------------
// Delete Modal
// --------------------
const openDeleteModal = (id: number) => {
  selectedLoanId.value = id
  isDeleteModal.value = true
}

const closeDeleteModal = () => {
  isDeleteModal.value = false
  selectedLoanId.value = null
}

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDeleteModal()
  })
})

// --------------------
// Delete
// --------------------
const deleteLoan = async () => {
  if (!selectedLoanId.value) return

  try {
    await $fetch(`/api/admin-secure/loanrecords/${selectedLoanId.value}`, {
      method: "DELETE",
    })

    closeDeleteModal()
    fetchLoanrecords()
    success("Loan record deleted successfully!")
  } catch (err) {
    errorMsg.value = "Delete failed"
    showToast(
      `Cannot delete ID #${selectedLoanId.value}`,
      `Schedules are using with this.`,
      `error`
    )
  }
}

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone/i.test(navigator.userAgent)
})


</script>

<template>
  <div class="grid grid-cols-1">

    <ComponentCard title="Loan Records">

      <!-- Search -->
      <div class="relative">
        <!-- Icon -->
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>

        <!-- Search Input -->
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search records..."
          class="input !pl-9 text-sm"
        />
      </div>

      <!-- Messages -->
      <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
        {{ successMsg }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-400 py-6">
        Loading...
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-2 py-3 text-left text-sm w-[2%]">#</th>
                <th class="px-1 py-3 text-left text-sm w-[3%]">Loan</th>
                <th class="px-1 py-3 text-left text-sm w-[12%]">Customer</th>
                <th class="px-1 py-3 text-left text-sm w-[12%]">New</th>
                <th class="px-1 py-3 text-left text-sm w-[12%]">Total</th>
                <th class="px-1 py-3 text-left text-sm w-[13%]">Created</th>
                <th class="px-1 py-3 text-left text-sm w-[13%]">Updated</th>
                <th class="px-5 py-3 text-left text-sm w-[10%]">Contracts</th>
                <th class="px-5 py-3 text-left text-sm w-auto">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(l, i) in paginated"
                :key="l.id"
                class="hover:bg-blue-300/20 transition"
              >
                <td class="px-2 py-1 text-sm text-gray-400">
                  {{ (page - 1) * perPage + i + 1 }}
                </td>

                <td class="px-1 py-1 text-sm">
                  {{ l.id }}({{ l?.loantype?.loantype_short ??  '' }})
                </td>

                <td class="px-2 py-1 text-sm">
                  {{ l.customer.nametitle1.nametitle_kh }} {{ l.customer.cust_name_1 }}
                </td>

                <td class="px-1 py-1 text-sm">
                  {{ formatNumber(Number(l.loan_newcash || 0)) }}
                </td>

                <td class="px-1 py-1 text-sm">
                  {{ formatNumber(Number(l.loan_totalcash || 0)) }}
                </td>

                  <td class="px-1 py-2 text-sm">
                    <span>{{ l.createdby.employee.full_name }} - {{ formatDateForOutput(new Date(l.created_at)) }} </span>
                  </td>
                  <td class="px-1 py-2 text-sm">
                    <span>{{ l.updatedby.employee.full_name }} - {{ formatDateForOutput(new Date(l.updated_at)) }} </span> 
                  </td>

                <!-- contacts -->
                <td class="px-1 py-1 text-sm">
                  <div v-if="l.count_schedule > 0" class="flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6">


                    <div :ref="(el) => setMenuRef(l.id, el as HTMLElement)" class="relative inline-block">
                      <!-- Button -->
                      <button @click.stop="toggleMenu(l.id)" type="button"
                        class="inline-flex items-center gap-1 rounded-md bg-cyan-800 px-2 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        <Printer class="w-3 h-3" />
                        Print
                        <ChevronDown class="w-4 h-4 transition-transform duration-200"
                          :class="{ 'rotate-180': openId === l.id }" />
                      </button>

                      <!-- Dropdown -->
                      <Transition enter-active-class="transition duration-150 ease-out"
                        enter-from-class="opacity-0 scale-95 translate-y-1"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 translate-y-1">
                        <div v-if="openId === l.id"
                          class="absolute right-0 z-50 mt-2 w-30 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                          <div class="p-1">
                            <a :href="`/app/dashboard/schedules/prints/${l.id}/print-sched`" target="_blank"
                              class="flex items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                              📄 Schedule
                            </a>

                            <a :href="`/app/dashboard/loanrecords/prints/${l.id}/print-atm`" target="_blank"
                              class="flex items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                              💳 ATM
                            </a>

                            <a :href="`/app/dashboard/loanrecords/prints/${l.id}/print-landlayout`" target="_blank"
                              class="flex items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                              🗺️ Land
                            </a>

                            <a :href="`/app/dashboard/schedules/prints/${l.id}/print-sched2`" target="_blank"
                              class="flex items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                              📑 Schedule 2
                            </a>

                            <a :href="`/app/dashboard/loanrecords/prints/${l.id}/print-receipt2`" target="_blank"
                              class="flex items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                              🧾 Receipt 2
                            </a>
                          </div>
                        </div>
                      </Transition>
                    </div>


                    <!-- <a
                      :href="`/app/dashboard/schedules/prints/${l.id}/print-sched`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-900 text-white text-sm"
                    >
                      Sched
                    </a>

                    <a
                      :href="`/app/dashboard/loanrecords/prints/${l.id}/print-atm`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-900 text-white text-sm"
                    >
                       ATM
                    </a>

                    <a
                      :href="`/app/dashboard/loanrecords/prints/${l.id}/print-landlayout`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-900 text-white text-sm"
                    >
                       Land
                    </a>

                    <a
                      :href="`/app/dashboard/schedules/prints/${l.id}/print-sched2`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                    >
                       Sched2
                    </a>

                    <a
                      :href="`/app/dashboard/loanrecords/prints/${l.id}/print-receipt2`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                    >
                       Receip2
                    </a> -->

                    <!-- <a
                      :href="`/app/dashboard/loanrecords/prints/${l.id}/print-contract2`"
                      target="_blank" rel="noopener"
                      class="px-1 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                    >
                       Contract2
                    </a> -->
                    
                  </div>
                </td>

                <!-- action -->
                <td class="px-1 py-1 text-sm">
                  <div class="flex flex-wrap items-center justify-left gap-1 py-1 sm:px-6">
                    <button
                      @click="editLoan(l.id)"
                      class="px-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Edit
                    </button>
                    <button
                      @click="openDeleteModal(l.id)"
                      class="px-1 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Delete
                    </button>
                      
                                        <!-- loan_status_id -->
                    <button disabled
                      :class="[
                        'px-1 py-0.1 rounded text-sm border',
                        l.loan_status_id == 1
                          ? 'text-indigo-700 border-indigo-600 bg-indigo-600/20 hover:bg-indigo-600/30'
                          : 'text-slate-700 border-slate-500 bg-slate-500/20 hover:bg-slate-500/30'
                      ]"
                    >
                      {{ l.loan_status_id == 1 ? 'Current' : 'Bad' }}
                    </button>
                    
                    <!-- loan_check_status -->
                    <button disabled
                      :class="[
                        'px-1 py-0.1 rounded text-sm border',
                        l.loan_check_status == 1
                          ? 'text-lime-700 border-lime-600 bg-lime-600/20 hover:bg-lime-600/30'
                          : 'text-yellow-700 border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30'
                      ]"
                    >
                      {{ l.loan_check_status == 1 ? 'Approved' : 'Pending' }}
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginated.length === 0">
                <td colspan="6" class="text-center py-6 text-gray-400">
                  No loan records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-sm">
          Page {{ page }} / {{ lastPageValue }}
          Total Records: <b>{{ total }}</b>
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPageValue"
          class="px-4 py-2 rounded-lg text-sm text-white border border-blue-700 bg-blue-500/60 disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </ComponentCard>

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
            Delete Loan
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
            <button @click="deleteLoan" type="button"
              class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 sm:w-auto">
              Delete Loan
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
  /* color: #555; */
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
input[type="date"] { appearance: none; -webkit-appearance: none;}

</style>