<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
})

import { reactive, ref, onMounted, watch } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import PermissionTable from "@/components/forms/PermissionTable.vue"

const { success, errorMsg } = useMessage()
const route = useRoute()
const userId = route.params.id

const loading = ref(false)
const isReady = ref(false)

type Permission = { id: number; name: string; slug: string }

type RolePermission = {
  id: number
  name: string
  slug: string
  permissions: Permission[]
}

type APIResponse = {
  employees: Record<string, string>
  roles: Record<string, string>
  role_permissions: RolePermission[]
}

// =============================
// STATE
// =============================
const form = reactive({
  emp_id: -1,
  role_id: -1,
  email: "",
  password: "",
  active: true,
  identifier_token: "",
  permissions: {} as Record<string, number>,
})

const employees = ref<{ id: number; label: string }[]>([])
const roles = ref<{ id: number; label: string }[]>([])
const rolePermissionsData = ref<RolePermission[]>([])
const user = ref<any>(null)
const isHydrating = ref(true)

const allPermissions = computed(() => {
  return rolePermissionsData.value.flatMap(r => r.permissions)
})

// =============================
// INIT ALL PERMISSIONS (BASE)
// =============================
const initializePermissions = () => {
  const all: Record<string, number> = {}

  rolePermissionsData.value.forEach(role => {
    role.permissions.forEach(p => {
      all[p.slug] = 0
    })
  })

  form.permissions = all
}

// =============================
// LOAD FORM DATA
// =============================
const fetchFormData = async () => {
  const res = await $fetch<APIResponse>(
    "/api/admin-secure/user-permissions-form-data"
  )

  const map = (obj: Record<string, string>) =>
    Object.entries(obj).map(([id, label]) => ({
      id: Number(id),
      label: String(label),
    }))

  employees.value = map(res.employees)
  roles.value = map(res.roles)
  rolePermissionsData.value = res.role_permissions

  initializePermissions()
}

onMounted(fetchFormData)

// =============================
// LOAD USER
// =============================
const loadUser = async () => {
  try {
    loading.value = true

    const res = await $fetch<any>(
      `/api/admin-secure/user-permissions/${userId}`
    )

    user.value = res?.data?.user
  } finally {
    loading.value = false
  }
}

onMounted(loadUser)

const resetPermissions = () => {
  Object.keys(form.permissions).forEach(k => {
    form.permissions[k] = 0
  })
}

// =============================
// ROLE CHANGE
// =============================
// watch(() => form.role_id, (id, oldId) => {
//   // 🚫 block initial hydration
//   if (isHydrating.value) return

//   // 🚫 ignore invalid
//   if (id === -1) return

//   // 🚫 avoid same value re-trigger
//   if (id === oldId) return

//   resetPermissions()

//   const role = rolePermissionsData.value.find(r => r.id === id)

//   role?.permissions.forEach(p => {
//     form.permissions[p.slug] = 1
//   })
// })


// =============================
// APPLY USER + ROLE PERMISSIONS (MAIN FIX)
// =============================
watch(
  [user, rolePermissionsData],
  ([u]) => {
    if (!u || !rolePermissionsData.value.length) return

    // 1. reset base structure
    initializePermissions()

    // 2. fill form fields
    form.emp_id = Number(u.emp_id ?? -1)
    form.role_id = Number(u.roles?.[0]?.id ?? -1)
    form.email = u.email ?? ""
    form.identifier_token = u.identifier_token ?? ""
    form.active = u.active == 1
    form.password = ""

    // 3. apply ROLE permissions first
    const role = rolePermissionsData.value.find(
      r => r.id === form.role_id
    )

    role?.permissions.forEach(p => {
      form.permissions[p.slug] = 1
    })

    // role permissions first
    // applyRolePermissions(form.role_id)
    resetPermissions()

    // user override
    u.permissions?.forEach((p: any) => {
      form.permissions[p.slug] = 1
    })

    isHydrating.value = false
    isReady.value = true
  },
  { immediate: true }
)


const applyRolePermissions = (roleId: number) => {
  if (!rolePermissionsData.value.length) return
  if (roleId === -1) return

  // reset all permissions
  Object.keys(form.permissions).forEach(k => {
    form.permissions[k] = 0
  })

  // find role
  const role = rolePermissionsData.value.find(r => r.id === roleId)

  // apply role permissions
  role?.permissions.forEach(p => {
    form.permissions[p.slug] = 1
  })
}



// =============================
// SUBMIT
// =============================
const submitForm = async () => {
  loading.value = true
  errorMsg.value = ""

  try {
    const payload = {
      emp_id: form.emp_id,
      role_id: form.role_id,
      email: form.email,
      password: form.password,
      default_password: "",
      active: form.active ? "1" : "0",
      identifier_token: form.identifier_token || "",
      permissions: form.permissions,
    }

    await $fetch(
      `/api/admin-secure/user-permissions/${userId}`,
      {
        method: "PUT",
        body: payload,
      }
    )

    success("Updated successfully")

    navigateTo(
      `/app/dashboard/user-permissions/${userId}`
    )
  } catch (err: any) {
    errorMsg.value =
      err?.data?.message || "Error while saving"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">

    <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 text-red-600 rounded">
      {{ errorMsg }}
    </div>

    <div class="grid grid-cols-2 gap-6">

      <ComponentCard title="Account">
        <select v-model.number="form.emp_id" class="input">
          <option :value="-1">Choose</option>
          <option v-for="e in employees" :key="e.id" :value="e.id">
            {{ e.label }}
          </option>
        </select>

        <select v-model.number="form.role_id" @change="applyRolePermissions(form.role_id)"
          class="input mt-2">
          <option :value="-1">Choose</option>
          <option v-for="r in roles" :key="r.id" :value="r.id">
            {{ r.label }}
          </option>
        </select>

        <input v-model="form.email" class="input mt-2" placeholder="Email" />
        <input v-model="form.password" class="input mt-2" placeholder="Password" />

      </ComponentCard>

      <ComponentCard title="Settings">
        <input v-model="form.identifier_token" class="input" placeholder="Token" />

        <label class="flex gap-2 mt-3">
          <input type="checkbox" v-model="form.active" />
          Active
        </label>
      </ComponentCard>

    </div>

    <!-- ✅ IMPORTANT -->
    <ComponentCard title="Permissions" class="mt-6">
      <PermissionTable
        v-model="form.permissions"
        :data="allPermissions"
      />
    </ComponentCard>

    <div class="mt-6 text-right">
      <button @click="submitForm" class="btn-primary">
        {{ loading ? "Saving..." : "Update" }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
}
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
.error {
  font-size: 12px;
  color: red;
}
</style>