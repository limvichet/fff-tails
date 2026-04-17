<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "User Permissions", subTitle: "List" },
  ssr: false
})

useHead({
  title: "User Permissions",
})

import ComponentCard from "@/components/common/ComponentCard.vue"
import { ref, computed, onMounted, watch } from "vue"
import { useMessage } from "~/composables/useMessage"

const { errorMsg, successMsg } = useMessage()

// TYPES
type User = {
  id: number
  emp_id: number
  active: number
  surname: string
  first_name: string
  full_name: string
  role_name: string
}

type ApiResponse = {
  success: boolean
  data: {
    current_page: number
    data: User[]
    last_page: number
    per_page: number
    total: number
  }
}

// STATE
const users = ref<User[]>([])
const loading = ref(false)

const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const perPage = 10

const searchInput = ref("")
const searchQuery = ref("")

// FETCH
const fetchUsers = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>("/api/admin-secure/user-permissions", {
      method: "GET",
      query: {
        page: page.value,
        param: searchQuery.value || undefined,
      },
    })

    users.value = res.data.data || []
    lastPage.value = res.data.last_page
    total.value = res.data.total

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch users"
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// SEARCH (debounce)
let debounce: any = null

watch(searchInput, (val) => {
  if (debounce) clearTimeout(debounce)

  debounce = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchUsers()
  }, 400)
})

// PAGINATION
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchUsers()
  }
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value++
    fetchUsers()
  }
}

// COMPUTED
const paginated = computed(() => users.value)

// STATUS BADGE
const getStatusClass = (active: number) => {
  return active === 1
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600"
}
</script>

<template>
  <div>
    <ComponentCard title="User Permissions">

      <!-- SEARCH -->
      <div class="relative mb-4">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search by name or role..."
          class="input"
        />
      </div>

      <!-- MESSAGES -->
      <div v-if="errorMsg" class="mb-3 text-red-400 text-sm">
        {{ errorMsg }}
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-6 text-gray-400">
        Loading...
      </div>

      <!-- TABLE -->
      <div v-else class="overflow-x-auto border rounded-xl">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 text-left">#</th>
              <th class="px-3 py-2 text-left">Employee</th>
              <th class="px-3 py-2 text-left">Role</th>
              <th class="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(u, i) in paginated"
              :key="u.id"
              class="border-t hover:bg-blue-50"
            >
              <td class="px-3 py-2">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="px-3 py-2 font-medium">
                {{ u.full_name }}
              </td>

              <td class="px-3 py-2">
                {{ u.role_name }}
              </td>

              <td class="px-3 py-2">
                <span
                  class="px-2 py-1 rounded text-xs font-semibold"
                  :class="getStatusClass(u.active)"
                >
                  {{ u.active === 1 ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-400">
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-sm">
          Page {{ page }} / {{ lastPage }}
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPage"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </ComponentCard>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
}
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
</style>