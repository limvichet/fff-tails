<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Permissions", subTitle: "Search" },
  ssr: false
})

useHead({
  title: "Search permissions",
  meta: [{ name: "permissions", content: "search permissions" }],
})

import ComponentCard from "@/components/common/ComponentCard.vue"
import { ref, computed, onMounted, watch } from "vue"
import { useMessage } from "~/composables/useMessage"

// messages
const { errorMsg } = useMessage()

// TYPES
type Permission = {
  id: number
  name: string
  slug: string
  active: number
}

type ApiResponse = {
  success: boolean
  data: {
    current_page: number
    data: Permission[]
    per_page: number
    total: number
    last_page: number
  }
}

// STATE
const permissions = ref<Permission[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const total = ref(0)
const lastPageValue = ref(1)
const perPage = 10

// FETCH
const fetchPermissions = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>(
      "/admin-secure/permissions",
      {
        method: "GET",
        query: {
          page: page.value,
          keyword: searchQuery.value || undefined,
        },
      }
    )

    permissions.value = res.data.data || []
    total.value = res.data.total || 0
    lastPageValue.value = res.data.last_page || 1

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch permissions"
    permissions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchPermissions)

// COMPUTED
const paginated = computed(() => permissions.value)

// SEARCH (debounce)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchPermissions()
  }, 400)
})

// PAGINATION
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchPermissions()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchPermissions()
  }
}
</script>

<template>
  <div>
    <ComponentCard title="Permissions">

      <!-- Search -->
      <div class="relative mb-4">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search permissions..."
          class="input"
        />
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-3 text-red-400 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-gray-400">
        Loading...
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto border rounded-xl">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 text-left">#</th>
              <th class="px-3 py-2 text-left">Name</th>
              <th class="px-3 py-2 text-left">Slug</th>
              <th class="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(p, i) in paginated"
              :key="p.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-3 py-2">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="px-3 py-2">
                {{ p.name }}
              </td>

              <td class="px-3 py-2 text-gray-500">
                {{ p.slug }}
              </td>

              <td class="px-3 py-2">
                <span
                  :class="p.active
                    ? 'text-green-600 font-semibold'
                    : 'text-red-500 font-semibold'"
                >
                  {{ p.active ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-400">
                No permissions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="btn-pagination disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-sm text-blue-500">
          Page {{ page }} / {{ lastPageValue }} Total Records: <b>{{ total }}</b>
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPageValue"
          class="btn-pagination disabled:opacity-50"
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