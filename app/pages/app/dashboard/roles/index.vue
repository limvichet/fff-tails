<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Roles", subTitle: "Search" },
  ssr: false
})

useHead({
  title: "Search roles",
  meta: [{ name: "roles", content: "search roles" }],
})

import ComponentCard from "@/components/common/ComponentCard.vue"
import { ref, computed, onMounted, watch } from "vue"
import { useMessage } from "~/composables/useMessage"

const { errorMsg } = useMessage()

// TYPES
type Role = {
  id: number
  name: string
  slug: string
  active: number
}

type ApiResponse = {
  success: boolean
  data: {
    current_page: number
    data: Role[]
    per_page: number
    total: number
    last_page: number
  }
}

// STATE
const roles = ref<Role[]>([])
const loading = ref(false)

const searchInput = ref("")
const searchQuery = ref("")

const page = ref(1)
const total = ref(0)
const lastPageValue = ref(1)
const perPage = 10

// FETCH
const fetchRoles = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<ApiResponse>(
      "/api/admin-secure/roles",
      {
        method: "GET",
        query: {
          page: page.value,
          keyword: searchQuery.value || undefined,
        },
      }
    )

    roles.value = res.data.data || []
    total.value = res.data.total || 0
    lastPageValue.value = res.data.last_page || 1

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch roles"
    roles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRoles)

// COMPUTED
const paginated = computed(() => roles.value)

// SEARCH (debounce)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchRoles()
  }, 400)
})

// PAGINATION
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchRoles()
  }
}

const nextPage = () => {
  if (page.value < lastPageValue.value) {
    page.value++
    fetchRoles()
  }
}
</script>

<template>
  <div>
    <ComponentCard title="Roles">

      <!-- Search -->
      <div class="relative mb-4">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search roles..."
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
              v-for="(r, i) in paginated"
              :key="r.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-3 py-2">
                {{ (page - 1) * perPage + i + 1 }}
              </td>

              <td class="px-3 py-2 font-medium">
                {{ r.name }}
              </td>

              <td class="px-3 py-2 text-gray-500">
                {{ r.slug }}
              </td>

              <td class="px-3 py-2">
                <span
                  :class="r.active
                    ? 'text-green-600 font-semibold'
                    : 'text-red-500 font-semibold'"
                >
                  {{ r.active ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-400">
                No roles found.
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
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-sm text-gray-500">
          Page {{ page }} / {{ lastPageValue }}
        </span>

        <button
          @click="nextPage"
          :disabled="page === lastPageValue"
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
</style>