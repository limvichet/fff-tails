<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["role"],
  roles: ["admin", "ceo"]
})

import { z } from "zod"
import { reactive, ref, onMounted, watch } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import PermissionTable from "@/components/forms/PermissionTable.vue"

const { success, errorMsg, successMsg } = useMessage()
const route = useRoute()
const userId = route.params.id

const loading = ref(false)
const isReady = ref(false)

  errorMsg.value = null
  successMsg.value = null

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
    "/api/admin-secure/user-permissions-form-data-all"
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
// VALIDATION
// =============================
const errors = reactive<Record<string, string>>({})
const schema = z.object({
  emp_id: z.number().min(1, "Please select an employee"),
  role_id: z.number().min(1, "Please select a role"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  active: z.boolean(),
  identifier_token: z.string().optional(),
  permissions: z.record(z.string(), z.number()).optional()
})

const validateField = (field: keyof typeof schema.shape) => {
  try {
    const part = schema.pick({ [field]: true } as any)
    part.parse({ [field]: form[field as keyof typeof form] })
    errors[field as string] = ""
  } catch (err: any) {
    errors[field as string] = err.errors?.[0]?.message || ""
  }
}

// Watch validation
watch(() => form.email, () => validateField("email"))
watch(() => form.password, () => validateField("password"))
watch(() => form.emp_id, () => validateField("emp_id"))
watch(() => form.role_id, () => validateField("role_id"))

// =============================
// SUBMIT
// =============================
const submitForm = async () => {
  loading.value = true
  errorMsg.value = ""

  Object.keys(errors).forEach(k => errors[k] = "")

  const parsed = schema.safeParse(form)

  if (!parsed.success) {
    parsed.error.errors.forEach(e => {
      errors[e.path[0] as string] = e.message
    })
    loading.value = false
    return
  }

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

    successMsg.value = "Data updated successfully!"

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

    <!-- Messages -->
    <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
      {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
      {{ successMsg }}
    </div>

    <div class="grid grid-cols-2 gap-6">

      <ComponentCard title="Account">
        <select v-model.number="form.emp_id" class="input bg-gray-100 cursor-not-allowed" disabled>
          <option :value="-1">Choose</option>
          <option v-for="e in employees" :key="e.id" :value="e.id">
            {{ e.label }}
          </option>
        </select>
        <p class="error">{{ errors.emp_id }}</p>


        <select v-model.number="form.role_id" @change="applyRolePermissions(form.role_id)"
          class="input mt-2">
          <option :value="-1">Choose</option>
          <option v-for="r in roles" :key="r.id" :value="r.id">
            {{ r.label }}
          </option>
        </select>
        <p class="error">{{ errors.role_id }}</p>

        <input v-model="form.email" class="input mt-2" placeholder="Email" />
        <p class="error">{{ errors.email }}</p>

        <input v-model="form.password" class="input mt-2" placeholder="Password" />
        <p class="error">{{ errors.password }}</p>

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
      <button @click="submitForm" 
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
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