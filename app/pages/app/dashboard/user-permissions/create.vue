<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "User Permissions", subTitle: "Create" },
  middleware: ["role"],
  roles: ["admin", "ceo"]
})

useHead({
  title: "Create User",
})

import { z } from "zod"
import { reactive, onMounted, watch, ref } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import PermissionTable from "@/components/forms/PermissionTable.vue"

const { successMsg, errorMsg, success } = useMessage()
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

// TYPES
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
// FORM
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

// =============================
// DATA
// =============================
const employees = ref<{ id: number; label: string }[]>([])
const roles = ref<{ id: number; label: string }[]>([])
const rolePermissionsData = ref<RolePermission[]>([])

// Flatten all permissions from all roles for the PermissionTable
const allRolePermissions = computed(() => {
  return rolePermissionsData.value.flatMap(role => role.permissions)
})


// =============================
// ✅ Initialize ALL permissions
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
// Fetch metadata
// =============================
const fetchFormData = async () => {
  try {
    const res = await $fetch<APIResponse>("/api/admin-secure/user-permissions-form-data")

    const map = (obj: Record<string, string>) =>
      Object.entries(obj).map(([id, label]) => ({
        id: Number(id),
        label: String(label)
      }))

    employees.value = map(res.employees)
    roles.value = map(res.roles)
    rolePermissionsData.value = res.role_permissions

    initializePermissions() // ✅ IMPORTANT

  } catch (err) {
    errorMsg.value = "Failed to load form data"
  }
}

onMounted(fetchFormData)

// =============================
// VALIDATION
// =============================
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
// Role auto permissions
// =============================
const resetPermissions = () => {
  Object.keys(form.permissions).forEach(k => {
    form.permissions[k] = 0
  })
}



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
  errorMsg.value = null

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
      permissions: form.permissions   // ✅ KEEP STRUCTURE
    }


      const res = await $fetch("/api/admin-secure/user-permissions", {
        method: "POST",
        body: payload
      })

      success("User created successfully!")

      if (res?.id) {
        await navigateTo(`/app/dashboard/user-permissions/${res.id}`)
      }

    } catch (err: any) {
      errorMsg.value = err?.data?.message || "Error saving user"
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- LEFT -->
      <ComponentCard title="Account Credentials">
        <div class="space-y-3">

          <select v-model.number="form.emp_id" class="input">
            <option :value="-1">Choose Employee</option>
            <option v-for="e in employees" :key="e.id" :value="e.id">
              {{ e.label }}
            </option>
          </select>
          <p class="error">{{ errors.emp_id }}</p>

          <select v-model.number="form.role_id" class="input" @change="applyRolePermissions(form.role_id)">
            <option :value="-1">Choose Role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.label }}
            </option>
          </select>
          <p class="error">{{ errors.role_id }}</p>

          <input v-model="form.email" class="input" placeholder="Email" />
          <p class="error">{{ errors.email }}</p>

          <input type="password" v-model="form.password" class="input" placeholder="Password" />
          <p class="error">{{ errors.password }}</p>

        </div>
      </ComponentCard>

      <!-- RIGHT -->
      <ComponentCard title="Settings">
        <div class="space-y-3">
          <input v-model="form.identifier_token" class="input" placeholder="Token" />

          <label class="flex gap-2">
            <input type="checkbox" v-model="form.active" />
            Active
          </label>
        </div>
      </ComponentCard>

    </div>

    <!-- ✅ PERMISSIONS -->
    <div class="mt-6">
      <ComponentCard title="Permissions">
        <PermissionTable
          v-model="form.permissions"
          :data="allRolePermissions"
        />
      </ComponentCard>
    </div>

    <!-- ACTION -->
    <div class="mt-6 text-right">
      <button @click="submitForm" 
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {{ loading ? "Saving..." : "Save User" }}
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