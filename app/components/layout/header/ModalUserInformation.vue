<script setup lang="ts">
import { ref, watch, computed } from "vue"

interface UserResponse {
  user: {
    id: number
    name: string
    email: string
    photo_url: string
  }
  employee: {
    id: number
    full_name: string
    phone: string | null
    telegram: string | null
    facebook: string | null
    current_address: string | null
    hire_date: string | null
    dob: string | null
    gender_id: number | null
    active: number
    status: {
      id: number
      status_kh: string
    }
  }
  roles: string[]
  roles_name: string[]
  permissions: string[]
}

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(["close"])

const loading = ref(false)
const userInfo = ref<UserResponse | null>(null)

/* ----------------------------
   API
---------------------------- */
const loadUserInformation = async () => {
  try {
    loading.value = true
    userInfo.value = await $fetch<UserResponse>("/api/admin-secure/user")
  } finally {
    loading.value = false
  }
}

/* ----------------------------
   WATCH OPEN
---------------------------- */
watch(
  () => props.isOpen,
  (value) => value && loadUserInformation()
)

/* ----------------------------
   HELPERS
---------------------------- */
const handleClose = () => emit("close")

const getGender = (id?: number | null) => {
  if (id === 1) return "Male"
  if (id === 2) return "Female"
  return "-"
}

/* ----------------------------
   PERMISSIONS GROUP
---------------------------- */
const groupedPermissions = computed(() => {
  if (!userInfo.value?.permissions) return {}

  return userInfo.value.permissions.reduce(
    (acc: Record<string, string[]>, permission) => {
      const [action = "", ...moduleParts] = permission.split("-")

      const module = moduleParts
        .join(" ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

      if (!acc[module]) acc[module] = []
      acc[module].push(action)

      return acc
    },
    {}
  )
})

/* ----------------------------
   ACTION COLORS
---------------------------- */
const actionClass = (action: string) => {
  const map: Record<string, string> = {
    view: "bg-green-100 text-green-700",
    create: "bg-blue-100 text-blue-700",
    edit: "bg-yellow-100 text-yellow-700",
    delete: "bg-red-100 text-red-700",
  }

  return map[action] || "bg-gray-100 text-gray-700"
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div
        class="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <!-- HEADER -->
        <div
          class="px-8 py-2 border-b border-gray-100 flex items-center justify-between"
        >
          <h2 class="text-2xl text-blue-800">User Information</h2>

          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <!-- BODY -->
        <div class="p-8 max-h-[80vh] overflow-y-auto">

          <!-- LOADING -->
          <div
            v-if="loading"
            class="text-center py-20 text-gray-500"
          >
            Loading user information...
          </div>

          <!-- CONTENT -->
          <template v-else-if="userInfo">

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">

              <!-- LEFT -->
              <div class="lg:col-span-2">

                <!-- PROFILE -->
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-4">

                  <img
                    :src="userInfo.user.photo_url"
                    class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />

                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ userInfo.employee.full_name }}
                    </h3>

                    <p class="text-gray-500">
                      {{ userInfo.user.email }}
                    </p>

                    <div class="flex flex-wrap gap-2 mt-3">
                      <span
                        v-for="role in userInfo.roles_name"
                        :key="role"
                        class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                      >
                        {{ role }}
                      </span>

                      <span
                        class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700"
                      >
                        {{ userInfo.employee.active === 1 ? "Active" : "Inactive" }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- INFO GRID -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label class="text-sm text-gray-500">Full Name</label>
                    <div class="font-medium">
                      {{ userInfo.employee.full_name }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Email</label>
                    <div class="font-medium">
                      {{ userInfo.user.email }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Phone</label>
                    <div class="font-medium">
                      {{ userInfo.employee.phone || "-" }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Telegram</label>
                    <div class="font-medium">
                      {{ userInfo.employee.telegram || "-" }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Facebook</label>
                    <div class="font-medium">
                      {{ userInfo.employee.facebook || "-" }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Gender</label>
                    <div class="font-medium">
                      {{ getGender(userInfo.employee.gender_id) }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">DOB</label>
                    <div class="font-medium">
                      {{ userInfo.employee.dob || "-" }}
                    </div>
                  </div>

                  <div>
                    <label class="text-sm text-gray-500">Hire Date</label>
                    <div class="font-medium">
                      {{ userInfo.employee.hire_date || "-" }}
                    </div>
                  </div>

                </div>

                <!-- ADDRESS -->
                <div class="mt-8">
                  <label class="text-sm text-gray-500">
                    Current Address
                  </label>
                  <div class="font-medium mt-1">
                    {{ userInfo.employee.current_address || "-" }}
                  </div>
                </div>

              </div>

              <!-- RIGHT -->
              <div class="lg:col-span-1">

                <label class="block text-md text-blue-800 mb-3">
                  Permissions
                </label>

                <div class="space-y-3 max-h-[55vh] overflow-y-auto pr-2">

                  <div
                    v-for="(actions, module) in groupedPermissions"
                    :key="module"
                    class="p-4 border rounded-xl bg-white shadow-sm"
                  >
                    <div class="font-semibold text-gray-800 capitalize mb-1">
                      {{ module }}
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="action in actions"
                        :key="action"
                        :class="actionClass(action)"
                        class="px-2 py-1 text-xs rounded-full font-medium"
                      >
                        {{ action }}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </template>

          <!-- EMPTY -->
          <div v-else class="text-center py-20 text-gray-500">
            No user information found.
          </div>

        </div>

        <!-- FOOTER -->
        <div class="px-8 py-4 border-t border-gray-100"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>